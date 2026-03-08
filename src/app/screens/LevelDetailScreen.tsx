import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { levelStats } from "../../tui/progressStore.js";
import { formatCursor, formatRequiredSequences, formatSequence } from "../formatters.js";
import { codeStyle, theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

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

    if (key.name === "b" || key.name === "escape") {
      onAction({ type: "back" });
    }
  });

  return (
    <AppFrame
      title={`${level.title} · ${level.chapter}`}
      subtitle="开始前，把目标、结构和推荐动作都看清楚。"
      progressLabel={`Par ${level.par_moves}`}
      footer={
        <>
          <text fg={theme.muted}>`Enter` 开始  `h` 下一条提示  `a` 显示答案  `b` 返回列表</text>
          <text fg={theme.dim}>提示已查看 {hintIndex + 1}/{level.hints.length} 条</text>
        </>
      }
    >
      <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={1}>
        <Panel title="训练缓冲区" subtitle="先在脑子里跑一遍，再进真实 Vim。" grow={1} accent={theme.accentSoft}>
          <line-number width="100%" height="100%" showLineNumbers>
            <code content={level.snippet} filetype="javascript" syntaxStyle={codeStyle} width="100%" height="100%" />
          </line-number>
        </Panel>

        <box flexDirection="column" flexGrow={1} gap={1} width={isWide ? 50 : undefined}>
          <Panel title="目标" subtitle="任务判断只看最终文本和最终光标。" accent={theme.warning}>
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>{level.goal_description}</text>
              <text fg={theme.muted}>重点: {level.concept_tags.join(", ")}</text>
              <text fg={theme.muted}>起始光标: {formatCursor(level.cursor_start)}</text>
              <text fg={theme.muted}>目标光标: {formatCursor(level.target_state.cursor)}</text>
              {level.required_sequences?.length ? (
                <text fg={theme.warning}>要求技法: {formatRequiredSequences(level.required_sequences)}</text>
              ) : null}
            </box>
          </Panel>

          <Panel title="战绩" subtitle="这关的训练历史。" accent={theme.success}>
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>通关 {stats.completions} 次 / 尝试 {stats.attempts} 次</text>
              <text fg={theme.text}>最佳成绩: {stats.bestMoves ?? "--"} 步</text>
              <text fg={theme.muted}>提示查看次数: {stats.hintViews}</text>
            </box>
          </Panel>

          <Panel title="教练台词" subtitle="不要把答案当文档，先用它校准思路。" accent={theme.accent}>
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>{hint}</text>
              {level.guided_tip ? <text fg={theme.warning}>补充: {level.guided_tip}</text> : null}
              {showAnswer ? (
                <text fg={theme.success}>推荐解法: {formatSequence(level.recommended_solution)}</text>
              ) : (
                <text fg={theme.dim}>按 `a` 后才会显示推荐解法。</text>
              )}
            </box>
          </Panel>
        </box>
      </box>
    </AppFrame>
  );
}
