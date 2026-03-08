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
          <text fg={theme.dim}>沙盒目录: {runResult.sandbox.sandboxDir}</text>
        </>
      }
    >
      <box flexDirection="column" flexGrow={1} gap={1}>
        <box flexDirection={isWide ? "row" : "column"} gap={1} flexShrink={0}>
          <Panel
            title="判定"
            subtitle="是否完成任务和训练要求。"
            accent={accent}
            grow={1}
            height={isWide ? 7 : "auto"}
          >
            <scrollbox flexGrow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={accent}>
                  <strong>{evaluation.objectivePassed ? "任务通过" : "任务未通过"}</strong>
                </text>
                <text fg={theme.text}>训练目标: {evaluation.techniqueMatches ? "达成" : "未达成"}</text>
                <text fg={theme.text}>步数: {evaluation.keylog.scoredMoves} / Par {level.par_moves}</text>
                <text fg={theme.muted}>退出方式: {evaluation.keylog.quitStrategy ?? "未识别"}</text>
              </box>
            </scrollbox>
          </Panel>

          <Panel
            title="定位"
            subtitle="最后停在哪里。"
            accent={theme.warning}
            grow={1}
            height={isWide ? 7 : "auto"}
          >
            <scrollbox flexGrow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>最终光标: {formatCursor(evaluation.actualCursor)}</text>
                <text fg={theme.text}>目标光标: {formatCursor(evaluation.expectedCursor)}</text>
                <text fg={theme.muted}>文本: {evaluation.diagnostics.text}</text>
                <text fg={theme.muted}>技法: {evaluation.diagnostics.technique}</text>
              </box>
            </scrollbox>
          </Panel>

          <Panel
            title="推荐解法"
            subtitle="建议对照自己的 keylog 看偏差。"
            accent={theme.accent}
            grow={1}
            height={isWide ? 7 : "auto"}
          >
            <scrollbox flexGrow={1}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>{formatSequence(level.recommended_solution)}</text>
                {evaluation.firstDiff ? (
                  <text fg={theme.warning}>
                    首个差异: 第 {evaluation.firstDiff.line} 行 | 目标 `{evaluation.firstDiff.expected}` | 实际 `{evaluation.firstDiff.actual}`
                  </text>
                ) : (
                  <text fg={theme.muted}>文本没有首个差异，当前主要看光标或技法。</text>
                )}
              </box>
            </scrollbox>
          </Panel>
        </box>

        <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={1}>
          <Panel title="Diff" subtitle="目标文本 vs 实际结果。" accent={theme.accentSoft} grow={1}>
            <scrollbox flexGrow={1}>
              <box flexDirection="column">
                <text fg={theme.text}>{renderDiff(evaluation.diff)}</text>
              </box>
            </scrollbox>
          </Panel>

          <box flexDirection="column" width={isWide ? 48 : undefined} gap={1}>
            <Panel title="计分按键" subtitle="退出按键已从计分里剥离。" accent={theme.success} grow={1}>
              <scrollbox flexGrow={1}>
                <box flexDirection="column">
                  <text fg={theme.text}>{evaluation.keylog.displayForScore || "(未采集到训练按键)"}</text>
                </box>
              </scrollbox>
            </Panel>

            <Panel title="判题说明" subtitle="失败时先看这里。" accent={theme.warning} grow={1}>
              <scrollbox flexGrow={1}>
                <box flexDirection="column" gap={1}>
                  {evaluation.reasons.length ? (
                    evaluation.reasons.map((reason: string, index: number) => (
                      <text key={`${index}-${reason}`} fg={theme.text}>- {reason}</text>
                    ))
                  ) : (
                    <text fg={theme.success}>这次没有额外判题说明，说明目标状态和技法要求都对齐了。</text>
                  )}
                </box>
              </scrollbox>
            </Panel>
          </box>
        </box>
      </box>
    </AppFrame>
  );
}
