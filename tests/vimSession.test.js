import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { levels } from "../src/game/levels.js";
import { buildInstructionLines, buildSandbox, checkVimAvailable, launchLevel } from "../src/tui/vimSession.js";

function writeKeyScript(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vim-breach-script-"));
  const scriptPath = path.join(dir, "keys.vim");
  fs.writeFileSync(scriptPath, contents);
  return scriptPath;
}

test("buildSandbox writes the challenge file and metadata", () => {
  const level = levels[0];
  const sandbox = buildSandbox(level);

  assert.equal(fs.existsSync(sandbox.filePath), true);
  assert.equal(fs.existsSync(sandbox.metaPath), true);
  assert.match(fs.readFileSync(sandbox.filePath, "utf8"), /buildSession/);
});

test("buildInstructionLines includes goal and concept summary", () => {
  const level = levels[0];
  const lines = buildInstructionLines(level);

  assert.match(lines.join("\n"), /目标:/);
  assert.match(lines.join("\n"), /重点: f, w/);
  assert.match(lines.join("\n"), /退出: 推荐用 ZZ 或 Q/);
});

test("buildInstructionLines surfaces required techniques when present", () => {
  const level = levels.find((item) => item.id === "undo-rescue");
  const lines = buildInstructionLines(level);

  assert.match(lines.join("\n"), /要求: 至少使用 u/);
});

test("launchLevel can run a scripted motion-only session against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "word-sprint");
  const sandbox = buildSandbox(level);

  const runResult = launchLevel(level, {
    sandbox,
    normalCommand: "f,w"
  });

  assert.equal(runResult.finalBuffer, level.snippet);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run an append-at-line-end challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "line-append");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("A;\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a counted motion challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "counted-jump");
  const sandbox = buildSandbox(level);

  const runResult = launchLevel(level, {
    sandbox,
    normalCommand: "3w"
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a line-start insert challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "line-inject");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("Iconst \u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a join-lines challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "line-merge");
  const sandbox = buildSandbox(level);

  const runResult = launchLevel(level, {
    sandbox,
    normalCommand: "J"
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a counted line-delete challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "bulk-delete");
  const sandbox = buildSandbox(level);

  const runResult = launchLevel(level, {
    sandbox,
    normalCommand: "3dd"
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a below-insert challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "below-insert");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("oconst cache = false;\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run an above-insert challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "above-insert");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("Oconst payload = buildPayload();\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a change-to-end-of-line challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "tail-rewrite");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript('C"production";\u001bQ');

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a visual characterwise change challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "visual-change-word");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("veclive\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a visual linewise delete challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "visual-line-delete");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("VdQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a visual linewise rewrite challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "visual-line-rewrite");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("Vcconst ready = true;\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a zero-register recall challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "zero-register-recall");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript('yyjdd"0pQ');

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a black-hole preserve challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "black-hole-preserve");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript('yyj"_ddpQ');

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});
