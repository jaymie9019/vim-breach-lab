export const searchLevels = [
  {
    id: "slash-jump",
    chapter: "搜索驱动编辑",
    title: "搜索落点",
    snippet:
      "const session = buildSession(user, options);\nconst audit = track(user.id);\nconst preview = token.toUpperCase();",
    cursor_start: { line: 0, col: 0 },
    goal_description: "移动到第三行的 `token` 上，优先感受 `/` 作为编辑入口。",
    concept_tags: ["/", "<CR>"],
    par_moves: 7,
    hints: [
      "这关是搜索热身，目标不是手动挪过去，而是先建立搜索直觉。",
      "试试 `/token<CR>`，先让 Vim 帮你定位目标。"
    ],
    guided_tip: "搜索关前期更像在建立习惯，不一定要做成强约束技法关。",
    recommended_solution: ["/", "t", "o", "k", "e", "n", "Enter"],
    target_state: {
      text:
        "const session = buildSession(user, options);\nconst audit = track(user.id);\nconst preview = token.toUpperCase();",
      cursor: { line: 2, col: 16 }
    }
  },
  {
    id: "search-rewrite",
    chapter: "搜索驱动编辑",
    title: "搜索后改写",
    snippet: "const primary = theme.primary;\nconst fallback = colour;\nreturn fallback;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用搜索定位到 `colour`，再把它改成 `color`。",
    concept_tags: ["/", "cw"],
    par_moves: 13,
    hints: [
      "先让搜索把你送到目标单词，再用 `cw` 改写。",
      "`/colour<CR>cwcolor<Esc>` 是这关的标准路线。"
    ],
    guided_tip: "搜索真正厉害的地方，是把“找位置”和“开始编辑”连成一气。",
    recommended_solution: ["/", "c", "o", "l", "o", "u", "r", "Enter", "c", "w", "c", "o", "l", "o", "r", "Escape"],
    target_state: {
      text: "const primary = theme.primary;\nconst fallback = color;\nreturn fallback;",
      cursor: { line: 1, col: 21 }
    }
  },
  {
    id: "search-repeat",
    chapter: "搜索驱动编辑",
    title: "搜索连锁",
    snippet: "const first = draft;\nconst second = draft;\nconst third = draft;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "把三处 `draft` 全部改成 `live`，重点体验搜索和 repeat 的连锁。",
    concept_tags: ["/", "n", "."],
    par_moves: 15,
    hints: [
      "先建立一个搜索模式，再把第一次修改教给 Vim。",
      "`/draft<CR>ciwlive<Esc>n.n.` 是这关的推荐路线。"
    ],
    guided_tip: "真正高频的提速不是单次命令炫技，而是让同类修改自动滚起来。",
    recommended_solution: [
      "/", "d", "r", "a", "f", "t", "Enter", "c", "i", "w", "l", "i", "v", "e", "Escape",
      "n", ".", "n", "."
    ],
    target_state: {
      text: "const first = live;\nconst second = live;\nconst third = live;",
      cursor: { line: 2, col: 17 }
    }
  },
  {
    id: "star-fix",
    chapter: "搜索驱动编辑",
    title: "同词追击",
    snippet: "const colour = theme.primary;\nreturn colour;",
    cursor_start: { line: 0, col: 6 },
    goal_description: "从第一处 `colour` 出发，追到下一处同名词并把它改成 `color`。",
    concept_tags: ["*", "ciw"],
    par_moves: 10,
    required_sequences: [["*"]],
    hints: [
      "当光标已经落在单词上时，`*` 比重新打一遍搜索词更顺手。",
      "`*ciwcolor<Esc>` 就能命中下一处并完成改写。"
    ],
    guided_tip: "`*` 不是单纯搜索，它是在说“继续处理这个词的其他出现位置”。",
    recommended_solution: ["*", "c", "i", "w", "c", "o", "l", "o", "r", "Escape"],
    target_state: {
      text: "const colour = theme.primary;\nreturn color;",
      cursor: { line: 1, col: 11 }
    }
  },
  {
    id: "reverse-find",
    chapter: "搜索驱动编辑",
    title: "反向找回",
    snippet: "const session = token;\nconst audit = buildAudit();\nconst preview = token.toUpperCase();",
    cursor_start: { line: 0, col: 0 },
    goal_description: "先搜索到下一个 `token`，再用反向重复回到第一处 `token`。",
    concept_tags: ["/", "n", "N"],
    par_moves: 9,
    required_sequences: [["N"]],
    hints: [
      "这关不是只练找到目标，而是练“已经搜过之后怎么折返”。",
      "可以试试 `/token<CR>nN`，感受 `n` 和 `N` 的方向差异。"
    ],
    guided_tip: "把 `n` 和 `N` 当成“沿着同一搜索轨迹前进/后退”会更好记。",
    recommended_solution: ["/", "t", "o", "k", "e", "n", "Enter", "n", "N"],
    target_state: {
      text: "const session = token;\nconst audit = buildAudit();\nconst preview = token.toUpperCase();",
      cursor: { line: 0, col: 16 }
    }
  },
  {
    id: "question-find",
    chapter: "搜索驱动编辑",
    title: "反向搜索",
    snippet: "const fallback = token;\nconst preview = buildPreview();\nconst source = token.toUpperCase();",
    cursor_start: { line: 2, col: 34 },
    goal_description: "从文件底部反向搜索，回到第一行的 `token` 上。",
    concept_tags: ["?", "n"],
    par_moves: 8,
    required_sequences: [["?"], ["n"]],
    hints: [
      "这关重点不是向前搜，而是学会从当前点位向回找。",
      "试试 `?token<CR>n`，体验反向搜索的方向感。"
    ],
    guided_tip: "`?` 是 `/` 的镜像版本，配合 `n` 后方向感会和正向搜索相反。",
    recommended_solution: ["?", "t", "o", "k", "e", "n", "Enter", "n"],
    target_state: {
      text: "const fallback = token;\nconst preview = buildPreview();\nconst source = token.toUpperCase();",
      cursor: { line: 0, col: 17 }
    }
  },
  {
    id: "hash-jump",
    chapter: "搜索驱动编辑",
    title: "同词回跳",
    snippet: "const primary = token;\nconst fallback = buildFallback();\nreturn token;",
    cursor_start: { line: 2, col: 7 },
    goal_description: "从当前 `token` 出发，反向跳回上一处同名词。",
    concept_tags: ["#"],
    par_moves: 1,
    required_sequences: [["#"]],
    hints: [
      "如果 `*` 是向前追同词，`#` 就是向后回跳同词。",
      "把光标停在 `token` 上，按 `#`。"
    ],
    guided_tip: "`#` 很适合在“刚看到这个词，想回上一处看看”时使用。",
    recommended_solution: ["#"],
    target_state: {
      text: "const primary = token;\nconst fallback = buildFallback();\nreturn token;",
      cursor: { line: 0, col: 16 }
    }
  }
];
