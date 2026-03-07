import { createLineDiff } from "../game/diff.js";

function normalizeText(text) {
  const unix = text.replace(/\r\n/g, "\n");
  return unix.endsWith("\n") ? unix.slice(0, -1) : unix;
}

function formatToken(token) {
  if (token === " ") {
    return "<Space>";
  }
  return token;
}

function tokensEndWith(tokens, suffix) {
  if (tokens.length < suffix.length) {
    return false;
  }

  for (let index = 0; index < suffix.length; index += 1) {
    if (tokens[tokens.length - suffix.length + index] !== suffix[index]) {
      return false;
    }
  }

  return true;
}

function detectQuitSuffix(tokens) {
  const patterns = [
    { name: "Q", tokens: ["Q"] },
    { name: "ZZ", tokens: ["Z", "Z"] },
    { name: ":wq<CR>", tokens: [":", "w", "q", "<CR>"] },
    { name: ":x<CR>", tokens: [":", "x", "<CR>"] },
    { name: ":q!<CR>", tokens: [":", "q", "!", "<CR>"] },
    { name: ":qa!<CR>", tokens: [":", "q", "a", "!", "<CR>"] }
  ];

  return patterns.find((pattern) => tokensEndWith(tokens, pattern.tokens)) ?? null;
}

function gradeForMoves(moves, parMoves) {
  if (moves <= parMoves) {
    return "S";
  }
  if (moves <= parMoves + 2) {
    return "A";
  }
  if (moves <= parMoves + 5) {
    return "B";
  }
  return "C";
}

function findFirstDiff(expectedText, actualText) {
  const expected = expectedText.split("\n");
  const actual = actualText.split("\n");
  const max = Math.max(expected.length, actual.length);

  for (let index = 0; index < max; index += 1) {
    if ((expected[index] ?? "") !== (actual[index] ?? "")) {
      return {
        line: index + 1,
        expected: expected[index] ?? "",
        actual: actual[index] ?? ""
      };
    }
  }

  return null;
}

function containsSequence(tokens, sequence) {
  if (!sequence?.length) {
    return true;
  }

  for (let start = 0; start <= tokens.length - sequence.length; start += 1) {
    let matched = true;
    for (let offset = 0; offset < sequence.length; offset += 1) {
      if (tokens[start + offset] !== sequence[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return true;
    }
  }

  return false;
}

function sequenceLabel(sequence) {
  return sequence
    .map((token) => {
      if (token === " ") {
        return "<Space>";
      }
      return token;
    })
    .join("");
}

export function parseKeylog(rawBuffer) {
  const buffer = Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer ?? "");
  const tokens = [];

  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];

    if (byte === 0x80) {
      if (index + 2 < buffer.length) {
        index += 2;
      }
      continue;
    }

    if (byte >= 0x80) {
      continue;
    }

    if (byte === 10 || byte === 13) {
      if (tokens[tokens.length - 1] !== "<CR>") {
        tokens.push("<CR>");
      }
      continue;
    }

    if (byte === 27) {
      tokens.push("<Esc>");
      continue;
    }

    if (byte < 32) {
      tokens.push(`<C-${String.fromCharCode(byte + 64)}>`);
      continue;
    }

    tokens.push(String.fromCharCode(byte));
  }

  const quitSuffix = detectQuitSuffix(tokens);
  const scoringTokens = quitSuffix ? tokens.slice(0, -quitSuffix.tokens.length) : [...tokens];

  return {
    rawTokens: tokens,
    scoringTokens,
    display: tokens.map(formatToken).join(" "),
    displayForScore: scoringTokens.map(formatToken).join(" "),
    standardized: Boolean(quitSuffix),
    quitStrategy: quitSuffix?.name ?? null,
    rawCount: tokens.length,
    scoredMoves: scoringTokens.length
  };
}

export function evaluateResult(level, finalBuffer, finalCursor, keylogBuffer) {
  const actualText = normalizeText(finalBuffer);
  const expectedText = normalizeText(level.target_state.text);
  const textMatches = actualText === expectedText;
  const cursorMatches =
    finalCursor.line === level.target_state.cursor.line &&
    finalCursor.col === level.target_state.cursor.col;
  const keylog = parseKeylog(keylogBuffer);
  const requiredSequences = level.required_sequences ?? [];
  const missingSequences = requiredSequences.filter((sequence) => !containsSequence(keylog.scoringTokens, sequence));
  const techniqueMatches = missingSequences.length === 0;
  const objectivePassed = textMatches && cursorMatches;
  const passed = objectivePassed && techniqueMatches;
  const reasons = [];
  const firstDiff = findFirstDiff(expectedText, actualText);

  if (!textMatches && cursorMatches) {
    reasons.push("文本还没达到目标，但光标位置已经对了。");
  } else if (!textMatches) {
    reasons.push("最终文本和目标状态不一致。");
  }

  if (textMatches && !cursorMatches) {
    reasons.push("文本已经正确，但光标还没停在目标位置。");
  } else if (!cursorMatches) {
    reasons.push(
      `最终光标应在第 ${level.target_state.cursor.line + 1} 行、第 ${level.target_state.cursor.col + 1} 列，当前是第 ${finalCursor.line + 1} 行、第 ${finalCursor.col + 1} 列。`
    );
  }

  if (!techniqueMatches) {
    reasons.push(`本关要求至少使用这些技法：${missingSequences.map(sequenceLabel).join("、")}。`);
  }

  if (!keylog.standardized) {
    reasons.push("退出方式不是 `ZZ` 或常见写退命令，步数按原始按键近似统计。");
  }

  return {
    objectivePassed,
    passed,
    grade: objectivePassed ? gradeForMoves(keylog.scoredMoves, level.par_moves) : "C",
    actualText,
    expectedText,
    actualCursor: finalCursor,
    expectedCursor: level.target_state.cursor,
    textMatches,
    cursorMatches,
    techniqueMatches,
    missingSequences,
    reasons,
    keylog,
    firstDiff,
    diagnostics: {
      text: textMatches
        ? "文本已达标。"
        : firstDiff
          ? `第 ${firstDiff.line} 行开始出现差异。`
          : "文本未达标。",
      cursor: cursorMatches
        ? "光标位置已达标。"
        : `当前在第 ${finalCursor.line + 1} 行、第 ${finalCursor.col + 1} 列。`,
      technique: techniqueMatches
        ? "本关要求的技法已使用。"
        : `缺少技法：${missingSequences.map(sequenceLabel).join("、")}。任务已完成，但训练目标未达成。`
    },
    diff: createLineDiff(expectedText, actualText)
  };
}
