import { afterEach, expect, test } from "bun:test";
import { testRender } from "@opentui/react/test-utils";
import { act } from "react";

import { ChapterGuideScreen } from "../../src/app/screens/ChapterGuideScreen";
import { chapterDocs } from "../../src/game/chapters.js";

let testSetup: Awaited<ReturnType<typeof testRender>> | undefined;

afterEach(() => {
  if (testSetup) {
    act(() => {
      testSetup?.renderer.destroy();
    });
    testSetup = undefined;
  }
});

test("ChapterGuideScreen renders intro as a study handout", async () => {
  testSetup = await testRender(
    <ChapterGuideScreen chapter="精准跳转" doc={chapterDocs["精准跳转"].intro} mode="intro" onAction={() => {}} />,
    { width: 140, height: 40 }
  );

  await act(async () => {
    await testSetup?.renderOnce();
  });

  const frame = testSetup.captureCharFrame();
  expect(frame).toContain("读完就进关，用这些句子指导动作。");
  expect(frame).toContain("这一章训练你用可见锚点快速落位");
  expect(frame).toContain("1. `f<char>` 直接跳到本行后面的某个字符上。");
  expect(frame).toContain("最小例子");
  expect(frame).toContain("`Enter` 继续  `b` 返回");
});
