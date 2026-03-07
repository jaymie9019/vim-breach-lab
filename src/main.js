import { levels } from "./game/levels.js";
import { createLineDiff } from "./game/diff.js";
import {
  applyKey,
  createEngineState,
  formatKey,
  matchesTarget,
  serializeState,
  stateText
} from "./game/vimEngine.js";
import {
  levelStats,
  loadProgress,
  saveProgress,
  trackCompletion,
  trackHint,
  trackRetry
} from "./game/storage.js";

const root = document.querySelector("#app");
let keyboardCapture = null;

function gradeForMoves(moves, par) {
  if (moves <= par) {
    return "S";
  }
  if (moves <= par + 2) {
    return "A";
  }
  if (moves <= par + 5) {
    return "B";
  }
  return "C";
}

function cloneFrame(engineState, key = null) {
  return {
    key,
    ...serializeState(engineState)
  };
}

function focusKeyboardCapture() {
  if (keyboardCapture instanceof HTMLElement) {
    keyboardCapture.focus({ preventScroll: true });
  }
}

function makeReplay(level, keys) {
  const frames = [];
  let state = createEngineState(level);
  frames.push(cloneFrame(state));

  for (const key of keys) {
    const result = applyKey(state, key);
    if (result.error) {
      break;
    }
    state = result.state;
    frames.push(cloneFrame(state, key));
  }

  return frames;
}

function formatSequence(keys) {
  return keys.map((key) => formatKey(key)).join(" ");
}

