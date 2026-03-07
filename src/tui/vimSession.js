import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

function ensureTrailingNewline(text) {
  return text.endsWith("\n") ? text : `${text}\n`;
}

function vimLiteral(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function normalizeText(text) {
  const unix = text.replace(/\r\n/g, "\n");
  return unix.endsWith("\n") ? unix.slice(0, -1) : unix;
}

function parseCursor(rawValue) {
  const [line, col] = rawValue.trim().split(",").map(Number);
  return {
    line: Math.max(0, (line || 1) - 1),
    col: Math.max(0, (col || 1) - 1)
  };
}

function vimListLiteral(items) {
  return `[${items.map((item) => vimLiteral(item)).join(", ")}]`;
}

function vimNormalLiteral(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''");
}

export function buildInstructionLines(level) {
  return [
    `Vim Breach Lab | ${level.title}`,
    "",
    `目标: ${level.goal_description}`,
    `重点: ${level.concept_tags.join(", ")}`,
    ...(level.required_sequences?.length
      ? [`要求: 至少使用 ${level.required_sequences.map((sequence) => sequence.join("")).join(" / ")}`]
      : []),
    `Par: ${level.par_moves}`,
    `起始光标: 第 ${level.cursor_start.line + 1} 行，第 ${level.cursor_start.col + 1} 列`,
    `提示: ${level.hints[0]}`,
    "退出: 推荐用 ZZ 或 Q，一次直接结束整个训练会话。"
  ];
}

export function buildSandbox(level, baseDir = os.tmpdir()) {
  const sandboxDir = fs.mkdtempSync(path.join(baseDir, `vim-breach-${level.id}-`));
  const filePath = path.join(sandboxDir, `${level.id}.txt`);
  const cursorPath = path.join(sandboxDir, "cursor.txt");
  const keylogPath = path.join(sandboxDir, "keylog.bin");
  const metaPath = path.join(sandboxDir, "meta.json");
  const setupPath = path.join(sandboxDir, "setup.vim");
  const instructionLines = buildInstructionLines(level);

  fs.writeFileSync(filePath, ensureTrailingNewline(level.snippet));
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        id: level.id,
        title: level.title,
        goal: level.goal_description,
        cursor_start: level.cursor_start,
        target_state: level.target_state
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    setupPath,
    [
      "let g:vim_breach_target_buf = bufnr('%')",
      `let g:vim_breach_cursor_path = ${vimLiteral(cursorPath)}`,
      "function! VimBreachRecordCursor() abort",
      "  let l:winid = bufwinid(g:vim_breach_target_buf)",
      "  if l:winid != -1",
      "    let l:current = win_getid()",
      "    call win_gotoid(l:winid)",
      "    call writefile([line('.') . ',' . col('.')], g:vim_breach_cursor_path)",
      "    call win_gotoid(l:current)",
      "  endif",
      "endfunction",
      "function! VimBreachQuit() abort",
      "  let l:winid = bufwinid(g:vim_breach_target_buf)",
      "  if l:winid != -1",
      "    call win_gotoid(l:winid)",
      "    silent write",
      "  endif",
      "  call VimBreachRecordCursor()",
      "  qall!",
      "endfunction",
      "augroup VimBreachLab",
      "  autocmd!",
      "  autocmd BufLeave <buffer> call VimBreachRecordCursor()",
      "  autocmd VimLeavePre * call VimBreachRecordCursor()",
      "augroup END",
      "topleft 8new",
      `call setline(1, ${vimListLiteral(instructionLines)})`,
      "setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nomodifiable nowrap nonumber norelativenumber nospell",
      "nnoremap <silent> Q :call VimBreachQuit()<CR>",
      "nnoremap <silent> ZZ :call VimBreachQuit()<CR>",
      "inoremap <silent> <C-q> <Esc>:call VimBreachQuit()<CR>",
      "wincmd j",
      `call cursor(${level.cursor_start.line + 1}, ${level.cursor_start.col + 1})`,
      ""
    ].join("\n")
  );

  return {
    sandboxDir,
    filePath,
    cursorPath,
    keylogPath,
    metaPath,
    setupPath
  };
}

function buildVimArgs(level, sandbox, options) {
  const args = [
    "-u",
    "NONE",
    "-U",
    "NONE",
    "-i",
    "NONE",
    "--noplugin",
    "-N",
    "-n",
    "--cmd",
    "set nomodeline noswapfile",
    "-W",
    sandbox.keylogPath,
    "-S",
    sandbox.setupPath
  ];

  if (options.scriptInputPath) {
    args.push("-s", options.scriptInputPath);
  }

  if (options.normalCommand) {
    args.push("-c", `execute 'normal ${vimNormalLiteral(options.normalCommand)}'`);
    args.push("-c", "call VimBreachQuit()");
  }

  args.push(sandbox.filePath);

  return args;
}

export function checkVimAvailable(vimPath = "/usr/bin/vim") {
  const result = spawnSync(vimPath, ["--version"], { stdio: "ignore" });
  return result.status === 0;
}

export function launchLevel(level, options = {}) {
  const sandbox = options.sandbox ?? buildSandbox(level);
  const vimPath = options.vimPath ?? "/usr/bin/vim";
  const args = buildVimArgs(level, sandbox, options);
  const quietMode = Boolean(options.scriptInputPath || options.normalCommand);
  const result = spawnSync(vimPath, args, {
    stdio: quietMode ? "ignore" : "inherit"
  });

  const finalBuffer = normalizeText(fs.readFileSync(sandbox.filePath, "utf8"));
  const finalCursor = fs.existsSync(sandbox.cursorPath)
    ? parseCursor(fs.readFileSync(sandbox.cursorPath, "utf8"))
    : { ...level.cursor_start };
  const keylog = fs.existsSync(sandbox.keylogPath) ? fs.readFileSync(sandbox.keylogPath) : Buffer.alloc(0);

  return {
    sandbox,
    exitCode: result.status ?? 1,
    signal: result.signal ?? null,
    finalBuffer,
    finalCursor,
    keylog
  };
}
