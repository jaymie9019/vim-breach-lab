export const caseEditingLevels = [
  {
    id: "lowercase-normalize",
    chapter: "大小写编辑",
    title: "单词转小写",
    snippet: 'const MODE = "LIVE";',
    cursor_start: { line: 0, col: 6 },
    goal_description: "把变量名 `MODE` 直接转成小写 `mode`。",
    concept_tags: ["guw"],
    par_moves: 3,
    required_sequences: [["g", "u", "w"]],
    hints: [
      "这关不是重新输入，而是直接对当前单词做大小写变换。",
      "试试 `guw`。"
    ],
    guided_tip: "`guw` 的价值在于“语义级改形态”，而不是删除后重打一遍。",
    recommended_solution: ["g", "u", "w"],
    target_state: {
      text: 'const mode = "LIVE";',
      cursor: { line: 0, col: 6 }
    }
  },
  {
    id: "uppercase-normalize",
    chapter: "大小写编辑",
    title: "单词转大写",
    snippet: "const flag = ready;",
    cursor_start: { line: 0, col: 13 },
    goal_description: "把状态名 `ready` 直接转成大写 `READY`。",
    concept_tags: ["gUw"],
    par_moves: 3,
    required_sequences: [["g", "U", "w"]],
    hints: [
      "这关练的是用 operator 直接统一单词形态。",
      "试试 `gUw`。"
    ],
    guided_tip: "`gUw` 很适合把常量名快速抬成大写，而不是进入插入模式逐个改字母。",
    recommended_solution: ["g", "U", "w"],
    target_state: {
      text: "const flag = READY;",
      cursor: { line: 0, col: 13 }
    }
  },
  {
    id: "toggle-case-word",
    chapter: "大小写编辑",
    title: "翻转单词大小写",
    snippet: "const Draft = true;",
    cursor_start: { line: 0, col: 6 },
    goal_description: "把 `Draft` 的大小写整体翻转成 `dRAFT`。",
    concept_tags: ["g~w"],
    par_moves: 3,
    required_sequences: [["g", "~", "w"]],
    hints: [
      "这关练的是 toggle，不是单纯大写或小写。",
      "试试 `g~w`。"
    ],
    guided_tip: "`g~w` 适合处理“基本对了，但大小写风格全反了”的收尾问题。",
    recommended_solution: ["g", "~", "w"],
    target_state: {
      text: "const dRAFT = true;",
      cursor: { line: 0, col: 6 }
    }
  }
];
