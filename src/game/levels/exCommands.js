export const exCommandLevels = [
  {
    id: "sub-once",
    chapter: "Ex 命令",
    title: "单行替换",
    snippet: 'const mode = "draft";',
    cursor_start: { line: 0, col: 0 },
    goal_description: "只用当前行的 `:s`，把 `draft` 改成 `live`。",
    concept_tags: [":s"],
    par_moves: 15,
    required_sequences: [[":", "s"]],
    hints: [
      "这关不是普通 Normal mode 改写，而是用命令行对当前行做一次替换。",
      "试试 `:s/draft/live/<CR>`。"
    ],
    guided_tip: "`:s` 是进入 Ex 的最低成本入口：还是改一行，但开始用“命令描述变换”而不是手动编辑。",
    recommended_solution: [":", "s", "/", "d", "r", "a", "f", "t", "/", "l", "i", "v", "e", "/", "Enter"],
    target_state: {
      text: 'const mode = "live";',
      cursor: { line: 0, col: 0 }
    }
  },
  {
    id: "sub-global",
    chapter: "Ex 命令",
    title: "全文件批改",
    snippet: 'const primary = "colour";\nconst secondary = "colour";\nconst accent = "colour";',
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 `:%s` 把整份文件里的 `colour` 全部改成 `color`。",
    concept_tags: [":%s"],
    par_moves: 18,
    required_sequences: [[":", "%", "s"]],
    hints: [
      "这关的重点是范围 `%`，不是逐行重复替换。",
      "试试 `:%s/colour/color/g<CR>`。"
    ],
    guided_tip: "`:%s` 是从“会改一处”走向“能批量统一全文件”的第一步。",
    recommended_solution: [":", "%", "s", "/", "c", "o", "l", "o", "u", "r", "/", "c", "o", "l", "o", "r", "/", "g", "Enter"],
    target_state: {
      text: 'const primary = "color";\nconst secondary = "color";\nconst accent = "color";',
      cursor: { line: 2, col: 0 }
    }
  },
  {
    id: "global-prune",
    chapter: "Ex 命令",
    title: "只清日志行",
    snippet: "debug one\nconst ready = true;\ndebug two\nconst mode = live;\ndebug three",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 `:g` 删除所有以 `debug` 开头的噪音行。",
    concept_tags: [":g", "d"],
    par_moves: 12,
    required_sequences: [[":", "g", "/"]],
    hints: [
      "这关练的是按模式筛选行，不是逐行 `dd`。",
      "试试 `:g/^debug/d<CR>`。"
    ],
    guided_tip: "`:g/pattern/d` 的思路是“先选中这一类行，再统一处理”，这和 Normal mode 的逐个清扫是两种层级。",
    recommended_solution: [":", "g", "/", "^", "d", "e", "b", "u", "g", "/", "d", "Enter"],
    target_state: {
      text: "const ready = true;\nconst mode = live;",
      cursor: { line: 1, col: 0 }
    }
  },
  {
    id: "norm-batch",
    chapter: "Ex 命令",
    title: "批量补分号",
    snippet: "const alpha = 1\nconst beta = 2\nconst gamma = 3",
    cursor_start: { line: 0, col: 0 },
    goal_description: "用 `:%norm` 一次给每一行都补上分号。",
    concept_tags: [":norm", "A"],
    par_moves: 10,
    required_sequences: [[":", "%", "n", "o", "r", "m"]],
    hints: [
      "这关不是手动三次 `A;`，而是让 Ex 去驱动 Normal 命令。",
      "试试 `:%norm A;<CR>`。"
    ],
    guided_tip: "`:norm` 的力量在于：当你已经知道一条 Normal 命令怎么做时，可以把它放大到一整批行。",
    recommended_solution: [":", "%", "n", "o", "r", "m", " ", "A", ";", "Enter"],
    target_state: {
      text: "const alpha = 1;\nconst beta = 2;\nconst gamma = 3;",
      cursor: { line: 2, col: 15 }
    }
  }
];
