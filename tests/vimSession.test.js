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

test("launchLevel can run a mark exact-return challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "mark-anchor-return");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("ma/draft\nci\"live\u001b`aQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a jump-list return challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "line-jump-back");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("/draft\nci\"ready\u001b''Q");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a lowercase transform challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "lowercase-normalize");
  const sandbox = buildSandbox(level);

  const runResult = launchLevel(level, {
    sandbox,
    normalCommand: "guw"
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run an insert-return challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "insert-return");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("iHello\u001b0gi, world\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a visual reselect challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "visual-reselect");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("veygvclive\u001bQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a change-history backward challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "change-history-back");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript("/draft\nci\"live\u001bnci\"live\u001bggg;Q");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a single-line ex substitution challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "sub-once");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript(":s/draft/live/\nQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a global ex delete challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "global-prune");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript(":g/^debug/d\nQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run a file-wide ex substitution challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "sub-global");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript(":%s/colour/color/g\nQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});

test("launchLevel can run an ex normal batch challenge against system vim", { skip: !checkVimAvailable() }, () => {
  const level = levels.find((item) => item.id === "norm-batch");
  const sandbox = buildSandbox(level);
  const scriptInputPath = writeKeyScript(":%norm A;\nQ");

  const runResult = launchLevel(level, {
    sandbox,
    scriptInputPath
  });

  assert.equal(runResult.finalBuffer, level.target_state.text);
  assert.deepEqual(runResult.finalCursor, level.target_state.cursor);
  assert.equal(runResult.exitCode, 0);
});
