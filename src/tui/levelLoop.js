import { levels } from "../game/levels.js";
import { evaluateResult } from "./evaluate.js";
import {
  recordAttempt,
  recordHint,
  saveProgress
} from "./progressStore.js";
import { launchLevel } from "./vimSession.js";
import { prompt } from "./prompt.js";
import {
  renderLevelDetails,
  renderResult
} from "./renderers.js";

export async function runLevelLoop(levelIndex, progress, options = {}) {
  let hintIndex = 0;
  let showAnswer = false;
  let autoStart = Boolean(options.autoStart);

  while (true) {
    const level = levels[levelIndex];
    let answer = "";

    if (!autoStart) {
      renderLevelDetails(level, progress, hintIndex, showAnswer);
      answer = await prompt("> ");
    } else {
      autoStart = false;
    }

    if (!answer) {
      const runResult = launchLevel(level);
      const evaluation = evaluateResult(level, runResult.finalBuffer, runResult.finalCursor, runResult.keylog);
      recordAttempt(progress, level.id, evaluation);
      saveProgress(progress);

      while (true) {
        renderResult(level, evaluation, runResult);
        const nextAction = (await prompt("> ")).toLowerCase();

        if (nextAction === "r") {
          autoStart = true;
          break;
        }

        if (nextAction === "n") {
          if (levelIndex < levels.length - 1) {
            return { action: "next", nextLevelIndex: levelIndex + 1, autoStart: true };
          }
          return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
        }

        if (nextAction === "b" || !nextAction) {
          return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
        }
      }

      continue;
    }

    if (answer.toLowerCase() === "h") {
      hintIndex = Math.min(hintIndex + 1, level.hints.length - 1);
      recordHint(progress, level.id);
      saveProgress(progress);
      continue;
    }

    if (answer.toLowerCase() === "a") {
      showAnswer = true;
      continue;
    }

    if (answer.toLowerCase() === "b") {
      return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
    }
  }
}
