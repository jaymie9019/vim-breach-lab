const STORAGE_KEY = "vim-breach-lab-progress-v1";

function baseProgress() {
  return {
    byLevel: {}
  };
}

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return baseProgress();
    }
    return {
      ...baseProgress(),
      ...JSON.parse(raw)
    };
  } catch {
    return baseProgress();
  }
}

export function saveProgress(progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function trackHint(progress, levelId) {
  const current = progress.byLevel[levelId] ?? {
    attempts: 0,
    completions: 0,
    totalMoves: 0,
    bestMoves: null,
    hintViews: 0
  };

  current.hintViews += 1;
  progress.byLevel[levelId] = current;
  return progress;
}

export function trackRetry(progress, levelId, hadInput) {
  if (!hadInput) {
    return progress;
  }

  const current = progress.byLevel[levelId] ?? {
    attempts: 0,
    completions: 0,
    totalMoves: 0,
    bestMoves: null,
    hintViews: 0
  };

  current.attempts += 1;
  progress.byLevel[levelId] = current;
  return progress;
}

export function trackCompletion(progress, levelId, moves) {
  const current = progress.byLevel[levelId] ?? {
    attempts: 0,
    completions: 0,
    totalMoves: 0,
    bestMoves: null,
    hintViews: 0
  };

  current.attempts += 1;
  current.completions += 1;
  current.totalMoves += moves;
  current.bestMoves = current.bestMoves === null ? moves : Math.min(current.bestMoves, moves);
  progress.byLevel[levelId] = current;
  return progress;
}

export function levelStats(progress, levelId) {
  return (
    progress.byLevel[levelId] ?? {
      attempts: 0,
      completions: 0,
      totalMoves: 0,
      bestMoves: null,
      hintViews: 0
    }
  );
}
