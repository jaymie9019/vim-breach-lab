export const visualLevels = [
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
      "V", "c", "c", "o", "n", "s", "t", " ", "r", "e", "a", "d", "y", " ", "=",
      " ", "t", "r", "u", "e", ";", "Escape"
    ],
    target_state: {
      text: "const ready = true;",
      cursor: { line: 0, col: 18 }
    }
  }
];
