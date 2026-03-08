import process from "node:process";

import { levels } from "./game/levels.js";
import { runLevelLoop } from "./tui/levelLoop.js";
import { prompt } from "./tui/prompt.js";
import {
  levelStats,
  loadProgress
} from "./tui/progressStore.js";
import {
  checkVimAvailable
} from "./tui/vimSession.js";
import {
  clearScreen,
  renderMainMenu
} from "./tui/renderers.js";

function findNextLevelIndex(progress) {
  const pendingIndex = levels.findIndex((level) => levelStats(progress, level.id).completions === 0);
  return pendingIndex === -1 ? levels.length - 1 : pendingIndex;
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error("Vim Breach Lab 需要在真实终端里运行。");
    process.exitCode = 1;
    return;
  }

  if (!checkVimAvailable()) {
    console.error("没有找到可用的系统 vim。当前实现默认使用 /usr/bin/vim。");
    process.exitCode = 1;
    return;
  }

  const progress = loadProgress();
  let selectedLevel = 0;
  let autoStart = false;

  while (true) {
    renderMainMenu(progress);
    const answer = await prompt("> ");

    if (answer.toLowerCase() === "q") {
      clearScreen();
      return;
    }

    if (answer.toLowerCase() === "n") {
      selectedLevel = findNextLevelIndex(progress);
      autoStart = true;
      let result;
      do {
        result = await runLevelLoop(selectedLevel, progress, { autoStart });
        selectedLevel = result.nextLevelIndex;
        autoStart = Boolean(result.autoStart);
      } while (result.action === "next");
      autoStart = false;
      continue;
    }

    const numeric = Number(answer);
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > levels.length) {
      continue;
    }

    selectedLevel = numeric - 1;
    let result;
    do {
      result = await runLevelLoop(selectedLevel, progress, { autoStart });
      selectedLevel = result.nextLevelIndex;
      autoStart = Boolean(result.autoStart);
    } while (result.action === "next");
    autoStart = false;
  }
}

await main();
