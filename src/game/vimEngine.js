const BRACKET_PAIRS = {
  "(": ")",
  "{": "}",
  "[": "]"
};

const REVERSE_BRACKET_PAIRS = {
  ")": "(",
  "}": "{",
  "]": "["
};

function splitLines(text) {
  return text.length ? text.split("\n") : [""];
}

function cloneCursor(cursor) {
  return { line: cursor.line, col: cursor.col };
}

function cloneAction(action) {
  return action ? structuredClone(action) : null;
}

function cloneState(state) {
  return {
    ...state,
    lines: [...state.lines],
    cursor: cloneCursor(state.cursor),
    pending: state.pending ? { ...state.pending } : null,
    currentCommandKeys: [...state.currentCommandKeys],
    lastChange: cloneAction(state.lastChange),
    lastFind: state.lastFind ? { ...state.lastFind } : null,
    activeCommandMeta: state.activeCommandMeta
      ? {
          ...state.activeCommandMeta,
          tags: [...state.activeCommandMeta.tags],
          repeatableAction: cloneAction(state.activeCommandMeta.repeatableAction)
        }
      : null,
    commandStart: state.commandStart
      ? {
          lines: [...state.commandStart.lines],
          cursor: cloneCursor(state.commandStart.cursor),
          mode: state.commandStart.mode,
          lastChange: cloneAction(state.commandStart.lastChange),
          lastFind: state.commandStart.lastFind
            ? { ...state.commandStart.lastFind }
            : null
        }
      : null
  };
}

function snapshotForCommand(state) {
  return {
    lines: [...state.lines],
    cursor: cloneCursor(state.cursor),
    mode: state.mode,
    lastChange: cloneAction(state.lastChange),
    lastFind: state.lastFind ? { ...state.lastFind } : null
  };
}

function restoreFromSnapshot(snapshot) {
  return {
    lines: [...snapshot.lines],
    cursor: cloneCursor(snapshot.cursor),
    mode: snapshot.mode,
    pending: null,
    countBuffer: "",
    currentCommandKeys: [],
    commandStart: null,
    lastChange: cloneAction(snapshot.lastChange),
    lastFind: snapshot.lastFind ? { ...snapshot.lastFind } : null,
    activeCommandMeta: null,
    lastResolvedCommand: null
  };
}

function clearCommandState(state) {
  state.pending = null;
  state.countBuffer = "";
  state.currentCommandKeys = [];
  state.commandStart = null;
  state.activeCommandMeta = null;
  return state;
}

function getText(state) {
  return state.lines.join("\n");
}

function getLine(state, line) {
  return state.lines[Math.max(0, Math.min(line, state.lines.length - 1))] ?? "";
}

function clampNormalCursor(state) {
  const line = getLine(state, state.cursor.line);
  if (line.length === 0) {
    state.cursor.col = 0;
    return state;
  }

  state.cursor.col = Math.max(0, Math.min(state.cursor.col, line.length - 1));
  return state;
}

function clampInsertCursor(state) {
  const line = getLine(state, state.cursor.line);
  state.cursor.col = Math.max(0, Math.min(state.cursor.col, line.length));
  return state;
}

function positionToIndex(lines, cursor) {
  let index = 0;
  for (let line = 0; line < cursor.line; line += 1) {
    index += lines[line].length + 1;
  }
  return index + cursor.col;
}

function indexToCursor(lines, index, preferInsert = false) {
  let remaining = Math.max(0, index);

  for (let line = 0; line < lines.length; line += 1) {
    const lineLength = lines[line].length;
    if (remaining <= lineLength) {
      return {
        line,
        col: preferInsert ? remaining : Math.min(remaining, Math.max(lineLength - 1, 0))
      };
    }
    remaining -= lineLength + 1;
  }

  const lastLine = lines.length - 1;
  const lastLength = lines[lastLine].length;
  return {
    line: lastLine,
    col: preferInsert ? lastLength : Math.max(lastLength - 1, 0)
  };
}

function normalizeKey(rawKey) {
  if (rawKey === "Esc") {
    return "Escape";
  }
  return rawKey;
}

function isWordChar(char) {
  return /[A-Za-z0-9_]/.test(char || "");
}

function isWhitespace(char) {
  return /\s/.test(char || "");
}

