export const gCommandLevels = [
  {
    id: "insert-return",
    chapter: "g 系列补充",
    title: "回到上次插入",
    snippet: 'const label = "";',
    cursor_start: { line: 0, col: 15 },
    goal_description: "先在空字符串里输入 `Hello`，离开后再用 `gi` 回到上次插入点，把它补成 `Hello, world`。",
    concept_tags: ["gi", "i"],
    par_moves: 15,
    required_sequences: [["g", "i"]],
    hints: [
      "这关练的是“离开插入区后还能瞬间接着写”。",
      "试试 `iHello<Esc>0gi, world<Esc>`。"
    ],
    guided_tip: "`gi` 不是单纯回到某一列，它回的是“上次正在写字的地方”，很适合打断后续写。",
    recommended_solution: ["i", "H", "e", "l", "l", "o", "Escape", "0", "g", "i", ",", " ", "w", "o", "r", "l", "d", "Escape"],
    target_state: {
      text: 'const label = "Hello, world";',
      cursor: { line: 0, col: 26 }
    }
  },
  {
    id: "visual-reselect",
    chapter: "g 系列补充",
    title: "重选刚才那段",
    snippet: "const mode = draft;",
    cursor_start: { line: 0, col: 13 },
    goal_description: "先用 visual 选中 `draft` 并 yank，再用 `gv` 重选同一段，把它改成 `live`。",
    concept_tags: ["v", "y", "gv", "c"],
    par_moves: 10,
    required_sequences: [["g", "v"]],
    hints: [
      "这关不是重新手选一遍，而是复用刚才的可视范围。",
      "试试 `veygvclive<Esc>`。"
    ],
    guided_tip: "`gv` 的价值在于复用你刚刚已经确认过的范围，避免再手圈一次。",
    recommended_solution: ["v", "e", "y", "g", "v", "c", "l", "i", "v", "e", "Escape"],
    target_state: {
      text: "const mode = live;",
      cursor: { line: 0, col: 16 }
    }
  },
  {
    id: "change-history-back",
    chapter: "g 系列补充",
    title: "跳回最近改动",
    snippet: 'const primary = "draft";\nconst secondary = "draft";',
    cursor_start: { line: 0, col: 0 },
    goal_description: "先把两处 `draft` 都改成 `live`，离开现场后再用 `g;` 跳回最近一次改动。",
    concept_tags: ["g;", "/", 'ci"'],
    par_moves: 22,
    required_sequences: [["g", ";"]],
    hints: [
      "这关练的是改动轨迹，不是 jump list。",
      "试试 `/draft<CR>ci\"live<Esc>nci\"live<Esc>ggg;`。"
    ],
    guided_tip: "`g;` 和标记不同，它不需要你提前布置锚点，而是顺着最近的改动历史往回跳。",
    recommended_solution: ["/", "d", "r", "a", "f", "t", "Enter", "c", "i", '"', "l", "i", "v", "e", "Escape", "n", "c", "i", '"', "l", "i", "v", "e", "Escape", "g", "g", "g", ";"],
    target_state: {
      text: 'const primary = "live";\nconst secondary = "live";',
      cursor: { line: 1, col: 19 }
    }
  }
];
