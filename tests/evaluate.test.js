import test from "node:test";
import assert from "node:assert/strict";

import { levels } from "../src/game/levels.js";
import { evaluateResult, parseKeylog } from "../src/tui/evaluate.js";

test("parseKeylog strips a trailing ZZ from scoring", () => {
  const parsed = parseKeylog(Buffer.from("6wZZ"));

  assert.equal(parsed.rawCount, 4);
  assert.equal(parsed.scoredMoves, 2);
  assert.equal(parsed.quitStrategy, "ZZ");
});

test("parseKeylog ignores full vim special-key triplets", () => {
  const parsed = parseKeylog(Buffer.from([0x66, 0x74, 0x80, 0xfd, 0x35, 0x51]));

  assert.equal(parsed.display, "f t Q");
  assert.equal(parsed.quitStrategy, "Q");
  assert.equal(parsed.scoredMoves, 2);
});

test("evaluateResult passes exact text and cursor matches", () => {
  const level = levels.find((item) => item.id === "quote-swap");
  const evaluation = evaluateResult(
    level,
    'throw new Error("session revoked");\n',
    { line: 0, col: 31 },
    Buffer.from('ci"session revoked\x1bZZ')
  );

  assert.equal(evaluation.passed, true);
  assert.equal(evaluation.grade, "S");
  assert.equal(evaluation.textMatches, true);
  assert.equal(evaluation.cursorMatches, true);
});

test("evaluateResult fails when cursor is wrong", () => {
  const level = levels.find((item) => item.id === "argument-purge");
  const evaluation = evaluateResult(
    level,
    "const formatter = formatUser;\n",
    { line: 0, col: 12 },
    Buffer.from("dabZZ")
  );

  assert.equal(evaluation.passed, false);
  assert.equal(evaluation.cursorMatches, false);
  assert.match(evaluation.reasons.join("\n"), /光标还没停在目标位置/);
});

test("evaluateResult can require a technique sequence", () => {
  const level = levels.find((item) => item.id === "undo-rescue");
  const evaluation = evaluateResult(
    level,
    'const role = "admin";\n',
    { line: 0, col: 18 },
    Buffer.from('ci"admin\x1bQ')
  );

  assert.equal(evaluation.textMatches, true);
  assert.equal(evaluation.cursorMatches, true);
  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.equal(evaluation.passed, false);
  assert.equal(evaluation.grade, "S");
  assert.match(evaluation.diagnostics.technique, /缺少技法/);
});

test("evaluateResult keeps objective pass when count challenge is solved without count", () => {
  const level = levels.find((item) => item.id === "repeat-x");
  const evaluation = evaluateResult(
    level,
    'const status = "draft";\n',
    { line: 0, col: 21 },
    Buffer.from("xxxQ")
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.equal(evaluation.passed, false);
  assert.match(evaluation.diagnostics.technique, /缺少技法：3x/);
});

test("evaluateResult can require a double-undo sequence", () => {
  const level = levels.find((item) => item.id === "recover-chain");
  const evaluation = evaluateResult(
    level,
    'const role = "admin";\n',
    { line: 0, col: 18 },
    Buffer.from('xuci"admin\x1bQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /缺少技法：uu/);
});

test("evaluateResult can require named register sequences", () => {
  const level = levels.find((item) => item.id === "named-register-store");
  const evaluation = evaluateResult(
    level,
    "const alpha = 1;\nconst beta = 2;\nconst alpha = 1;\nconst omega = 3;\n",
    { line: 2, col: 0 },
    Buffer.from('"ayyjpQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /缺少技法："ap/);
});

test("evaluateResult can require mark placement and exact return sequences", () => {
  const level = levels.find((item) => item.id === "mark-anchor-return");
  const evaluation = evaluateResult(
    level,
    'const config = {\n  timeout: 3000,\n  retries: 2\n};\n\nfunction boot() {\n  const mode = "live";\n  return mode;\n}\n\nconst status = boot();\n',
    { line: 1, col: 2 },
    Buffer.from('/draft\nci"live\x1bQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /ma/);
  assert.match(evaluation.diagnostics.technique, /`a/);
});

test("evaluateResult can require jump-list return sequences", () => {
  const level = levels.find((item) => item.id === "last-change-bounce");
  const evaluation = evaluateResult(
    level,
    'const config = buildConfig();\nconst retries = 2;\n\nfunction boot() {\n  const mode = "live";\n  return mode;\n}\n\nconst status = boot();\n',
    { line: 4, col: 2 },
    Buffer.from('/draft\nci"live\x1bggQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /'\./);
});

test("evaluateResult can require case-transform sequences", () => {
  const level = levels.find((item) => item.id === "uppercase-normalize");
  const evaluation = evaluateResult(
    level,
    "const flag = READY;\n",
    { line: 0, col: 13 },
    Buffer.from("cwREADY\x1bQ")
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /gUw/);
});

test("evaluateResult can require ex substitution sequences", () => {
  const level = levels.find((item) => item.id === "sub-global");
  const evaluation = evaluateResult(
    level,
    'const primary = "color";\nconst secondary = "color";\nconst accent = "color";\n',
    { line: 2, col: 0 },
    Buffer.from(':%s/colour/color/g\nQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, true);
});

test("evaluateResult can require insert-return sequences", () => {
  const level = levels.find((item) => item.id === "insert-return");
  const evaluation = evaluateResult(
    level,
    'const label = "Hello, world";\n',
    { line: 0, col: 26 },
    Buffer.from("iHello\x1b0A, world\x1bQ")
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /gi/);
});

test("evaluateResult can require recent-change jump sequences", () => {
  const level = levels.find((item) => item.id === "change-history-back");
  const evaluation = evaluateResult(
    level,
    'const primary = "live";\nconst secondary = "live";\n',
    { line: 1, col: 19 },
    Buffer.from('/draft\nci"live\x1bnci"live\x1bQ')
  );

  assert.equal(evaluation.objectivePassed, true);
  assert.equal(evaluation.techniqueMatches, false);
  assert.match(evaluation.diagnostics.technique, /g;/);
});
