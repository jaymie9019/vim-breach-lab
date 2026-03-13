import process from "node:process";

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";

import { getChapterDoc, getChapterLevels } from "../game/chapters.js";
import { levels } from "../game/levels.js";
import { evaluateResult } from "../tui/evaluate.js";
import {
  chapterStats,
  levelStats,
  loadProgress,
  recordAttempt,
  recordChapterIntroSeen,
  recordChapterOutroSeen,
  recordHint,
  saveProgress
} from "../tui/progressStore.js";
import { checkVimAvailable, launchLevel } from "../tui/vimSession.js";
import { findNextLevelIndex } from "./navigation.js";
import { ChapterGuideScreen } from "./screens/ChapterGuideScreen";
import { MainMenuScreen } from "./screens/MainMenuScreen";
import { LevelDetailScreen } from "./screens/LevelDetailScreen";
import { ResultScreen } from "./screens/ResultScreen";

async function runScreen(elementFactory: (finish: (action: any) => void) => any) {
  const renderer = await createCliRenderer({
    exitOnCtrlC: false,
    useMouse: false,
    autoFocus: false,
    targetFps: 30
  });

  return await new Promise<any>((resolve) => {
    let finished = false;

    const finish = (action: any) => {
      if (finished) {
        return;
      }

      finished = true;
      queueMicrotask(() => {
        try {
          renderer.destroy();
        } finally {
          resolve(action);
        }
      });
    };

    (renderer.keyInput as any).on("keypress", (key: any) => {
      if (key.ctrl && key.name === "c") {
        finish({ type: "quit" });
      }
    });

    createRoot(renderer).render(elementFactory(finish));
  });
}

async function runMainMenu(progress: any, selectedLevelIndex: number) {
  return await runScreen((finish) => (
    <MainMenuScreen progress={progress} initialLevelIndex={selectedLevelIndex} onAction={finish} />
  ));
}

async function runLevelDetails(level: any, progress: any, hintIndex: number, showAnswer: boolean) {
  return await runScreen((finish) => (
    <LevelDetailScreen
      level={level}
      progress={progress}
      hintIndex={hintIndex}
      showAnswer={showAnswer}
      onAction={finish}
    />
  ));
}

async function runResultScreenFlow(level: any, evaluation: any, runResult: any) {
  return await runScreen((finish) => (
    <ResultScreen
      level={level}
      evaluation={evaluation}
      runResult={runResult}
      hasNextLevel={levels.findIndex((entry) => entry.id === level.id) < levels.length - 1}
      onAction={finish}
    />
  ));
}

async function runChapterGuide(chapter: string, mode: "intro" | "outro") {
  const doc = getChapterDoc(chapter)?.[mode];
  if (!doc) {
    return { type: "continue" };
  }

  return await runScreen((finish) => (
    <ChapterGuideScreen chapter={chapter} doc={doc} mode={mode} onAction={finish} />
  ));
}

function isChapterCompleted(progress: any, chapter: string) {
  return getChapterLevels(chapter).every((level) => levelStats(progress, level.id).completions > 0);
}

async function runLevelFlow(levelIndex: number, progress: any, options: { autoStart?: boolean } = {}) {
  let hintIndex = 0;
  let showAnswer = false;
  let autoStart = Boolean(options.autoStart);

  while (true) {
    const level = levels[levelIndex];
    const chapter = level.chapter;
    const chapterProgress = chapterStats(progress, chapter);

    if (!chapterProgress.introSeen) {
      const introAction = await runChapterGuide(chapter, "intro");

      if (introAction.type === "quit") {
        return { action: "quit", nextLevelIndex: levelIndex, autoStart: false };
      }

      if (introAction.type === "back") {
        return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
      }

      recordChapterIntroSeen(progress, chapter);
      saveProgress(progress);
    }

    if (!autoStart) {
      const action = await runLevelDetails(level, progress, hintIndex, showAnswer);

      if (action.type === "quit") {
        return { action: "quit", nextLevelIndex: levelIndex, autoStart: false };
      }

      if (action.type === "hint") {
        hintIndex = Math.min(hintIndex + 1, level.hints.length - 1);
        recordHint(progress, level.id);
        saveProgress(progress);
        continue;
      }

      if (action.type === "answer") {
        showAnswer = true;
        continue;
      }

      if (action.type === "chapter-guide") {
        const guideAction = await runChapterGuide(chapter, "intro");

        if (guideAction.type === "quit") {
          return { action: "quit", nextLevelIndex: levelIndex, autoStart: false };
        }

        if (guideAction.type === "continue") {
          recordChapterIntroSeen(progress, chapter);
          saveProgress(progress);
        }

        continue;
      }

      if (action.type === "back") {
        return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
      }
    } else {
      autoStart = false;
    }

    const runResult = launchLevel(level);
    const evaluation = evaluateResult(level, runResult.finalBuffer, runResult.finalCursor, runResult.keylog);
    recordAttempt(progress, level.id, evaluation);
    saveProgress(progress);

    const resultAction = await runResultScreenFlow(level, evaluation, runResult);
    if (resultAction.type === "quit") {
      return { action: "quit", nextLevelIndex: levelIndex, autoStart: false };
    }

    if (resultAction.type === "retry") {
      autoStart = true;
      continue;
    }

    const nextChapterProgress = chapterStats(progress, chapter);
    if (evaluation.passed && !nextChapterProgress.outroSeen && isChapterCompleted(progress, chapter)) {
      const outroAction = await runChapterGuide(chapter, "outro");

      if (outroAction.type === "quit") {
        return { action: "quit", nextLevelIndex: levelIndex, autoStart: false };
      }

      if (outroAction.type === "back") {
        return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
      }

      if (outroAction.type === "continue") {
        recordChapterOutroSeen(progress, chapter);
        saveProgress(progress);
      }
    }

    if (resultAction.type === "next") {
      if (levelIndex < levels.length - 1) {
        return { action: "next", nextLevelIndex: levelIndex + 1, autoStart: true };
      }

      return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
    }

    return { action: "back", nextLevelIndex: levelIndex, autoStart: false };
  }
}

export async function runTuiApp() {
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
  let selectedLevelIndex = 0;

  while (true) {
    const menuAction: any = await runMainMenu(progress, selectedLevelIndex);

    if (menuAction.type === "quit") {
      return;
    }

    if (menuAction.type === "play-next") {
      selectedLevelIndex = findNextLevelIndex(progress);
      let result;
      do {
        result = await runLevelFlow(selectedLevelIndex, progress, { autoStart: true });
        selectedLevelIndex = result.nextLevelIndex;
      } while (result.action === "next");

      if (result.action === "quit") {
        return;
      }

      continue;
    }

    if (menuAction.type === "chapter-guide") {
      selectedLevelIndex = menuAction.levelIndex ?? selectedLevelIndex;
      const chapter = menuAction.chapter ?? levels[selectedLevelIndex].chapter;
      const guideAction = await runChapterGuide(chapter, "intro");

      if (guideAction.type === "quit") {
        return;
      }

      if (guideAction.type === "continue") {
        recordChapterIntroSeen(progress, chapter);
        saveProgress(progress);
      }

      continue;
    }

    selectedLevelIndex = menuAction.levelIndex ?? selectedLevelIndex;
    let result;
    do {
      result = await runLevelFlow(selectedLevelIndex, progress, { autoStart: false });
      selectedLevelIndex = result.nextLevelIndex;
    } while (result.action === "next");

    if (result.action === "quit") {
      return;
    }
  }
}
