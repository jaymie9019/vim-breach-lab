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
  expect(frame).toContain("17 章 / 66 关");
  expect(frame).toContain("第 1 章 · 精准跳转");
  expect(frame).toContain("精准跳转 · 重点 f, w");
  expect(frame).toContain("讲义主题: 看见锚点，不要手挪");
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

  for (let index = 0; index < 65; index += 1) {
    await act(async () => {
      testSetup?.renderer.stdin.emit("data", Buffer.from("j"));
      await testSetup?.renderOnce();
    });
  }

  const frame = testSetup.captureCharFrame();
  expect(frame).toContain("只清日志行");
  expect(frame).toContain("第 17 章 · Ex 命令");
  expect(frame).toContain("显示 54-66");
});
