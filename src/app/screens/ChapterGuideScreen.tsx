import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { orderedChapters } from "../../game/chapters.js";
import { theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

function chapterBadge(chapter: string) {
  const chapterIndex = orderedChapters.indexOf(chapter);
  return `第 ${chapterIndex + 1} 章 / 共 ${orderedChapters.length} 章`;
}

export function ChapterGuideScreen({
  chapter,
  doc,
  mode,
  onAction
}: {
  chapter: string;
  doc: any;
  mode: "intro" | "outro";
  onAction: (action: any) => void;
}) {
  const { width } = useTerminalDimensions();
  const isWide = width >= 120;
  const chapterIndex = orderedChapters.indexOf(chapter);
  const sectionLabel = mode === "intro" ? "章节前导" : "章节总结";
  const points = mode === "intro" ? doc.concepts : doc.takeaways;
  const pointsTitle = mode === "intro" ? "这一章先抓住这 3 件事" : "这一章带走这些判断";
  const accent = mode === "intro" ? theme.accent : theme.success;
  const summaryTitle = mode === "intro" ? "这一章在练什么" : "这一章你已经会什么";
  const actionLine = mode === "intro" ? "读完就进关，用这些句子指导动作。" : "带着这些句子进入下一章。";

  useKeyboard((key) => {
    if (key.name === "enter" || key.name === "return" || key.name === "space") {
      onAction({ type: "continue" });
      return;
    }

    if (key.name === "b" || key.name === "escape") {
      onAction({ type: "back" });
    }
  });

  return (
    <AppFrame
      title={`${chapter} · ${sectionLabel}`}
      subtitle={mode === "intro" ? "先建立这一章的心智模型，再开始练。" : "先把这一章总结成几句带得走的话。"}
      progressLabel={chapterBadge(chapter)}
      footer={
        <>
          <text fg={theme.muted}>`Enter` 继续  `b` 返回</text>
          <text fg={theme.dim}>{mode === "intro" ? "先把判断建立起来，再进关。" : "先把这章说清楚，再继续往前。"}</text>
        </>
      }
    >
      <box flexDirection="column" flexGrow={1} gap={1}>
        <Panel title={doc.title} subtitle={actionLine} accent={accent} grow={0}>
          <box flexDirection={isWide ? "row" : "column"} justifyContent="space-between" gap={2}>
            <box flexDirection="column" flexGrow={1} gap={1}>
              <text fg={theme.text}>{doc.summary}</text>
              {doc.scenario ? <text fg={theme.warning}>典型场景: {doc.scenario}</text> : null}
            </box>
            <box flexDirection="column" width={isWide ? 34 : undefined} gap={1}>
              <text fg={theme.accent}>{chapterBadge(chapter)}</text>
              <text fg={theme.muted}>{mode === "intro" ? "推荐读法：标题 → 句子 → 例子" : "推荐读法：先回顾，再带走判断"}</text>
            </box>
          </box>
        </Panel>

        <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={2}>
          <Panel
            title={summaryTitle}
            subtitle={mode === "intro" ? "把它当作本章的练习说明，不是帮助文档。" : "把它当作你已经建立的编辑直觉。"}
            accent={accent}
            grow={1}
            framed={false}
          >
            <scrollbox flexGrow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>{doc.summary}</text>
                {mode === "intro" && doc.example?.length ? (
                  <>
                    <text fg={theme.accent}>最小例子</text>
                    {doc.example.map((entry: string, index: number) => (
                      <text key={`example-${index}`} fg={theme.text}>{index + 1}. {entry}</text>
                    ))}
                  </>
                ) : null}
                <text fg={theme.dim}>{mode === "intro" ? "不要急着记按键，先记住什么时候该想到它。" : "如果你能复述这些句子，说明这章已经进手了。"}</text>
              </box>
            </scrollbox>
          </Panel>

          <Panel title={pointsTitle} subtitle="别背术语，先把这些话变成判断。" accent={theme.warning} grow={1}>
            <scrollbox flexGrow={1}>
              <box flexDirection="column" gap={1}>
                {points.map((point: string, index: number) => (
                  <box key={`${mode}-${index}`} flexDirection="column" gap={0}>
                    <text fg={theme.text}>{index + 1}. {point}</text>
                    {index < points.length - 1 ? <text fg={theme.dim}> </text> : null}
                  </box>
                ))}
              </box>
            </scrollbox>
          </Panel>
        </box>

        <Panel
          title={mode === "intro" ? "读完后做什么" : "准备进入下一章"}
          subtitle={mode === "intro" ? "让讲义直接影响你下一次按键。" : "把总结接到新的训练内容里。"}
          accent={theme.accentSoft}
          framed={false}
          grow={0}
        >
          <box flexDirection={isWide ? "row" : "column"} gap={2}>
            <text fg={theme.text}>{mode === "intro" ? "进关后先找锚点、结构或对象，再决定动作；不要一上来就手挪。" : "下一章里继续保持：先判断问题类型，再选最短动作路线。"}</text>
            <text fg={theme.accent}>{mode === "intro" ? "按 `Enter` 开练。" : "按 `Enter` 继续往前。"}</text>
          </box>
        </Panel>
      </box>
    </AppFrame>
  );
}
