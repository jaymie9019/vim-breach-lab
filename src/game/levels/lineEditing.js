export const lineEditingLevels = [
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
      "o", "c", "o", "n", "s", "t", " ", "c", "a", "c", "h", "e", " ", "=",
      " ", "f", "a", "l", "s", "e", ";", "Escape"
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
      "O", "c", "o", "n", "s", "t", " ", "p", "a", "y", "l", "o", "a", "d", " ",
      "=", " ", "b", "u", "i", "l", "d", "P", "a", "y", "l", "o", "a", "d",
      "(", ")", ";", "Escape"
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
  }
];