function prepareCommand(state, key) {
  if (!state.commandStart) {
    state.commandStart = snapshotForCommand(state);
    state.currentCommandKeys = [];
  }
  state.currentCommandKeys.push(key);
}

function buildCommandLabel(state, baseLabel) {
  const prefix = state.countBuffer ? `${state.countBuffer}` : "";
  return `${prefix}${baseLabel}`;
}

function buildCommandTags(state, baseTag) {
  const tags = [];
  if (state.countBuffer) {
    tags.push("count");
  }
  tags.push(baseTag);
  return tags;
}

function rejectDisallowedCommand(state, label) {
  const restored = restoreFromSnapshot(state.commandStart);
  return {
    state: restored,
    error: `Lesson lock: \`${label}\` is not available in this mission.`,
    command: null
  };
}

function ensureAllowed(state, label, tags, allowedScope) {
  if (!allowedScope) {
    return null;
  }

  const invalid = tags.find((tag) => !allowedScope.includes(tag));
  if (!invalid) {
    return null;
  }

  return rejectDisallowedCommand(state, label);
}

function finishCommand(state, meta, allowedScope) {
  const blocked = ensureAllowed(state, meta.label, meta.tags, allowedScope);
  if (blocked) {
    return blocked;
  }

  if (meta.changed && meta.repeatableAction) {
    state.lastChange = cloneAction(meta.repeatableAction);
  }

  state.lastResolvedCommand = {
    label: meta.label,
    tags: [...meta.tags],
    changed: meta.changed
  };

  clearCommandState(state);

  return {
    state,
    error: "",
    command: state.lastResolvedCommand
  };
}

function abortCommand(state, error) {
  const restored = state.commandStart ? restoreFromSnapshot(state.commandStart) : cloneState(state);
  clearCommandState(restored);
  return {
    state: restored,
    error,
    command: null
  };
}

function moveHorizontal(state, amount) {
  const line = getLine(state, state.cursor.line);
  if (!line.length) {
    state.cursor.col = 0;
    return state;
  }
  state.cursor.col = Math.max(0, Math.min(state.cursor.col + amount, line.length - 1));
  return state;
}

function moveVertical(state, amount) {
  state.cursor.line = Math.max(0, Math.min(state.cursor.line + amount, state.lines.length - 1));
  clampNormalCursor(state);
  return state;
}

function moveLineStart(state) {
  state.cursor.col = 0;
  return state;
}

function moveWordForward(state, count) {
  const text = getText(state);
  let index = positionToIndex(state.lines, state.cursor);

  for (let step = 0; step < count; step += 1) {
    let cursor = index;

    if (isWordChar(text[cursor])) {
      while (cursor < text.length && isWordChar(text[cursor])) {
        cursor += 1;
      }
    } else if (!isWhitespace(text[cursor])) {
      while (cursor < text.length && !isWhitespace(text[cursor]) && !isWordChar(text[cursor])) {
        cursor += 1;
      }
    }

    while (cursor < text.length && !isWordChar(text[cursor])) {
      cursor += 1;
    }

    if (cursor >= text.length) {
      index = Math.max(0, text.length - 1);
      break;
    }

    index = cursor;
  }

  state.cursor = indexToCursor(state.lines, index);
  return clampNormalCursor(state);
}

function moveWordBackward(state, count) {
  const text = getText(state);
  let index = positionToIndex(state.lines, state.cursor);

  for (let step = 0; step < count; step += 1) {
    let cursor = Math.max(0, index - 1);

    while (cursor > 0 && !isWordChar(text[cursor])) {
      cursor -= 1;
    }
    while (cursor > 0 && isWordChar(text[cursor - 1])) {
      cursor -= 1;
    }

    index = cursor;
  }

  state.cursor = indexToCursor(state.lines, index);
  return clampNormalCursor(state);
}

function moveWordEnd(state, count) {
  const text = getText(state);
  let index = positionToIndex(state.lines, state.cursor);

  for (let step = 0; step < count; step += 1) {
    let cursor = index;
    if (!isWordChar(text[cursor])) {
      while (cursor < text.length && !isWordChar(text[cursor])) {
        cursor += 1;
      }
    }
    while (cursor < text.length - 1 && isWordChar(text[cursor + 1])) {
      cursor += 1;
    }
    index = cursor;
  }

  state.cursor = indexToCursor(state.lines, index);
  return clampNormalCursor(state);
}

