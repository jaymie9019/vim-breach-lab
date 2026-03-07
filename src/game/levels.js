export const levels = [
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
  },
  {
    id: "line-home",
    chapter: "行级操作",
    title: "回到起点",
    snippet: "    const status = fetchReport(user);",
    cursor_start: { line: 0, col: 23 },
    goal_description: "不修改代码，把光标移到这一行真正的编辑起点。",
    concept_tags: ["^", "0"],
    par_moves: 1,
    hints: [
      "这关的目标不是字符串第 1 列，而是第一个非空字符。",
      "`^` 会直接落到真正的编辑起点。"
    ],
    guided_tip: "行首移动要分清“绝对第 1 列”和“真正开始写代码的位置”。",
    recommended_solution: ["^"],
    target_state: {
      text: "    const status = fetchReport(user);",
      cursor: { line: 0, col: 4 }
    }
  },
  {
    id: "line-tail",
    chapter: "行级操作",
    title: "尾部补位",
    snippet: "const total = computeTotal(items);",
    cursor_start: { line: 0, col: 6 },
    goal_description: "不修改代码，把光标移到这一行的最后一个字符上。",
    concept_tags: ["$"],
    par_moves: 1,
    hints: [
      "行尾定位不需要一路走过去。",
      "`$` 会把你直接送到这一行最后一个字符。"
    ],
    guided_tip: "行内远距离移动时，优先想“整行锚点”，不要手挪。",
    recommended_solution: ["$"],
    target_state: {
      text: "const total = computeTotal(items);",
      cursor: { line: 0, col: 33 }
    }
  },
  {
    id: "line-append",
    chapter: "行级操作",
    title: "行尾补分号",
    snippet: "const total = computeTotal(items)",
    cursor_start: { line: 0, col: 0 },
    goal_description: "给这行语句在末尾补上分号。",
    concept_tags: ["A"],
    par_moves: 3,
    hints: [
      "目标是在行尾追加，不需要先手动挪到最后。",
      "`A;<Esc>` 就是这一关的干净路线。"
    ],
    guided_tip: "`A` 是“去行尾并进入插入”的合体动作，行尾补内容时很顺手。",
    recommended_solution: ["A", ";", "Escape"],
    target_state: {
      text: "const total = computeTotal(items);",
      cursor: { line: 0, col: 33 }
    }
  },
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
    id: "tail-delete",
    chapter: "行级操作",
    title: "删掉尾部注释",
    snippet: "const total = computeTotal(items); // temporary debug",
    cursor_start: { line: 0, col: 34 },
    goal_description: "删除这一行尾部临时留下的注释。",
    concept_tags: ["D"],
    par_moves: 1,
    required_sequences: [["D"]],
    hints: [
      "这里删的是“从当前位置到行尾”，不是一个词也不是一小段字符。",
      "`D` 会直接清掉光标后的整段尾巴。"
    ],
    guided_tip: "遇到整段尾部噪音时，`D` 比手动选择范围自然得多。",
    recommended_solution: ["D"],
    target_state: {
      text: "const total = computeTotal(items);",
      cursor: { line: 0, col: 33 }
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
      "/",
      "d",
      "r",
      "a",
      "f",
      "t",
      "Enter",
      "c",
      "i",
      "w",
      "l",
      "i",
      "v",
      "e",
      "Escape",
      "n",
      ".",
      "n",
      "."
    ],
    target_state: {
      text: "const first = live;\nconst second = live;\nconst third = live;",
      cursor: { line: 2, col: 17 }
    }
  },
  {
    id: "line-inject",
    chapter: "行级操作",
    title: "行首补 const",
    snippet: "theme.primary = color;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "给这一行补上 `const ` 前缀。",
    concept_tags: ["I"],
    par_moves: 8,
    required_sequences: [["I"]],
    hints: [
      "这关练的是“去行首并进入插入”，不是先挪到头再慢慢敲。",
      "`Iconst <Esc>` 就能把前缀补进去。"
    ],
    guided_tip: "`I` 和 `A` 一样，都是“移动 + 进入插入”的高频合体动作。",
    recommended_solution: ["I", "c", "o", "n", "s", "t", " ", "Escape"],
    target_state: {
      text: "const theme.primary = color;",
      cursor: { line: 0, col: 5 }
    }
  },
  {
    id: "line-merge",
    chapter: "行级操作",
    title: "合并拆裂行",
    snippet: "const summary = formatUser(user.name,\n  team.slug);",
    cursor_start: { line: 0, col: 37 },
    goal_description: "把被拆成两行的调用重新合并成一行。",
    concept_tags: ["J"],
    par_moves: 1,
    required_sequences: [["J"]],
    hints: [
      "这里不是删换行那么简单，而是把两行按正常空格规则拼回去。",
      "`J` 会把当前行和下一行自然合并。"
    ],
    guided_tip: "`J` 很适合清理被错误拆开的代码，而不是手动删换行再补空格。",
    recommended_solution: ["J"],
    target_state: {
      text: "const summary = formatUser(user.name, team.slug);",
      cursor: { line: 0, col: 37 }
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
  },
  {
    id: "line-end-smart",
    chapter: "行级操作",
    title: "行尾智能落点",
    snippet: "const ready = true;   ",
    cursor_start: { line: 0, col: 0 },
    goal_description: "不修改代码，落到最后一个非空字符上，而不是空格尾巴上。",
    concept_tags: ["g_"],
    par_moves: 2,
    required_sequences: [["g", "_"]],
    hints: [
      "这关不是普通的 `$`，因为行尾后面还挂着空格。",
      "`g_` 会停在最后一个非空字符上。"
    ],
    guided_tip: "`$` 去的是物理行尾，`g_` 去的是更适合继续编辑的“有效行尾”。",
    recommended_solution: ["g", "_"],
    target_state: {
      text: "const ready = true;   ",
      cursor: { line: 0, col: 18 }
    }
  },
  {
    id: "below-insert",
    chapter: "行级操作",
    title: "下方插入新行",
    snippet: "const ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "在当前行下方插入一行 `const cache = false;`。",
    concept_tags: ["o"],
    par_moves: 22,
    required_sequences: [["o"]],
    hints: [
      "这关练的是“开新行并立刻进入插入”，不是先到行尾再回车。",
      "`oconst cache = false;<Esc>` 是最自然的路线。"
    ],
    guided_tip: "`o` 是写新代码时非常常用的动作，它不是普通插入，而是结构性插入。",
    recommended_solution: [
      "o",
      "c",
      "o",
      "n",
      "s",
      "t",
      " ",
      "c",
      "a",
      "c",
      "h",
      "e",
      " ",
      "=",
      " ",
      "f",
      "a",
      "l",
      "s",
      "e",
      ";",
      "Escape"
    ],
    target_state: {
      text: "const ready = true;\nconst cache = false;",
      cursor: { line: 1, col: 19 }
    }
  },
  {
    id: "above-insert",
    chapter: "行级操作",
    title: "上方插入定义",
    snippet: "return payload;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "在当前行上方补一行 `const payload = buildPayload();`。",
    concept_tags: ["O"],
    par_moves: 32,
    required_sequences: [["O"]],
    hints: [
      "目标是在上方开新行，不是把当前行推着往下改。",
      "`Oconst payload = buildPayload();<Esc>` 会直接在上方开出新行。"
    ],
    guided_tip: "`O` 很适合补定义、补注释或在现有逻辑前插一层准备代码。",
    recommended_solution: [
      "O",
      "c",
      "o",
      "n",
      "s",
      "t",
      " ",
      "p",
      "a",
      "y",
      "l",
      "o",
      "a",
      "d",
      " ",
      "=",
      " ",
      "b",
      "u",
      "i",
      "l",
      "d",
      "P",
      "a",
      "y",
      "l",
      "o",
      "a",
      "d",
      "(",
      ")",
      ";",
      "Escape"
    ],
    target_state: {
      text: "const payload = buildPayload();\nreturn payload;",
      cursor: { line: 0, col: 30 }
    }
  },
  {
    id: "tail-rewrite",
    chapter: "行级操作",
    title: "改写尾部片段",
    snippet: "const env = process.env.NODE_ENV;",
    cursor_start: { line: 0, col: 12 },
    goal_description: "把等号右侧整段改写成 `\"production\";`。",
    concept_tags: ["C"],
    par_moves: 14,
    required_sequences: [["C"]],
    hints: [
      "这关不是删掉尾部再慢慢补，而是直接把整段尾巴切换成 change。",
      '`C"production";<Esc>` 会一口气改完整段。'
    ],
    guided_tip: "`C` 可以理解成“从这里改到行尾”，它是 `D` 的 change 版本。",
    recommended_solution: ["C", '"', "p", "r", "o", "d", "u", "c", "t", "i", "o", "n", '"', ";", "Escape"],
    target_state: {
      text: 'const env = "production";',
      cursor: { line: 0, col: 24 }
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
  },
  {
    id: "visual-delete-word",
    chapter: "可视模式",
    title: "可视删除单词",
    snippet: "// draft note",
    cursor_start: { line: 0, col: 3 },
    goal_description: "用 visual mode 选中 `draft` 并删除它。",
    concept_tags: ["v", "e", "d"],
    par_moves: 3,
    required_sequences: [["v"]],
    hints: [
      "这关练的是“先圈住，再执行操作”，不是直接用 operator 组合。",
      "`ved` 会选中当前单词到结尾，再删掉它。"
    ],
    guided_tip: "可视模式适合你想先“看见范围”，再决定要做什么的时候。",
    recommended_solution: ["v", "e", "d"],
    target_state: {
      text: "//  note",
      cursor: { line: 0, col: 3 }
    }
  },
  {
    id: "visual-change-word",
    chapter: "可视模式",
    title: "可视改写单词",
    snippet: "const mode = draft;",
    cursor_start: { line: 0, col: 13 },
    goal_description: "用 visual mode 选中 `draft`，并把它改成 `live`。",
    concept_tags: ["v", "e", "c"],
    par_moves: 8,
    required_sequences: [["v"]],
    hints: [
      "先圈中范围，再把这段文本整体换掉。",
      "`veclive<Esc>` 是这关的直接路线。"
    ],
    guided_tip: "当你已经知道要改哪一段，但还没形成稳定 text object 习惯时，visual 很直观。",
    recommended_solution: ["v", "e", "c", "l", "i", "v", "e", "Escape"],
    target_state: {
      text: "const mode = live;",
      cursor: { line: 0, col: 16 }
    }
  },
  {
    id: "visual-delete-tail",
    chapter: "可视模式",
    title: "可视删除尾部",
    snippet: "const ready = true; // TODO remove",
    cursor_start: { line: 0, col: 20 },
    goal_description: "从注释开头开始，用 visual mode 删除整段尾部说明。",
    concept_tags: ["v", "$", "d"],
    par_moves: 3,
    required_sequences: [["v"]],
    hints: [
      "这关练的是：先从当前位置圈到行尾，再决定删除。",
      "`v$d` 会把注释尾巴整段带走。"
    ],
    guided_tip: "visual 的优势之一，是对“到行尾这一段”这样的范围非常直观。",
    recommended_solution: ["v", "$", "d"],
    target_state: {
      text: "const ready = true; ",
      cursor: { line: 0, col: 19 }
    }
  },
  {
    id: "visual-line-delete",
    chapter: "可视模式",
    title: "整行可视删除",
    snippet: "debug one\nconst ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 linewise visual 删除第一行调试输出。",
    concept_tags: ["V", "d"],
    par_moves: 2,
    required_sequences: [["V"]],
    hints: [
      "这关不是字符级选择，而是整行选择。",
      "`Vd` 会整行选中并删除。"
    ],
    guided_tip: "`V` 适合那些“这一整行都该消失”的场景。",
    recommended_solution: ["V", "d"],
    target_state: {
      text: "const ready = true;",
      cursor: { line: 0, col: 0 }
    }
  },
  {
    id: "visual-line-sweep",
    chapter: "可视模式",
    title: "多行可视清扫",
    snippet: "debug one\ndebug two\nconst ready = true;",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 linewise visual 一次清掉前两行调试输出。",
    concept_tags: ["V", "j", "d"],
    par_moves: 3,
    required_sequences: [["V"]],
    hints: [
      "这关练的是整行选择再扩范围，不是连着按两次 `dd`。",
      "`Vjd` 会把前两行一起删掉。"
    ],
    guided_tip: "当你想先确认范围再下手时，`V` 比 count + `dd` 更有“所见即所得”的感觉。",
    recommended_solution: ["V", "j", "d"],
    target_state: {
      text: "const ready = true;",
      cursor: { line: 0, col: 0 }
    }
  },
  {
    id: "visual-line-rewrite",
    chapter: "可视模式",
    title: "整行可视改写",
    snippet: "debug one",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 linewise visual 把这一整行替换成 `const ready = true;`。",
    concept_tags: ["V", "c"],
    par_moves: 21,
    required_sequences: [["V"]],
    hints: [
      "这关练的是：整行选中后直接 change，而不是先删掉再进入插入。",
      "`Vcconst ready = true;<Esc>` 会整行改写。"
    ],
    guided_tip: "`V` + `c` 很适合把一整行废代码直接换成新内容。",
    recommended_solution: [
      "V",
      "c",
      "c",
      "o",
      "n",
      "s",
      "t",
      " ",
      "r",
      "e",
      "a",
      "d",
      "y",
      " ",
      "=",
      " ",
      "t",
      "r",
      "u",
      "e",
      ";",
      "Escape"
    ],
    target_state: {
      text: "const ready = true;",
      cursor: { line: 0, col: 18 }
    }
  }
];
