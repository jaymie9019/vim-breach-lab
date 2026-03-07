import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const appDir = path.join(os.homedir(), ".vim-breach-lab");
const progressFile = path.join(appDir, "progress.json");

function emptyProgress() {
  return {
    byLevel: {}
  };
}

export function progressLocation() {
  return progressFile;
}

export function loadProgress() {
  try {
    return {
      ...emptyProgress(),
      ...JSON.parse(fs.readFileSync(progressFile, "utf8"))
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

export function levelStats(progress, levelId) {
  return (
    progress.byLevel[levelId] ?? {
      attempts: 0,
      completions: 0,
      bestMoves: null,
      hintViews: 0
    }
  );
}

export function recordHint(progress, levelId) {
  const stats = levelStats(progress, levelId);
  stats.hintViews += 1;
  progress.byLevel[levelId] = stats;
}

export function recordAttempt(progress, levelId, evaluation) {
  const stats = levelStats(progress, levelId);
  stats.attempts += 1;
  if (evaluation.passed) {
    stats.completions += 1;
    stats.bestMoves =
      stats.bestMoves === null ? evaluation.keylog.scoredMoves : Math.min(stats.bestMoves, evaluation.keylog.scoredMoves);
  }
  progress.byLevel[levelId] = stats;
}
