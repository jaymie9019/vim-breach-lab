function lcsMatrix(left, right) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      if (left[row - 1] === right[col - 1]) {
        matrix[row][col] = matrix[row - 1][col - 1] + 1;
      } else {
        matrix[row][col] = Math.max(matrix[row - 1][col], matrix[row][col - 1]);
      }
    }
  }

  return matrix;
}

export function createLineDiff(beforeText, afterText) {
  const before = beforeText.split("\n");
  const after = afterText.split("\n");
  const matrix = lcsMatrix(before, after);
  const diff = [];

  let row = before.length;
  let col = after.length;

  while (row > 0 || col > 0) {
    if (row > 0 && col > 0 && before[row - 1] === after[col - 1]) {
      diff.unshift({ type: "same", text: before[row - 1] });
      row -= 1;
      col -= 1;
      continue;
    }

    if (col > 0 && (row === 0 || matrix[row][col - 1] >= matrix[row - 1][col])) {
      diff.unshift({ type: "add", text: after[col - 1] });
      col -= 1;
      continue;
    }

    diff.unshift({ type: "remove", text: before[row - 1] });
    row -= 1;
  }

  return diff;
}
