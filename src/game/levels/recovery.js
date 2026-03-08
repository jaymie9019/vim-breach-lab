export const recoveryLevels = [
  {
    id: "undo-then-correct",
    chapter: "恢复与修正",
    title: "撤销后重做",
    snippet: 'const mode = "draft";',
    cursor_start: { line: 0, col: 14 },
    goal_description: "把引号里的内容改成 `live`，并且流程里至少使用一次 `u`。",
    concept_tags: ["u", 'ci"'],
    par_moves: 10,
    required_sequences: [["u"]],
    hints: [
      "这关故意要求你先体验一次恢复，再回到正确路线。",
      "一个自然走法是先 `x`，再 `u`，然后 `ci\"live<Esc>`。"
    ],
    guided_tip: "好的 Vim 手感不是从不出错，而是出错后能马上回到正轨。",
    recommended_solution: ["x", "u", "c", "i", '"', "l", "i", "v", "e", "Escape"],
    target_state: {
      text: 'const mode = "live";',
      cursor: { line: 0, col: 17 }
    }
  },
  {
    id: "panic-control",
    chapter: "恢复与修正",
    title: "错路止损",
    snippet: 'const state = "draft";',
    cursor_start: { line: 0, col: 15 },
    goal_description: "把引号里的内容改成 `ready`，并且流程里至少使用一次 `u`。",
    concept_tags: ["u", 'ci"'],
    par_moves: 11,
    required_sequences: [["u"], ["c", "i", '"']],
    hints: [
      "这关故意让你感受一下：走错了没关系，重点是能不能及时止损。",
      "可以先犯一次错，再用 `u` 撤回，然后 `ci\"ready<Esc>`。"
    ],
    guided_tip: "恢复关不是为了鼓励失误，而是训练“失误之后也能保持节奏”。",
    recommended_solution: ["x", "x", "u", "c", "i", '"', "r", "e", "a", "d", "y", "Escape"],
    target_state: {
      text: 'const state = "ready";',
      cursor: { line: 0, col: 19 }
    }
  },
  {
    id: "recover-chain",
    chapter: "恢复与修正",
    title: "两次修正",
    snippet: 'const role = "admn";',
    cursor_start: { line: 0, col: 14 },
    goal_description: "连续两次犯错后恢复，再把字符串改成 `admin`。",
    concept_tags: ["u", 'ci"'],
    par_moves: 12,
    required_sequences: [["u", "u"]],
    hints: [
      "这关比单次恢复更进一步，目标是感受连续撤销也要敢按。",
      "可以先连错两次，再 `uu`，最后 `ci\"admin<Esc>`。"
    ],
    guided_tip: "真正有安全感的编辑流，不是从不犯错，而是知道错几次都能拉回来。",
    recommended_solution: ["x", "x", "u", "u", "c", "i", '"', "a", "d", "m", "i", "n", "Escape"],
    target_state: {
      text: 'const role = "admin";',
      cursor: { line: 0, col: 18 }
    }
  }
];
