export const countLevels = [
  {
    id: "counted-jump",
    chapter: "计数前缀",
    title: "第 N 个单词",
    snippet: "// queue draft token region backup",
    cursor_start: { line: 0, col: 3 },
    goal_description: "不修改代码，用 count 一次跳到 `region` 上。",
    concept_tags: ["count", "w"],
    par_moves: 2,
    required_sequences: [["3", "w"]],
    hints: [
      "这关不是让你数很多次 `w`，而是让一条命令把跳跃放大。",
      "`3w` 会直接把光标送到 `region`。"
    ],
    guided_tip: "count 不是负担，它是把低级重复压缩成一次动作的放大器。",
    recommended_solution: ["3", "w"],
    target_state: {
      text: "// queue draft token region backup",
      cursor: { line: 0, col: 21 }
    }
  },
  {
    id: "repeat-x",
    chapter: "计数前缀",
    title: "连删脏字符",
    snippet: 'const status = "draft!!!";',
    cursor_start: { line: 0, col: 21 },
    goal_description: "一次删掉字符串末尾连续的三个 `!`。",
    concept_tags: ["count", "x"],
    par_moves: 2,
    required_sequences: [["3", "x"]],
    hints: [
      "这关的重点不是会不会删，而是能不能把重复动作压成一次。",
      "`3x` 会一次清掉三个感叹号。"
    ],
    guided_tip: "连着按三次 `x` 能完成任务，但学不会 count 的提速感。",
    recommended_solution: ["3", "x"],
    target_state: {
      text: 'const status = "draft";',
      cursor: { line: 0, col: 21 }
    }
  },
  {
    id: "count-backtrack",
    chapter: "计数前缀",
    title: "快速回撤",
    snippet: "// alpha draft queue token region",
    cursor_start: { line: 0, col: 27 },
    goal_description: "不修改代码，用 count 一次回撤到 `draft` 上。",
    concept_tags: ["count", "b"],
    par_moves: 2,
    required_sequences: [["3", "b"]],
    hints: [
      "这关练的是向后跳，不要把 count 只和向前移动绑定在一起。",
      "`3b` 会从 `region` 一次回到 `draft`。"
    ],
    guided_tip: "count + backward motion 一样有价值，尤其适合快速撤回到上一个语义块。",
    recommended_solution: ["3", "b"],
    target_state: {
      text: "// alpha draft queue token region",
      cursor: { line: 0, col: 9 }
    }
  },
  {
    id: "word-blast",
    chapter: "计数前缀",
    title: "连删多余词",
    snippet: "// remove stale draft note now",
    cursor_start: { line: 0, col: 10 },
    goal_description: "一次删掉连续两个多余单词：`stale draft`。",
    concept_tags: ["count", "dw"],
    par_moves: 3,
    required_sequences: [["2", "d", "w"]],
    hints: [
      "不是连按两次 `dw`，而是让一次操作符组合放大。",
      "`2dw` 会直接把两个连续单词清掉。"
    ],
    guided_tip: "count 和 operator 组合起来时，才开始接近真正的 Vim 提速感。",
    recommended_solution: ["2", "d", "w"],
    target_state: {
      text: "// remove note now",
      cursor: { line: 0, col: 10 }
    }
  },
  {
    id: "bulk-delete",
    chapter: "计数前缀",
    title: "清空多行日志",
    snippet: "debug one\ndebug two\ndebug three\nconst ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "一次删除前三行噪音日志，只留下真正的代码。",
    concept_tags: ["count", "dd"],
    par_moves: 3,
    required_sequences: [["3", "d", "d"]],
    hints: [
      "这关练的是行级删除，不是逐字符处理。",
      "`3dd` 会一次带走三整行。"
    ],
    guided_tip: "当脏数据是整行出现时，优先用 linewise 动作，不要回到字符思维。",
    recommended_solution: ["3", "d", "d"],
    target_state: {
      text: "const ready = true;",
      cursor: { line: 0, col: 0 }
    }
  },
  {
    id: "count-down",
    chapter: "计数前缀",
    title: "向下跳三行",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst gamma = 3;\nconst delta = 4;\nconst omega = 5;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "不修改代码，用 count 一次跳到第四行。",
    concept_tags: ["count", "j"],
    par_moves: 2,
    required_sequences: [["3", "j"]],
    hints: [
      "count 不只和单词跳转有关，纵向移动一样适用。",
      "`3j` 会直接从第一行落到第四行。"
    ],
    guided_tip: "当目标是固定行距时，count + `j/k` 比连续敲三次更像 Vim。",
    recommended_solution: ["3", "j"],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst gamma = 3;\nconst delta = 4;\nconst omega = 5;",
      cursor: { line: 3, col: 0 }
    }
  },
  {
    id: "count-up",
    chapter: "计数前缀",
    title: "向上回两行",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst gamma = 3;\nconst delta = 4;\nconst omega = 5;",
    cursor_start: { line: 4, col: 0 },
    goal_description: "不修改代码，用 count 一次回到第三行。",
    concept_tags: ["count", "k"],
    par_moves: 2,
    required_sequences: [["2", "k"]],
    hints: [
      "向上回撤时同样可以把重复压成一次动作。",
      "`2k` 会把你从第五行拉回第三行。"
    ],
    guided_tip: "count 是方向无关的放大器，向上移动一样应该优先想到它。",
    recommended_solution: ["2", "k"],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst gamma = 3;\nconst delta = 4;\nconst omega = 5;",
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "count-line-tail",
    chapter: "计数前缀",
    title: "跳到目标行尾",
    snippet: "const a = 1;\nconst b = 2;\nconst c = 3;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "先用 count 跳到第三行，再落到该行行尾。",
    concept_tags: ["count", "j", "$"],
    par_moves: 3,
    required_sequences: [["2", "j"]],
    hints: [
      "这关练的是组合：先用 count 垂直落位，再用整行锚点收尾。",
      "`2j$` 会一次把你送到第三行行尾。"
    ],
    guided_tip: "好的移动通常不是单招，而是“先粗定位，再精落点”的组合。",
    recommended_solution: ["2", "j", "$"],
    target_state: {
      text: "const a = 1;\nconst b = 2;\nconst c = 3;",
      cursor: { line: 2, col: 11 }
    }
  },
  {
    id: "count-line-home",
    chapter: "计数前缀",
    title: "回到目标行首",
    snippet: "  const alpha = 1;\n  const beta = 2;\n  const gamma = 3;",
    cursor_start: { line: 2, col: 17 },
    goal_description: "先回到第一行，再落到真正的编辑起点。",
    concept_tags: ["count", "k", "^"],
    par_moves: 3,
    required_sequences: [["2", "k"]],
    hints: [
      "这关练的是反向粗定位后，再用 `^` 落到代码起点。",
      "`2k^` 就能完成。"
    ],
    guided_tip: "纵向 count 和行内锚点一起用，会让跨行落点非常稳定。",
    recommended_solution: ["2", "k", "^"],
    target_state: {
      text: "  const alpha = 1;\n  const beta = 2;\n  const gamma = 3;",
      cursor: { line: 0, col: 2 }
    }
  }
];