function runFind(state, findType, targetChar, count) {
  const line = getLine(state, state.cursor.line);
  let searchFrom = state.cursor.col + 1;
  let foundAt = -1;

  for (let step = 0; step < count; step += 1) {
    foundAt = line.indexOf(targetChar, searchFrom);
    if (foundAt === -1) {
      return false;
    }
    searchFrom = foundAt + 1;
  }

  state.cursor.col = findType === "t" ? Math.max(0, foundAt - 1) : foundAt;
  state.lastFind = { targetChar, findType };
  return true;
}

function repeatFind(state, count) {
  if (!state.lastFind) {
    return false;
  }
  return runFind(state, state.lastFind.findType, state.lastFind.targetChar, count);
}

function matchPairAtIndex(text, index) {
  const char = text[index];
  const open = BRACKET_PAIRS[char];
  const close = REVERSE_BRACKET_PAIRS[char];

  if (open) {
    let depth = 0;
    for (let cursor = index; cursor < text.length; cursor += 1) {
      if (text[cursor] === char) {
        depth += 1;
      } else if (text[cursor] === open) {
        depth -= 1;
        if (depth === 0) {
          return cursor;
        }
      }
    }
  }

  if (close) {
    let depth = 0;
    for (let cursor = index; cursor >= 0; cursor -= 1) {
      if (text[cursor] === char) {
        depth += 1;
      } else if (text[cursor] === close) {
        depth -= 1;
        if (depth === 0) {
          return cursor;
        }
      }
    }
  }

  return -1;
}

function jumpMatchingPair(state) {
  const text = getText(state);
  const index = positionToIndex(state.lines, state.cursor);
  const match = matchPairAtIndex(text, index);
  if (match === -1) {
    return false;
  }

  state.cursor = indexToCursor(state.lines, match);
  return true;
}

function findWordRange(state) {
  const text = getText(state);
  let index = positionToIndex(state.lines, state.cursor);

  if (!isWordChar(text[index]) && isWordChar(text[index - 1])) {
    index -= 1;
  }
  if (!isWordChar(text[index])) {
    return null;
  }

  let start = index;
  let end = index + 1;

  while (start > 0 && isWordChar(text[start - 1])) {
    start -= 1;
  }
  while (end < text.length && isWordChar(text[end])) {
    end += 1;
  }

  return { start, end };
}

function findQuoteRange(state, quote, includeBounds) {
  const line = getLine(state, state.cursor.line);
  let left = state.cursor.col;
  let right = state.cursor.col;

  while (left >= 0) {
    if (line[left] === quote && line[left - 1] !== "\\") {
      break;
    }
    left -= 1;
  }

  while (right < line.length) {
    if (line[right] === quote && line[right - 1] !== "\\") {
      break;
    }
    right += 1;
  }

  if (left < 0 || right >= line.length || left === right) {
    return null;
  }

  const lineOffset = positionToIndex(state.lines, { line: state.cursor.line, col: 0 });
  return {
    start: lineOffset + left + (includeBounds ? 0 : 1),
    end: lineOffset + right + (includeBounds ? 1 : 0)
  };
}

function findEnclosingPairRange(state, open, close, includeBounds) {
  const text = getText(state);
  const cursorIndex = positionToIndex(state.lines, state.cursor);

  for (let left = cursorIndex; left >= 0; left -= 1) {
    if (text[left] !== open) {
      continue;
    }

    const match = matchPairAtIndex(text, left);
    if (match !== -1 && match >= cursorIndex) {
      return {
        start: left + (includeBounds ? 0 : 1),
        end: match + (includeBounds ? 1 : 0)
      };
    }
  }

  return null;
}

function getTextObjectRange(state, token) {
  if (token === "iw") {
    return findWordRange(state);
  }
  if (token === "ib") {
    return findEnclosingPairRange(state, "(", ")", false);
  }
  if (token === "ab") {
    return findEnclosingPairRange(state, "(", ")", true);
  }
  if (token === 'i"') {
    return findQuoteRange(state, '"', false);
  }
  if (token === 'a"') {
    return findQuoteRange(state, '"', true);
  }
  if (token === "i(") {
    return findEnclosingPairRange(state, "(", ")", false);
  }
  if (token === "a(") {
    return findEnclosingPairRange(state, "(", ")", true);
  }
  if (token === "i{") {
    return findEnclosingPairRange(state, "{", "}", false);
  }
  if (token === "a{") {
    return findEnclosingPairRange(state, "{", "}", true);
  }
  return null;
}

