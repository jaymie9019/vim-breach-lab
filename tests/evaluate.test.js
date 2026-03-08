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
