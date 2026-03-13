import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { chapterStats } from "../../tui/progressStore.js";
import { getChapterDoc } from "../../game/chapters.js";
import { levelStats } from "../../tui/progressStore.js";
import { formatCursor, formatRequiredSequences, formatSequence } from "../formatters.js";
import { codeStyle, theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

function practiceBadge(level: any) {
  return `Par ${level.par_moves} · ${level.concept_tags.join(" / ")}`;
}

export function LevelDetailScreen({
  level,
  progress,
  hintIndex,
  showAnswer,
  onAction
}: {
  level: any;
  progress: any;
  hintIndex: number;
  showAnswer: boolean;
  onAction: (action: any) => void;
}) {
  const { width } = useTerminalDimensions();
  const stats = levelStats(progress, level.id);
  const chapterProgress = chapterStats(progress, level.chapter);
  const chapterDoc = getChapterDoc(level.chapter);
  const isWide = width >= 120;
  const hint = level.hints[Math.min(hintIndex, level.hints.length - 1)];

  useKeyboard((key) => {
    if (key.name === "enter" || key.name === "return") {
      onAction({ type: "start" });
      return;
    }

    if (key.name === "h") {
      onAction({ type: "hint" });
      return;
    }

    if (key.name === "a") {
      onAction({ type: "answer" });
      return;
    }

    if (key.name === "c") {
      onAction({ type: "chapter-guide", chapter: level.chapter });
      return;
    }

    if (key.name === "b" || key.name === "escape") {
      onAction({ type: "back" });
    }
  });

  return (
    <AppFrame
      title={`${level.title} · ${level.chapter}`}
      subtitle="先读任务，再看例子，最后再进真实 Vim。"
      progressLabel={practiceBadge(level)}
      footer={
        <>
          <text fg={theme.muted}>`Enter` 开始  `h` 下一条提示  `a` 显示答案  `c` 本章讲义  `b` 返回列表</text>
          <text fg={theme.dim}>提示已看 {hintIndex + 1}/{level.hints.length} 条；先做对，再做漂亮。</text>
        </>
      }
    >
      <box flexDirection="column" flexGrow={1} gap={1}>
        <Panel
          title="这关怎么练"
          subtitle="先把目标条件讲清楚，再决定要不要看提示。"
          accent={theme.warning}
          grow={0}
        >
          <box flexDirection={isWide ? "row" : "column"} justifyContent="space-between" gap={2}>
            <box flexDirection="column" flexGrow={1} gap={1}>
              <text fg={theme.text}>{level.goal_description}</text>
              <text fg={theme.muted}>起始光标: {formatCursor(level.cursor_start)}</text>
              <text fg={theme.muted}>目标光标: {formatCursor(level.target_state.cursor)}</text>
              {level.required_sequences?.length ? (
                <text fg={theme.warning}>要求技法: {formatRequiredSequences(level.required_sequences)}</text>
              ) : (
                <text fg={theme.dim}>这关只看目标文本和最终光标，不额外要求技法。</text>
              )}
            </box>
            <box flexDirection="column" width={isWide ? 38 : undefined} gap={1}>
              <text fg={theme.accent}>{practiceBadge(level)}</text>
              {chapterDoc ? <text fg={theme.muted}>本章主题: {chapterDoc.intro.title}</text> : null}
              <text fg={chapterProgress.introSeen ? theme.muted : theme.warning}>
                本章讲义: `c` 打开{chapterProgress.introSeen ? "（已读）" : "（建议先看）"}
              </text>
            </box>
          </box>
        </Panel>

        <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={2}>
          <Panel title="训练缓冲区" subtitle="先在脑中跑一遍落点，再进入真实 Vim。" grow={1} accent={theme.accentSoft}>
            <line-number width="100%" height="100%" showLineNumbers>
              <code content={level.snippet} filetype="javascript" syntaxStyle={codeStyle} width="100%" height="100%" />
            </line-number>
          </Panel>

          <box flexDirection="column" flexGrow={1} gap={1} width={isWide ? 52 : undefined}>
            <Panel title="教练提示" subtitle="把它当练习说明，不要当标准答案。" accent={theme.accent} framed={false} grow={0}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>{hint}</text>
                {level.guided_tip ? <text fg={theme.warning}>补充判断: {level.guided_tip}</text> : null}
                {showAnswer ? (
                  <text fg={theme.success}>推荐解法: {formatSequence(level.recommended_solution)}</text>
                ) : (
                  <text fg={theme.dim}>按 `a` 才显示推荐解法；先自己想一遍更有用。</text>
                )}
              </box>
            </Panel>

            <Panel title="开始前检查" subtitle="进入 Vim 前先确认这几件事。" accent={theme.success} grow={0} framed={false}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>1. 我知道最终要改成什么样。</text>
                <text fg={theme.text}>2. 我知道光标最终要停在哪。</text>
                <text fg={theme.text}>3. 我准备先用最短路线完成，再考虑更漂亮的手法。</text>
              </box>
            </Panel>

            <Panel title="训练记录" subtitle="这关目前的练习节奏。" accent={theme.success} framed={false} grow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>通关 {stats.completions} 次 / 尝试 {stats.attempts} 次</text>
                <text fg={theme.text}>最佳成绩: {stats.bestMoves ?? "--"} 步</text>
                <text fg={theme.muted}>提示查看次数: {stats.hintViews}</text>
                <text fg={theme.accent}>按 `Enter` 开始，把这页当作进关前最后检查。</text>
              </box>
            </Panel>
          </box>
        </box>
      </box>
    </AppFrame>
  );
}