function replaceRange(state, start, end, replacement, enterInsert) {
  const oldText = getText(state);
  const nextText = `${oldText.slice(0, start)}${replacement}${oldText.slice(end)}`;
  state.lines = splitLines(nextText);

  const nextIndex = start + replacement.length;
  if (enterInsert) {
    state.mode = "insert";
    state.cursor = indexToCursor(state.lines, nextIndex, true);
    return clampInsertCursor(state);
  }

  state.mode = "normal";
  if (!nextText.length) {
    state.cursor = { line: 0, col: 0 };
    return state;
  }

  const normalIndex = Math.min(start, Math.max(nextText.length - 1, 0));
  state.cursor = indexToCursor(state.lines, normalIndex);
  return clampNormalCursor(state);
}

function insertAtCursor(state, text) {
  const index = positionToIndex(state.lines, state.cursor);
  const current = getText(state);
  const next = `${current.slice(0, index)}${text}${current.slice(index)}`;
  state.lines = splitLines(next);
  state.cursor = indexToCursor(state.lines, index + text.length, true);
  return clampInsertCursor(state);
}

function backspaceInsert(state) {
  const index = positionToIndex(state.lines, state.cursor);
  if (index === 0) {
    return state;
  }
  const current = getText(state);
  const next = `${current.slice(0, index - 1)}${current.slice(index)}`;
  state.lines = splitLines(next);
  state.cursor = indexToCursor(state.lines, index - 1, true);
  return clampInsertCursor(state);
}

function appendInsertedText(state, text) {
  if (!state.activeCommandMeta?.repeatableAction) {
    return;
  }
  state.activeCommandMeta.repeatableAction.insertedText += text;
}

function trimInsertedText(state) {
  if (!state.activeCommandMeta?.repeatableAction) {
    return false;
  }
  const current = state.activeCommandMeta.repeatableAction.insertedText;
  if (!current.length) {
    return false;
  }
  state.activeCommandMeta.repeatableAction.insertedText = current.slice(0, -1);
  return true;
}

function beginInsertCommand(state, meta, allowedScope) {
  const blocked = ensureAllowed(state, meta.label, meta.tags, allowedScope);
  if (blocked) {
    return blocked;
  }
  state.mode = "insert";
  state.pending = null;
  state.countBuffer = "";
  state.activeCommandMeta = {
    ...meta,
    tags: [...meta.tags],
    repeatableAction: cloneAction(meta.repeatableAction)
  };
  return {
    state,
    error: "",
    command: null
  };
}

function applyRepeatableAction(state, action) {
  const next = cloneState(state);

  if (action.type === "deleteTextObject") {
    const range = getTextObjectRange(next, action.object);
    if (!range) {
      return { state, error: "Nothing here matches the last deletion target." };
    }
    replaceRange(next, range.start, range.end, "", false);
    return { state: next, error: "" };
  }

  if (action.type === "changeTextObject") {
    const range = getTextObjectRange(next, action.object);
    if (!range) {
      return { state, error: "Nothing here matches the last change target." };
    }
    replaceRange(next, range.start, range.end, action.insertedText, false);
    const text = getText(next);
    if (text.length) {
      const endIndex = Math.max(0, range.start + Math.max(action.insertedText.length - 1, 0));
      next.cursor = indexToCursor(next.lines, Math.min(endIndex, text.length - 1));
    }
    return { state: next, error: "" };
  }

  if (action.type === "insertText") {
    insertAtCursor(next, action.insertedText);
    next.mode = "normal";
    next.cursor.col = Math.max(0, next.cursor.col - 1);
    clampNormalCursor(next);
    return { state: next, error: "" };
  }

  return { state, error: "This change cannot be replayed yet." };
}

