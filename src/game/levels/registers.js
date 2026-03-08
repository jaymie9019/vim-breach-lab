export const registerLevels = [
  {
    id: "zero-register-recall",
    chapter: "寄存器",
    title: "取回 0 号寄存器",
    snippet: "const shared = buildShared();\ndebug one\nconst ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "先 yank 第一行，再删掉中间调试行，最后用 `\"0p` 贴回刚才 yank 的内容。",
    concept_tags: ['"0', "yy", "dd", "p"],
    par_moves: 8,
    required_sequences: [['"', "0", "p"]],
    hints: [
      "这关练的是：删除会污染默认寄存器，但 `0` 号寄存器还记着上一次 yank。",
      "试试 `yyjdd\"0p`。"
    ],
    guided_tip: "`\"0` 很适合在“我刚刚复制过一段内容，但中间又删了别的东西”这种场景里救场。",
    recommended_solution: ["y", "y", "j", "d", "d", '"', "0", "p"],
    target_state: {
      text: "const shared = buildShared();\nconst ready = true;\nconst shared = buildShared();",
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "black-hole-preserve",
    chapter: "寄存器",
    title: "黑洞删除保留副本",
    snippet: "const shared = buildShared();\ndebug one\nconst ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "先 yank 第一行，再把中间调试行丢进黑洞寄存器，最后直接 `p` 贴回刚才复制的内容。",
    concept_tags: ['"_', "yy", "dd", "p"],
    par_moves: 8,
    required_sequences: [['"', "_", "d", "d"]],
    hints: [
      "如果不想让一次删除污染当前可粘贴内容，就把它扔进黑洞。",
      "试试 `yyj\"_ddp`。"
    ],
    guided_tip: "`\"_` 的价值在于“这次删除我不想记住”。",
    recommended_solution: ["y", "y", "j", '"', "_", "d", "d", "p"],
    target_state: {
      text: "const shared = buildShared();\nconst ready = true;\nconst shared = buildShared();",
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "named-register-store",
    chapter: "寄存器",
    title: "存进 a 寄存器",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst omega = 3;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "把第一行存进 `a` 寄存器，并在第二行后面把它贴出来。",
    concept_tags: ['"a', "yy", "p"],
    par_moves: 7,
    required_sequences: [['"', "a", "y", "y"], ['"', "a", "p"]],
    hints: [
      "命名寄存器像一个你自己点名的临时口袋。",
      "试试 `\"ayyj\"ap`。"
    ],
    guided_tip: "当你知道“这段内容等会儿还要再用”时，命名寄存器比默认寄存器更稳。",
    recommended_solution: ['"', "a", "y", "y", "j", '"', "a", "p"],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst alpha = 1;\nconst omega = 3;",
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "named-register-append",
    chapter: "寄存器",
    title: "追加到 a 寄存器",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst omega = 3;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "先把第一行存进 `a`，再把第二行追加进同一个寄存器，最后一起贴到末尾。",
    concept_tags: ['"a', '"A', "yy", "p"],
    par_moves: 11,
    required_sequences: [['"', "A", "y", "y"]],
    hints: [
      "小写寄存器是覆盖，大写寄存器是追加。",
      "试试 `\"ayyj\"Ayyj\"ap`。"
    ],
    guided_tip: "`\"A` 很像“继续往这个盒子里装东西”，适合组装多段复用内容。",
    recommended_solution: ['"', "a", "y", "y", "j", '"', "A", "y", "y", "j", '"', "a", "p"],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst omega = 3;\nconst alpha = 1;\nconst beta = 2;",
      cursor: { line: 3, col: 0 }
    }
  },
  {
    id: "named-register-loop",
    chapter: "寄存器",
    title: "复用同一寄存器",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst omega = 3;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "把第一行存进 `a` 寄存器，并在后面连续贴两次。",
    concept_tags: ['"a', "p"],
    par_moves: 10,
    required_sequences: [['"', "a", "p"]],
    hints: [
      "寄存器的好处之一，就是可以反复取，不会因为贴了一次就没了。",
      "试试先 `\"ap` 一次，再移动后用 `.` 重复。"
    ],
    guided_tip: "当你想多次复用同一段内容时，命名寄存器会比“重新复制一遍”自然得多。",
    recommended_solution: ['"', "a", "y", "y", "j", '"', "a", "p", "j", "."],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst alpha = 1;\nconst omega = 3;\nconst alpha = 1;",
      cursor: { line: 4, col: 0 }
    }
  },
  {
    id: "named-register-prepend",
    chapter: "寄存器",
    title: "贴到前面",
    snippet: "const alpha = 1;\nconst beta = 2;\nconst omega = 3;",
    cursor_start: { line: 2, col: 0 },
    goal_description: "把最后一行存进 `b` 寄存器，再贴到整个文件最前面。",
    concept_tags: ['"b', "P"],
    par_moves: 9,
    required_sequences: [['"', "b", "P"]],
    hints: [
      "`p` 是贴到后面，`P` 是贴到前面。",
      "试试 `\"byygg\"bP`。"
    ],
    guided_tip: "`p/P` 的前后差异配合命名寄存器后，会很适合重排整行结构。",
    recommended_solution: ['"', "b", "y", "y", "g", "g", '"', "b", "P"],
    target_state: {
      text: "const omega = 3;\nconst alpha = 1;\nconst beta = 2;\nconst omega = 3;",
      cursor: { line: 0, col: 0 }
    }
  }
];
