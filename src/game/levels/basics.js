export const basicLevels = [
  {
    id: "word-sprint",
    chapter: "精准跳转",
    title: "单词冲刺",
    snippet: "const session = buildSession(user, token, options);",
    cursor_start: { line: 0, col: 6 },
    goal_description: "不修改代码，把光标移动到 `token` 上。",
    concept_tags: ["f", "w"],
    par_moves: 3,
    hints: [
      "先用可见分隔符做锚点，再用 `w` 落到目标单词。",
      "`f,` 先跳到第一个逗号，再按 `w` 就能落到 `token`。"
    ],
    guided_tip: "热身关先练可见锚点，别一上来就数很多个 `w`。",
    recommended_solution: ["f", ",", "w"],
    target_state: {
      text: "const session = buildSession(user, token, options);",
      cursor: { line: 0, col: 35 }
    }
  },
  {
    id: "needle-drop",
    chapter: "精准跳转",
    title: "落针定位",
    snippet: "const status = fetchReport(user, team, region);",
    cursor_start: { line: 0, col: 15 },
    goal_description: "使用字符查找命令，落到 `region` 里最后那个 `n` 上。",
    concept_tags: ["f", "t"],
    par_moves: 4,
    hints: [
      "先跳到开头的 `(`，再停在结尾 `)` 的前一个字符。",
      "`f(` 接 `t)` 就能到目标。"
    ],
    guided_tip: "字符查找很像手术刀，目标清晰时它比逐字移动更狠。",
    recommended_solution: ["f", "(", "t", ")"],
    target_state: {
      text: "const status = fetchReport(user, team, region);",
      cursor: { line: 0, col: 44 }
    }
  },
  {
    id: "brace-bridge",
    chapter: "成对结构",
    title: "大括号跃迁",
    snippet: "if (shouldArchive(user)) {\n  queueCleanup(user.id);\n}",
    cursor_start: { line: 0, col: 25 },
    goal_description: "从开头的 `{` 直接跳到与之匹配的 `}`。",
    concept_tags: ["%"],
    par_moves: 1,
    hints: [
      "这关练的是结构感，不是方向键耐心。",
      "把光标放在括号上，然后按 `%`。"
    ],
    guided_tip: "成对符号本身就是地图，`%` 是最快的穿越方式。",
    recommended_solution: ["%"],
    target_state: {
      text: "if (shouldArchive(user)) {\n  queueCleanup(user.id);\n}",
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "inner-word-overwrite",
    chapter: "Text Objects",
    title: "覆盖 inner word",
    snippet: "const draftStatus = computeStatus(report);",
    cursor_start: { line: 0, col: 8 },
    goal_description: "用一条 change 命令，把 `draftStatus` 改成 `reviewStatus`。",
    concept_tags: ["ciw"],
    par_moves: 16,
    hints: [
      "不需要先手动走到单词边界。",
      "`ciwreviewStatus<Esc>` 就是干净解。"
    ],
    guided_tip: "Text objects 让你操作的是语义块，而不是坐标。",
    recommended_solution: [
      "c",
      "i",
      "w",
      "r",
      "e",
      "v",
      "i",
      "e",
      "w",
      "S",
      "t",
      "a",
      "t",
      "u",
      "s",
      "Escape"
    ],
    target_state: {
      text: "const reviewStatus = computeStatus(report);",
      cursor: { line: 0, col: 17 }
    }
  },
  {
    id: "quote-swap",
    chapter: "操作符组合",
    title: "引号内容替换",
    snippet: 'throw new Error("token expired");',
    cursor_start: { line: 0, col: 18 },
    goal_description: "把引号里的内容替换成 `session revoked`。",
    concept_tags: ['ci"'],
    par_moves: 19,
    hints: [
      "目标是引号里面的内容，不是引号本身。",
      '`ci"session revoked<Esc>` 就能解决。'
    ],
    guided_tip: "改 inner quote 是真实代码和日志里很高频的一次提速。",
    recommended_solution: [
      "c",
      "i",
      '"',
      "s",
      "e",
      "s",
      "s",
      "i",
      "o",
      "n",
      " ",
      "r",
      "e",
      "v",
      "o",
      "k",
      "e",
      "d",
      "Escape"
    ],
    target_state: {
      text: 'throw new Error("session revoked");',
      cursor: { line: 0, col: 31 }
    }
  },
  {
    id: "argument-purge",
    chapter: "操作符组合",
    title: "参数清除",
    snippet: "const formatter = formatUser(user.name, team.slug);",
    cursor_start: { line: 0, col: 31 },
    goal_description: "删掉整个参数列表，让调用只剩一个裸函数引用。",
    concept_tags: ["da("],
    par_moves: 3,
    hints: [
      "这次连括号也要一起消掉。",
      "`da(` 和 `dab` 在这里都能工作。"
    ],
    guided_tip: "around object 适合拆外壳，不只是清空内容。",
    recommended_solution: ["d", "a", "("],
    target_state: {
      text: "const formatter = formatUser;",
      cursor: { line: 0, col: 28 }
    }
  },
  {
    id: "dot-chain",
    chapter: "效率强化",
    title: "点命令连锁",
    snippet:
      'const row = {\n  primaryLabel: "draft",\n  secondaryLabel: "draft",\n  fallbackLabel: "draft"\n};',
    cursor_start: { line: 1, col: 18 },
    goal_description: "使用 repeat，把三个引号里的 `draft` 全部改成 `live`。",
    concept_tags: ['ci"', ".", "j"],
    par_moves: 12,
    hints: [
      "第一下编辑要先教会 Vim 你想重复什么。",
      '先做 `ci"live<Esc>`，然后向下移动，用 `.` 两次。'
    ],
    guided_tip: "`.` 是 Vim 开始显得有点不讲武德的地方。",
    recommended_solution: [
      "c",
      "i",
      '"',
      "l",
      "i",
      "v",
      "e",
      "Escape",
      "j",
      ".",
      "j",
      "."
    ],
    target_state: {
      text: 'const row = {\n  primaryLabel: "live",\n  secondaryLabel: "live",\n  fallbackLabel: "live"\n};',
      cursor: { line: 3, col: 21 }
    }
  },
  {
    id: "bang-cleanup",
    chapter: "基础编辑",
    title: "删除多余字符",
    snippet: 'const label = "draft!";',
    cursor_start: { line: 0, col: 20 },
    goal_description: "删除字符串里多余的 `!`。",
    concept_tags: ["x"],
    par_moves: 1,
    required_sequences: [["x"]],
    hints: [
      "这是最短平快的一关，目标字符就在光标下面。",
      "直接按 `x` 删除当前字符。"
    ],
    guided_tip: "`x` 适合处理这种落在光标下的单字符脏数据。",
    recommended_solution: ["x"],
    target_state: {
      text: 'const label = "draft";',
      cursor: { line: 0, col: 20 }
    }
  },
  {
    id: "draft-prune",
    chapter: "基础编辑",
    title: "删掉多余单词",
    snippet: "// draft remove this note",
    cursor_start: { line: 0, col: 3 },
    goal_description: "删掉注释里多余的 `draft`。",
    concept_tags: ["dw"],
    par_moves: 2,
    required_sequences: [["d", "w"]],
    hints: [
      "这里目标是删掉一个完整单词，不是一个字符一个字符擦。",
      "`dw` 会从当前光标删除到下一个单词开头。"
    ],
    guided_tip: "`dw` 是日常清理多余词语时最顺手的基础动作。",
    recommended_solution: ["d", "w"],
    target_state: {
      text: "// remove this note",
      cursor: { line: 0, col: 3 }
    }
  },
  {
    id: "colour-fix",
    chapter: "基础编辑",
    title: "改写当前单词",
    snippet: "let colour = theme.primary;",
    cursor_start: { line: 0, col: 4 },
    goal_description: "把 `colour` 改成 `color`。",
    concept_tags: ["cw"],
    par_moves: 8,
    required_sequences: [["c", "w"]],
    hints: [
      "这一关不需要 text object，直接对当前单词改写。",
      "`cwcolor<Esc>` 就能完成。"
    ],
    guided_tip: "`cw` 很适合做当前单词的短重命名。",
    recommended_solution: ["c", "w", "c", "o", "l", "o", "r", "Escape"],
    target_state: {
      text: "let color = theme.primary;",
      cursor: { line: 0, col: 8 }
    }
  },
  {
    id: "undo-rescue",
    chapter: "恢复控制",
    title: "撤销救火",
    snippet: 'const role = "admn";',
    cursor_start: { line: 0, col: 14 },
    goal_description: "把引号里的内容改成 `admin`，并且本关至少使用一次 `u`。",
    concept_tags: ["u", 'ci"'],
    par_moves: 10,
    required_sequences: [["u"]],
    hints: [
      "这关不是要求你只靠 `u` 完成，而是要求你在流程里真正用到它。",
      "一个自然路线是先误删一下，用 `u` 撤回，再做 `ci\"admin<Esc>`。"
    ],
    guided_tip: "`u` 是救火键，先习惯在低风险场景里把它按顺手。",
    recommended_solution: ["x", "u", "c", "i", '"', "a", "d", "m", "i", "n", "Escape"],
    target_state: {
      text: 'const role = "admin";',
      cursor: { line: 0, col: 18 }
    }
  }
];