function handleInsertMode(state, key, allowedScope) {
  if (key === "Escape") {
    state.mode = "normal";
    state.cursor.col = Math.max(0, state.cursor.col - 1);
    clampNormalCursor(state);
    return finishCommand(state, state.activeCommandMeta ?? {
      label: "insert",
      tags: ["insert"],
      changed: false,
      repeatableAction: { type: "insertText", insertedText: "" }
    }, allowedScope);
  }

  if (key === "Backspace") {
    if (!trimInsertedText(state)) {
      return {
        state,
        error: "Backspace is clamped at the start of this insert action.",
        command: null
      };
    }
    backspaceInsert(state);
    state.activeCommandMeta.changed = true;
    return { state, error: "", command: null };
  }

  if (key === "Enter") {
    insertAtCursor(state, "\n");
    appendInsertedText(state, "\n");
    state.activeCommandMeta.changed = true;
    return { state, error: "", command: null };
  }

  if (key.length === 1) {
    insertAtCursor(state, key);
    appendInsertedText(state, key);
    state.activeCommandMeta.changed = true;
    return { state, error: "", command: null };
  }

  return {
    state,
    error: `Unsupported insert key: ${key}`,
    command: null
  };
}

function countValue(state) {
  return state.countBuffer ? Number(state.countBuffer) : 1;
}

function operatorTextObjectMeta(operator, objectToken) {
  if (operator === "d") {
    return {
      label: `d${objectToken}`,
      tags: [`d${objectToken}`],
      changed: true,
      repeatableAction: {
        type: "deleteTextObject",
        object: objectToken
      }
    };
  }

  return {
    label: `c${objectToken}`,
    tags: [`c${objectToken}`],
    changed: true,
    repeatableAction: {
      type: "changeTextObject",
      object: objectToken,
      insertedText: ""
    }
  };
}

export function createEngineState(level) {
  const baseState = {
    lines: splitLines(level.snippet),
    cursor: cloneCursor(level.cursor_start),
    mode: "normal",
    pending: null,
    countBuffer: "",
    currentCommandKeys: [],
    commandStart: null,
    lastChange: null,
    lastFind: null,
    activeCommandMeta: null,
    lastResolvedCommand: null
  };

  return clampNormalCursor(baseState);
}

export function formatKey(key) {
  if (key === "Escape") {
    return "Esc";
  }
  if (key === "Backspace") {
    return "⌫";
  }
  if (key === "Enter") {
    return "↵";
  }
  if (key === " ") {
    return "Space";
  }
  return key;
}

export function serializeState(state) {
  return {
    lines: [...state.lines],
    cursor: cloneCursor(state.cursor),
    mode: state.mode
  };
}

export function stateText(state) {
  return getText(state);
}

export function matchesTarget(state, level) {
  const textMatches = getText(state) === level.target_state.text;
  const cursorMatches =
    state.cursor.line === level.target_state.cursor.line &&
    state.cursor.col === level.target_state.cursor.col;
  return textMatches && cursorMatches;
}

export function deriveTargetState(blueprint) {
  let state = createEngineState(blueprint);
  for (const key of blueprint.recommended_solution) {
    const result = applyKey(state, key);
    if (result.error) {
      throw new Error(`Failed to derive target for ${blueprint.id}: ${result.error}`);
    }
    state = result.state;
  }
  return {
    text: stateText(state),
    cursor: cloneCursor(state.cursor)
  };
}

