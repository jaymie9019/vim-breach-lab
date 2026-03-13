export const markLevels = [
  {
    id: "mark-anchor-return",
    chapter: "标记",
    title: "埋点回跳",
    snippet:
      'const config = {\n  timeout: 3000,\n  retries: 2\n};\n\nfunction boot() {\n  const mode = "draft";\n  return mode;\n}\n\nconst status = boot();',
    cursor_start: { line: 1, col: 2 },
    goal_description: "先在 `timeout` 行埋一个标记，去下方把 `draft` 改成 `live`，再精确跳回原位置。",
    concept_tags: ["ma", "`a", "/", 'ci"'],
    par_moves: 19,
    required_sequences: [["m", "a"], ["`", "a"]],
    hints: [
      "这关练的是“先存位置，再离开工作区”。",
      "试试 `ma/draft<CR>ci\"live<Esc>`a`。"
    ],
    guided_tip: "标记的价值不在于记住某一行，而在于你可以放心离开，然后瞬间回到原来的精确落点。",
    recommended_solution: ["m", "a", "/", "d", "r", "a", "f", "t", "Enter", "c", "i", '"', "l", "i", "v", "e", "Escape", "`", "a"],
    target_state: {
      text: 'const config = {\n  timeout: 3000,\n  retries: 2\n};\n\nfunction boot() {\n  const mode = "live";\n  return mode;\n}\n\nconst status = boot();',
      cursor: { line: 1, col: 2 }
    }
  },
  {
    id: "mark-line-return",
    chapter: "标记",
    title: "按行回到锚点",
    snippet:
      'const config = {\n  retries: 2,\n  timeout: 3000\n};\n\nfunction boot() {\n  const state = "draft";\n  return state;\n}\n\nconst status = boot();',
    cursor_start: { line: 1, col: 2 },
    goal_description: "先给 `retries` 行打标记，去下方把 `draft` 改成 `ready`，再按行跳回上面的配置行。",
    concept_tags: ["mb", "'b", "/", 'ci"'],
    par_moves: 20,
    required_sequences: [["m", "b"], ["'", "b"]],
    hints: [
      "反引号回到精确列，单引号回到这一行的起始编辑位。",
      "试试 `mb/draft<CR>ci\"ready<Esc>'b`。"
    ],
    guided_tip: "当你只关心“回到这一行继续干活”，`'a` 往往比 `` `a` `` 更自然。",
    recommended_solution: ["m", "b", "/", "d", "r", "a", "f", "t", "Enter", "c", "i", '"', "r", "e", "a", "d", "y", "Escape", "'", "b"],
    target_state: {
      text: 'const config = {\n  retries: 2,\n  timeout: 3000\n};\n\nfunction boot() {\n  const state = "ready";\n  return state;\n}\n\nconst status = boot();',
      cursor: { line: 1, col: 2 }
    }
  },
  {
    id: "line-jump-back",
    chapter: "标记",
    title: "回到跳前那一行",
    snippet:
      'const status = buildStatus();\n\nfunction boot() {\n  const state = "draft";\n  return state;\n}\n\nconst report = boot();',
    cursor_start: { line: 0, col: 0 },
    goal_description: "跳到下方把 `draft` 改成 `ready`，然后用 `''` 回到起跳前的第一行。",
    concept_tags: ["''", "/", 'ci"'],
    par_moves: 18,
    required_sequences: [["'", "'"]],
    hints: [
      "这关不是再找一遍第一行，而是沿着 jump list 退回去。",
      "试试 `/draft<CR>ci\"ready<Esc>''`。"
    ],
    guided_tip: "当你是“从这里跳出去处理点事，再回来”，`''` 会比重新搜索更像在沿着工作轨迹折返。",
    recommended_solution: ["/", "d", "r", "a", "f", "t", "Enter", "c", "i", '"', "r", "e", "a", "d", "y", "Escape", "'", "'"],
    target_state: {
      text: 'const status = buildStatus();\n\nfunction boot() {\n  const state = "ready";\n  return state;\n}\n\nconst report = boot();',
      cursor: { line: 0, col: 0 }
    }
  },
  {
    id: "last-change-bounce",
    chapter: "标记",
    title: "跳回上次改动",
    snippet:
      'const config = buildConfig();\nconst retries = 2;\n\nfunction boot() {\n  const mode = "draft";\n  return mode;\n}\n\nconst status = boot();',
    cursor_start: { line: 0, col: 0 },
    goal_description: "先去下方把 `draft` 改成 `live`，再离开现场，最后用 `'.` 跳回刚才改过的那一行。",
    concept_tags: ["'.", "/", "gg", 'ci"'],
    par_moves: 19,
    required_sequences: [["'", "."]],
    hints: [
      "这关练的是“我刚改过哪儿”，不是“我刚从哪儿跳过来”。",
      "试试 `/draft<CR>ci\"live<Esc>gg'.`。"
    ],
    guided_tip: "`. 和 '' 的区别在于：一个记最近改动，一个记最近跳转；两者都是长文件里非常省脑力的回位键。",
    recommended_solution: ["/", "d", "r", "a", "f", "t", "Enter", "c", "i", '"', "l", "i", "v", "e", "Escape", "g", "g", "'", "."],
    target_state: {
      text: 'const config = buildConfig();\nconst retries = 2;\n\nfunction boot() {\n  const mode = "live";\n  return mode;\n}\n\nconst status = boot();',
      cursor: { line: 4, col: 2 }
    }
  }
];
