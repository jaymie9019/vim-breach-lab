import { afterEach, expect, test } from "bun:test";
import { testRender } from "@opentui/react/test-utils";
import { act } from "react";

import { LevelDetailScreen } from "../../src/app/screens/LevelDetailScreen";
import { levels } from "../../src/game/levels.js";

let testSetup: Awaited<ReturnType<typeof testRender>> | undefined;

afterEach(() => {
  if (testSetup) {
    act(() => {
      testSetup?.renderer.destroy();
    });
    testSetup = undefined;
  }
});

test("LevelDetailScreen renders as a practice brief", async () => {
  testSetup = await testRender(
    <LevelDetailScreen
      level={levels[0]}
      progress={{ byLevel: {} }}
      hintIndex={0}
      showAnswer={false}
      onAction={() => {}}
    />,
    { width: 140, height: 42 }
  );

  await act(async () => {
    await testSetup?.renderOnce();
  });

  const frame = testSetup.captureCharFrame();
  expect(frame).toContain("先把目标条件讲清楚，再决定要不要看提示。");
  expect(frame).toContain("把它当练习说明，不要当标准答案。");
  expect(frame).toContain("进入 Vim 前先确认这几件事。");
  expect(frame).toContain("这关目前的练习节奏。");
  expect(frame).toContain("按 `Enter` 开始");
});
