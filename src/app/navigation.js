import { levels } from "../game/levels.js";
import { levelStats } from "../tui/progressStore.js";

export function findNextLevelIndex(progress) {
  const pendingIndex = levels.findIndex((level) => levelStats(progress, level.id).completions === 0);
  return pendingIndex === -1 ? levels.length - 1 : pendingIndex;
}

export function clampLevelIndex(index) {
  return Math.max(0, Math.min(levels.length - 1, index));
}

