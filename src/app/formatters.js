export function formatSequence(tokens) {
  return (tokens ?? [])
    .map((token) => {
      if (token === "Escape") {
        return "<Esc>";
      }
      if (token === "Enter" || token === "<CR>") {
        return "<CR>";
      }
      if (token === " ") {
        return "<Space>";
      }
      return token;
    })
    .join(" ");
}

export function formatCursor(cursor) {
  return `第 ${cursor.line + 1} 行，第 ${cursor.col + 1} 列`;
}

export function formatRequiredSequences(sequences) {
  return (sequences ?? []).map(formatSequence).join(" / ");
}

