import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { formatCursor, formatSequence } from "../formatters.js";
import { theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

function renderDiff(diff: Array<{ type: string; text: string }>) {
  return diff
    .map((entry) => {
      const prefix = entry.type === "add" ? "+" : entry.type === "remove" ? "-" : " ";
      return `${prefix} ${entry.text}`;
    })
    .join("\n");
}

function resultColor(evaluation: any) {
  if (evaluation.passed) {
    return theme.success;
  }
  if (evaluation.objectivePassed) {
    return theme.warning;
  }
  return theme.danger;
}

function coachSummary(evaluation: any) {
  if (evaluation.passed) {
    return "这次过关了，目标和手法都对上了。";
  }

  if (evaluation.objectivePassed) {
    return "结果做对了，但这次要练的手法还没做到。";
  }

  if (evaluation.firstDiff) {
    return `这次没过，最先出问题的是第 ${evaluation.firstDiff.line} 行。`;
  }

  if (evaluation.diagnostics.cursor) {
    return "这次没过，主要问题是最终光标没有停在目标位置。";
  }

  return "这次没过，先从第一条判题说明开始修正。";
}

function coachNextStep(level: any, evaluation: any) {
  if (evaluation.passed) {
    return "可以直接进下一关，继续保持动作短、稳、能复现。";
  }

  if (!evaluation.techniqueMatches && level.required_sequences?.length) {
    return `重试时先刻意打出要求技法：${level.required_sequences.map(formatSequence).join(" / ")}。`;
  }

  if (evaluation.firstDiff) {
    return `先盯住第 ${evaluation.firstDiff.line} 行，把文本修对，再检查光标落点。`;
  }

  return "重试时先只盯目标文本和最终光标，不要一次修所有问题。";
}

export function ResultScreen({
  level,
  evaluation,
  runResult,
  hasNextLevel,
  onAction
}: {
  level: any;
  evaluation: any;
  runResult: any;
  hasNextLevel: boolean;
  onAction: (action: any) => void;
}) {
  const { width } = useTerminalDimensions();
  const isWide = width >= 128;
  const accent = resultColor(evaluation);

  useKeyboard((key) => {
    if (key.name === "r") {
      onAction({ type: "retry" });
      return;
    }

    if (key.name === "n" && hasNextLevel) {
      onAction({ type: "next" });
      return;
    }

    if (key.name === "b" || key.name === "enter" || key.name === "return" || key.name === "escape") {
      onAction({ type: "back" });
    }
  });

  return (
    <AppFrame
      title={`${level.title} · 结算`}
      subtitle="先看任务达成，再看技法，再看步数。"
      progressLabel={`评级 ${evaluation.grade}`}
      footer={
        <>
          <text fg={theme.muted}>`r` 重试  `{hasNextLevel ? "n" : "-"}` 下一关  `b` 返回列表</text>
          <text fg={theme.dim}>先改最先出错的地方，再谈步数和手法。</text>
        </>
      }
    >
      <box flexDirection="column" flexGrow={1} gap={1}>
        <Panel
          title={evaluation.passed ? "教练结论" : "先改这里"}
          subtitle={coachSummary(evaluation)}
          accent={accent}
          grow={0}
        >
          <box flexDirection={isWide ? "row" : "column"} justifyContent="space-between" gap={1}>
            <box flexDirection="column" flexGrow={1} gap={1}>
              <text fg={accent}>
                <strong>{evaluation.passed ? "训练通过" : "继续修正"}</strong>
              </text>
              <text fg={theme.text}>{coachSummary(evaluation)}</text>
              <text fg={theme.muted}>{coachNextStep(level, evaluation)}</text>
            </box>
            <box flexDirection="column" width={isWide ? 28 : undefined} gap={1}>
              <text fg={theme.text}>步数 {evaluation.keylog.scoredMoves} / Par {level.par_moves}</text>
              <text fg={theme.text}>训练目标 {evaluation.techniqueMatches ? "达成" : "未达成"}</text>
              <text fg={theme.muted}>退出方式: {evaluation.keylog.quitStrategy ?? "未识别"}</text>
            </box>
          </box>
        </Panel>

        <box flexDirection={isWide ? "row" : "column"} gap={2} flexGrow={1}>
          <Panel title="哪里出错了" subtitle="先只看最关键的偏差。" accent={theme.warning} grow={1}>
            <box flexDirection="column" gap={1}>
              {evaluation.firstDiff ? (
                <text fg={theme.warning}>
                  首个差异: 第 {evaluation.firstDiff.line} 行 | 目标 `{evaluation.firstDiff.expected}` | 实际 `{evaluation.firstDiff.actual}`
                </text>
              ) : (
                <text fg={theme.muted}>文本没有首个差异，当前优先检查光标或技法要求。</text>
              )}
              <text fg={theme.text}>最终光标: {formatCursor(evaluation.actualCursor)}</text>
              <text fg={theme.text}>目标光标: {formatCursor(evaluation.expectedCursor)}</text>
              <text fg={theme.muted}>文本判定: {evaluation.diagnostics.text}</text>
              <text fg={theme.muted}>技法判定: {evaluation.diagnostics.technique}</text>
              <scrollbox flexGrow={1}>
                <box flexDirection="column">
                  <text fg={theme.text}>{renderDiff(evaluation.diff)}</text>
                </box>
              </scrollbox>
            </box>
          </Panel>

          <box flexDirection="column" width={isWide ? 46 : undefined} gap={1}>
            <Panel title="推荐怎么改" subtitle="先按这个顺序复盘。" accent={theme.accent} grow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>推荐解法: {formatSequence(level.recommended_solution)}</text>
                {evaluation.reasons.length ? (
                  evaluation.reasons.map((reason: string, index: number) => (
                    <text key={`${index}-${reason}`} fg={theme.text}>{index + 1}. {reason}</text>
                  ))
                ) : (
                  <text fg={theme.success}>这次没有额外判题问题，继续保持这个节奏。</text>
                )}
              </box>
            </Panel>

            <Panel title="按键记录" subtitle="退出按键已从计分里剥离。" accent={theme.success} grow={1} framed={false}>
              <scrollbox flexGrow={1}>
                <box flexDirection="column" gap={1}>
                  <text fg={theme.text}>{evaluation.keylog.displayForScore || "(未采集到训练按键)"}</text>
                  <text fg={theme.dim}>沙盒目录: {runResult.sandbox.sandboxDir}</text>
                </box>
              </scrollbox>
            </Panel>
          </box>
        </box>
      </box>
    </AppFrame>
  );
}