export function applyKey(previousState, rawKey, options = {}) {
  const allowedScope = options.allowedScope ?? null;
  const state = cloneState(previousState);
  const key = normalizeKey(rawKey);

  prepareCommand(state, key);

  if (state.mode === "insert") {
    return handleInsertMode(state, key, allowedScope);
  }

  if (state.pending?.type === "find") {
    const findType = state.pending.findType;
    const count = countValue(state);
    state.pending = null;
    const found = runFind(state, findType, key, count);
    if (!found) {
      return abortCommand(state, `Cannot find \`${key}\` on this line.`);
    }
    const label = buildCommandLabel(state, `${findType}${key}`);
    const tags = buildCommandTags(state, findType);
    return finishCommand(state, {
      label,
      tags,
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (state.pending?.type === "operator") {
    const pending = { ...state.pending };

    if (pending.stage === "await-object-prefix") {
      if (key === "i" || key === "a") {
        state.pending = {
          type: "operator",
          operator: pending.operator,
          stage: "await-object-name",
          objectPrefix: key
        };
        return { state, error: "", command: null };
      }
      return abortCommand(state, `\`${pending.operator}\` needs a text object such as \`iw\` or \`a(\`.`);
    }

    const objectToken = `${pending.objectPrefix}${key}`;
    const range = getTextObjectRange(state, objectToken);
    if (!range) {
      return abortCommand(state, `No text object \`${objectToken}\` surrounds the cursor.`);
    }

    const meta = operatorTextObjectMeta(pending.operator, objectToken);
    if (pending.operator === "d") {
      replaceRange(state, range.start, range.end, "", false);
      return finishCommand(state, meta, allowedScope);
    }

    replaceRange(state, range.start, range.end, "", true);
    return beginInsertCommand(state, meta, allowedScope);
  }

  if (/^[1-9]$/.test(key) || (key === "0" && state.countBuffer.length > 0)) {
    state.countBuffer += key;
    return { state, error: "", command: null };
  }

  const count = countValue(state);

  if (key === "0") {
    moveLineStart(state);
    return finishCommand(state, {
      label: buildCommandLabel(state, "0"),
      tags: buildCommandTags(state, "0"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "h") {
    moveHorizontal(state, -count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "h"),
      tags: buildCommandTags(state, "h"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "l") {
    moveHorizontal(state, count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "l"),
      tags: buildCommandTags(state, "l"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "j") {
    moveVertical(state, count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "j"),
      tags: buildCommandTags(state, "j"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "k") {
    moveVertical(state, -count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "k"),
      tags: buildCommandTags(state, "k"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "w") {
    moveWordForward(state, count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "w"),
      tags: buildCommandTags(state, "w"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "b") {
    moveWordBackward(state, count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "b"),
      tags: buildCommandTags(state, "b"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "e") {
    moveWordEnd(state, count);
    return finishCommand(state, {
      label: buildCommandLabel(state, "e"),
      tags: buildCommandTags(state, "e"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "f" || key === "t") {
    state.pending = {
      type: "find",
      findType: key
    };
    return { state, error: "", command: null };
  }

  if (key === ";") {
    const found = repeatFind(state, count);
    if (!found) {
      return abortCommand(state, "No previous find command to repeat.");
    }
    return finishCommand(state, {
      label: buildCommandLabel(state, ";"),
      tags: buildCommandTags(state, ";"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "%") {
    const matched = jumpMatchingPair(state);
    if (!matched) {
      return abortCommand(state, "Place the cursor on a bracket to use `%`.");
    }
    return finishCommand(state, {
      label: buildCommandLabel(state, "%"),
      tags: buildCommandTags(state, "%"),
      changed: false,
      repeatableAction: null
    }, allowedScope);
  }

  if (key === "i") {
    return beginInsertCommand(state, {
      label: "insert",
      tags: ["insert"],
      changed: false,
      repeatableAction: {
        type: "insertText",
        insertedText: ""
      }
    }, allowedScope);
  }

  if (key === "a") {
    const line = getLine(state, state.cursor.line);
    if (line.length) {
      state.cursor.col = Math.min(state.cursor.col + 1, line.length);
    }
    clampInsertCursor(state);
    return beginInsertCommand(state, {
      label: "append",
      tags: ["insert"],
      changed: false,
      repeatableAction: {
        type: "insertText",
        insertedText: ""
      }
    }, allowedScope);
  }

  if (key === "d" || key === "c") {
    state.pending = {
      type: "operator",
      operator: key,
      stage: "await-object-prefix"
    };
    return { state, error: "", command: null };
  }

  if (key === ".") {
    if (!state.lastChange) {
      return abortCommand(state, "Nothing to repeat yet.");
    }
    const blocked = ensureAllowed(state, ".", ["."], allowedScope);
    if (blocked) {
      return blocked;
    }
    const replayed = applyRepeatableAction(state, state.lastChange);
    if (replayed.error) {
      return abortCommand(state, replayed.error);
    }
    replayed.state.lastResolvedCommand = {
      label: ".",
      tags: ["."],
      changed: true
    };
    clearCommandState(replayed.state);
    return {
      state: replayed.state,
      error: "",
      command: replayed.state.lastResolvedCommand
    };
  }

  if (key === "Escape") {
    clearCommandState(state);
    return {
      state,
      error: "Already in Normal mode.",
      command: null
    };
  }

  return abortCommand(state, `Unsupported key: ${key}`);
}