function renderCodeFrame(frame) {
  return frame.lines
    .map((line, lineIndex) => {
      const chars = [...line];
      const isCursorLine = lineIndex === frame.cursor.line;
      let rendered = "";

      if (!chars.length && isCursorLine) {
        rendered = '<span class="cursor cursor-empty"> </span>';
      } else {
        chars.forEach((char, charIndex) => {
          const safe = char === " " ? "&nbsp;" : escapeHtml(char);
          if (isCursorLine && charIndex === frame.cursor.col) {
            rendered += `<span class="cursor">${safe}</span>`;
          } else {
            rendered += safe;
          }
        });

        if (isCursorLine && frame.mode === "insert" && frame.cursor.col === chars.length) {
          rendered += '<span class="cursor cursor-empty"> </span>';
        }
      }

      return `<div class="code-line"><span class="line-no">${lineIndex + 1}</span><span class="line-body">${rendered}</span></div>`;
    })
    .join("");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createInitialAppState() {
  const progress = loadProgress();
  const level = levels[0];
  return {
    progress,
    levelIndex: 0,
    engineState: createEngineState(level),
    totalMoves: 0,
    keyStream: [],
    frames: [cloneFrame(createEngineState(level))],
    replaySource: "player",
    replayIndex: 0,
    hintIndex: 0,
    message: "控制台已上线。直接在任务面板里输入真实 Vim 按键。",
    solved: false,
    streak: 0
  };
}

const appState = createInitialAppState();
const recommendedReplays = new Map(levels.map((level) => [level.id, makeReplay(level, level.recommended_solution)]));

function resetLevel(index, message = "任务已重置，重新来一把。") {
  const level = levels[index];
  appState.levelIndex = index;
  appState.engineState = createEngineState(level);
  appState.totalMoves = 0;
  appState.keyStream = [];
  appState.frames = [cloneFrame(appState.engineState)];
  appState.replaySource = "player";
  appState.replayIndex = 0;
  appState.hintIndex = 0;
  appState.message = message;
  appState.solved = false;
}

function currentLevel() {
  return levels[appState.levelIndex];
}

function currentStats() {
  return levelStats(appState.progress, currentLevel().id);
}

function currentReplayFrames() {
  if (appState.replaySource === "recommended") {
    return recommendedReplays.get(currentLevel().id) ?? [];
  }
  return appState.frames;
}

function solveLevel(result) {
  const level = currentLevel();
  const grade = gradeForMoves(appState.totalMoves, level.par_moves);
  appState.solved = true;
  appState.message =
    appState.totalMoves <= level.par_moves
      ? `任务完成，用了 ${appState.totalMoves} 步，连胜继续。`
      : `任务完成，用了 ${appState.totalMoves} 步。可以看看 Expert Route，找更干净的解法。`;
  appState.streak = appState.totalMoves <= level.par_moves ? appState.streak + 1 : 0;
  trackCompletion(appState.progress, level.id, appState.totalMoves);
  saveProgress(appState.progress);
  appState.replaySource = "player";
  appState.replayIndex = Math.max(0, appState.frames.length - 1);

  if (result.command?.changed && appState.keyStream.length === result.command.label.length) {
    appState.message = `Combo 完成：一套命令直接通关，评级 ${grade}。`;
  }
}

function onKeyDown(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  if (event.key === "Shift" || event.key === "Alt" || event.key === "Control" || event.key === "Meta") {
    return;
  }

  if (appState.solved) {
    return;
  }

  const key = event.key === " " ? " " : event.key;
  event.preventDefault();

  const level = currentLevel();
  const result = applyKey(appState.engineState, key, {
    allowedScope: null
  });

  appState.totalMoves += 1;
  appState.keyStream.push(key);
  appState.engineState = result.state;
  appState.frames.push(cloneFrame(appState.engineState, key));
  appState.replaySource = "player";
  appState.replayIndex = Math.max(0, appState.frames.length - 1);

  if (result.error) {
    appState.message = result.error;
    render();
    return;
  }

  if (matchesTarget(appState.engineState, level)) {
    solveLevel(result);
  } else if (result.command) {
    appState.message = `命令已接受：${result.command.label}`;
  } else {
    appState.message = `输入已缓存：${formatSequence(appState.engineState.currentCommandKeys)}`;
  }

  render();
}

function renderMissionRail() {
  return levels
    .map((level, index) => {
      const stats = levelStats(appState.progress, level.id);
      const active = index === appState.levelIndex;
      const cleared = stats.completions > 0;
      return `
        <button class="mission-chip ${active ? "active" : ""}" data-action="goto" data-level="${index}">
          <span>${index + 1}. ${escapeHtml(level.title)}</span>
          <span class="mission-meta">${cleared ? "已通关" : level.chapter}</span>
        </button>
      `;
    })
    .join("");
}

function renderScope(level) {
  return level.allowed_scope
    .map((item) => `<span class="scope-chip">${escapeHtml(item)}</span>`)
    .join("");
}

function renderDiff(level) {
  const diff = createLineDiff(level.snippet, stateText(appState.engineState));
  return diff
    .map((entry) => `<div class="diff-line diff-${entry.type}">${entry.type === "add" ? "+" : entry.type === "remove" ? "-" : " "} ${escapeHtml(entry.text)}</div>`)
    .join("");
}

function renderReplayPanel() {
  const frames = currentReplayFrames();
  const frame = frames[Math.min(appState.replayIndex, Math.max(frames.length - 1, 0))] ?? frames[0];

  return `
      <div class="panel replay-panel">
      <div class="panel-header">
        <h3>Replay 控制台</h3>
        <div class="segmented">
          <button class="${appState.replaySource === "player" ? "selected" : ""}" data-action="replay-source" data-source="player">你的操作</button>
          <button class="${appState.replaySource === "recommended" ? "selected" : ""}" data-action="replay-source" data-source="recommended">Expert Route</button>
        </div>
      </div>
      <div class="replay-nav">
        <button data-action="replay-step" data-direction="-1">上一步</button>
        <span>帧 ${Math.min(appState.replayIndex + 1, frames.length)} / ${frames.length}</span>
        <button data-action="replay-step" data-direction="1">下一步</button>
      </div>
      <div class="code-window replay-window">${frame ? renderCodeFrame(frame) : ""}</div>
      <p class="micro-copy">按键序列：${
        appState.replaySource === "recommended"
          ? formatSequence(currentLevel().recommended_solution)
          : formatSequence(appState.keyStream)
      }</p>
    </div>
  `;
}

function render() {
  const level = currentLevel();
  const stats = currentStats();
  const grade = appState.solved ? gradeForMoves(appState.totalMoves, level.par_moves) : "--";

  root.innerHTML = `
    <div class="shell">
      <aside class="rail">
        <div class="brand">
          <p class="eyebrow">黑客训练营</p>
          <h1>Vim Breach Lab</h1>
          <p class="lead">一轮 20 分钟训练。真实按键。少找借口。</p>
        </div>
        <div class="mission-list">${renderMissionRail()}</div>
      </aside>

      <main class="workspace">
        <section class="hero panel">
          <div>
            <p class="eyebrow">当前任务</p>
            <h2>${escapeHtml(level.title)}</h2>
            <p class="goal">${escapeHtml(level.goal_description)}</p>
            <p class="guided">${escapeHtml(level.guided_tip)}</p>
          </div>
          <div class="hero-stats">
            <div class="stat-card">
              <span class="stat-label">Par</span>
              <strong>${level.par_moves}</strong>
            </div>
            <div class="stat-card">
              <span class="stat-label">步数</span>
              <strong>${appState.totalMoves}</strong>
            </div>
            <div class="stat-card">
              <span class="stat-label">评级</span>
              <strong>${grade}</strong>
            </div>
            <div class="stat-card">
              <span class="stat-label">连胜</span>
              <strong>${appState.streak}</strong>
            </div>
          </div>
        </section>

        <section class="play-grid">
          <div class="panel editor-panel">
            <div class="panel-header">
              <h3>任务面板</h3>
              <div class="mode-chip">${appState.engineState.mode === "insert" ? "Insert" : "Normal"}</div>
            </div>
            <div
              class="code-window capture-window"
              id="keyboard-capture"
              tabindex="0"
              aria-label="Vim 任务输入区域"
            >${renderCodeFrame(serializeState(appState.engineState))}</div>
            <div class="editor-footer">
              <span>状态：${escapeHtml(appState.message)}</span>
              <span>训练范围：${renderScope(level)}</span>
            </div>
          </div>

          <div class="panel intel-panel">
            <div class="panel-header">
              <h3>训练情报</h3>
            </div>
            <div class="intel-block">
              <span class="label">按键流</span>
              <p>${formatSequence(appState.keyStream)}</p>
            </div>
            <div class="intel-block">
              <span class="label">推荐解法</span>
              <p>${formatSequence(level.recommended_solution)}</p>
            </div>
            <div class="intel-block">
              <span class="label">最佳成绩</span>
              <p>${stats.bestMoves === null ? "还没有通关记录。" : `${stats.bestMoves} 步`}</p>
            </div>
            <div class="intel-block">
              <span class="label">统计</span>
              <p>${stats.completions} 次通关，${stats.attempts} 次尝试，${stats.hintViews} 次查看提示</p>
            </div>
            <div class="intel-actions">
              <button data-action="hint">提示</button>
              <button data-action="answer">答案</button>
              <button data-action="retry">重试</button>
              <button data-action="next" ${appState.levelIndex === levels.length - 1 ? "disabled" : ""}>下一关</button>
            </div>
            <div class="hint-box">
              <span class="label">提示流</span>
              <p>${escapeHtml(level.hints[Math.min(appState.hintIndex, level.hints.length - 1)] ?? "当前还没有解锁提示。")}</p>
            </div>
          </div>
        </section>

        <section class="insight-grid">
          ${renderReplayPanel()}
          <div class="panel diff-panel">
            <div class="panel-header">
              <h3>Diff 面板</h3>
            </div>
            <div class="diff-window">${renderDiff(level)}</div>
          </div>
        </section>
      </main>
    </div>
  `;

  keyboardCapture = document.querySelector("#keyboard-capture");
  if (keyboardCapture) {
    keyboardCapture.addEventListener("pointerdown", () => {
      focusKeyboardCapture();
    });
  }
}

root.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    focusKeyboardCapture();
    return;
  }

  const action = target.dataset.action;

  if (action === "goto") {
    resetLevel(Number(target.dataset.level), "已切换任务。");
  }

  if (action === "retry") {
    trackRetry(appState.progress, currentLevel().id, appState.keyStream.length > 0 && !appState.solved);
    saveProgress(appState.progress);
    resetLevel(appState.levelIndex);
  }

  if (action === "next" && appState.levelIndex < levels.length - 1) {
    resetLevel(appState.levelIndex + 1, "正在进入下一关。");
  }

  if (action === "hint") {
    appState.hintIndex = Math.min(appState.hintIndex + 1, currentLevel().hints.length - 1);
    trackHint(appState.progress, currentLevel().id);
    saveProgress(appState.progress);
    appState.message = "已展开更多提示。";
  }

  if (action === "answer") {
    appState.message = `Expert Route：${formatSequence(currentLevel().recommended_solution)}`;
    appState.replaySource = "recommended";
    appState.replayIndex = 0;
  }

  if (action === "replay-source") {
    appState.replaySource = target.dataset.source;
    appState.replayIndex = 0;
  }

  if (action === "replay-step") {
    const frames = currentReplayFrames();
    const nextIndex = appState.replayIndex + Number(target.dataset.direction);
    appState.replayIndex = Math.max(0, Math.min(nextIndex, Math.max(frames.length - 1, 0)));
  }

  render();
  focusKeyboardCapture();
});

document.addEventListener("keydown", onKeyDown);
render();
focusKeyboardCapture();
