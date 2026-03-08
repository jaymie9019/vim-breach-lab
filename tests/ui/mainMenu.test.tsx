import { afterEach, expect, test } from "bun:test";
import { testRender } from "@opentui/react/test-utils";
import { act } from "react";

import { MainMenuScreen } from "../../src/app/screens/MainMenuScreen";

let testSetup: Awaited<ReturnType<typeof testRender>> | undefined;

afterEach(() => {
  if (testSetup) {
    act(() => {
      testSetup?.renderer.destroy();
    });
    testSetup = undefined;
  }
});

test("MainMenuScreen renders the selected level details and navigation chrome", async () => {
  testSetup = await testRender(
    <MainMenuScreen progress={{ byLevel: {} }} initialLevelIndex={0} onAction={() => {}} />,
    { width: 140, height: 42 }
  );

  await act(async () => {
    await testSetup?.renderOnce();
  });
  const frame = testSetup.captureCharFrame();

  expect(frame).toContain("单词冲刺");
  expect(frame).toContain("显示 1-8 / 52");
  expect(frame).toContain("精准跳转 · 重点 f, w");
  expect(frame).toContain("战绩面板");
  expect(frame).toContain("`j/k` 移动");
});

test("MainMenuScreen can navigate to the final levels with repeated j presses", async () => {
  testSetup = await testRender(
    <MainMenuScreen progress={{ byLevel: {} }} initialLevelIndex={0} onAction={() => {}} />,
    { width: 140, height: 40 }
  );

  await act(async () => {
    await testSetup?.renderOnce();
  });

  for (let index = 0; index < 51; index += 1) {
    await act(async () => {
      testSetup?.renderer.stdin.emit("data", Buffer.from("j"));
      await testSetup?.renderOnce();
    });
  }

  const frame = testSetup.captureCharFrame();
  expect(frame).toContain("贴到前面");
  expect(frame).toContain("显示 45-52 / 52");
});
