import { useState } from "react";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { levels } from "../../game/levels.js";
import { levelStats, progressLocation } from "../../tui/progressStore.js";
import { clampLevelIndex, findNextLevelIndex } from "../navigation.js";
import { formatCursor, formatSequence } from "../formatters.js";
import { codeStyle, theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

export function MainMenuScreen({
  progress,
  initialLevelIndex,
  onAction
}: {
  progress: any;
  initialLevelIndex: number;
  onAction: (action: any) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(clampLevelIndex(initialLevelIndex));
  const { width, height } = useTerminalDimensions();
  const selectedLevel = levels[selectedIndex];
  const selectedStats = levelStats(progress, selectedLevel.id);
  const nextLevelIndex = findNextLevelIndex(progress);
  const completedCount = levels.filter((level) => levelStats(progress, level.id).completions > 0).length;
  const isWide = width >= 120;
  const listRowHeight = 3;
  const reservedRows = isWide ? 16 : 22;
  const visibleCount = Math.max(6, Math.floor(Math.max(12, height - reservedRows) / listRowHeight));
  const maxStart = Math.max(0, levels.length - visibleCount);
  const scrollStart = Math.min(maxStart, Math.max(0, selectedIndex - Math.floor(visibleCount / 2)));
  const scrollEnd = Math.min(levels.length, scrollStart + visibleCount);
  const visibleLevels = levels.slice(scrollStart, scrollEnd);

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setSelectedIndex((current) => clampLevelIndex(current - 1));
      return;
    }

    if (key.name === "down" || key.name === "j") {
      setSelectedIndex((current) => clampLevelIndex(current + 1));
      return;
    }

    if (key.name === "enter" || key.name === "return") {
      onAction({ type: "inspect", levelIndex: selectedIndex });
      return;
    }

    if (key.name === "n") {
      onAction({ type: "play-next", levelIndex: nextLevelIndex });
      return;
    }

    if (key.name === "q" || key.name === "escape") {
      onAction({ type: "quit" });
    }
  });

  return (
    <AppFrame
      title="Vim Breach Lab"
      subtitle="真实 Vim 训练营，带进度、诊断和热键导航的新主界面。"
      progressLabel={`${completedCount}/${levels.length} 已通关`}
      footer={
        <>
          <text fg={theme.muted}>`j/k` 移动  `Enter` 查看关卡  `n` 直奔下一关  `q` 退出</text>
          <text fg={theme.dim}>进度文件: {progressLocation()}</text>
        </>
      }
    >
      <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={1}>
        <Panel
          title="课程地图"
          subtitle={`显示 ${scrollStart + 1}-${scrollEnd} / ${levels.length}`}
          grow={isWide ? 0 : 1}
          width={isWide ? 48 : undefined}
          accent={theme.accent}
        >
          <box flexDirection="row" flexGrow={1} gap={1}>
            <box flexDirection="column" flexGrow={1} gap={1}>
              {visibleLevels.map((level, offset) => {
                const index = scrollStart + offset;
                const stats = levelStats(progress, level.id);
                const selected = index === selectedIndex;
                const completed = stats.completions > 0;

                return (
                  <box
                    key={level.id}
                    flexDirection="column"
                    backgroundColor={selected ? theme.selection : "transparent"}
                    minHeight={2}
                    paddingX={1}
                    overflow="hidden"
                  >
                    <text fg={selected ? theme.accent : theme.text}>
                      <strong>{selected ? "› " : "  "}{index + 1}. {level.title}</strong>
                    </text>
                    <text fg={completed ? theme.success : theme.dim}>
                      {completed ? "已通关" : "未通关"} · {level.chapter} · 最佳 {stats.bestMoves ?? "--"} 步
                    </text>
                  </box>
                );
              })}
            </box>

            <box width={1} flexDirection="column" justifyContent="flex-start">
              {Array.from({ length: Math.max(visibleCount, 1) }, (_, row) => {
                const thumbSize = Math.max(1, Math.round((visibleCount / levels.length) * visibleCount));
                const thumbOffset = maxStart === 0 ? 0 : Math.round((scrollStart / maxStart) * Math.max(0, visibleCount - thumbSize));
                const active = row >= thumbOffset && row < thumbOffset + thumbSize;

                return (
                  <text key={`scroll-${row}`} fg={active ? theme.text : theme.dim}>
                    {active ? "█" : "│"}
                  </text>
                );
              })}
            </box>
          </box>
        </Panel>

        <box flexDirection="column" flexGrow={1} gap={1}>
          <Panel
            title={selectedLevel.title}
            subtitle={`${selectedLevel.chapter} · 重点 ${selectedLevel.concept_tags.join(", ")}`}
            grow={0}
            accent={theme.warning}
          >
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>{selectedLevel.goal_description}</text>
              <text fg={theme.muted}>起始光标: {formatCursor(selectedLevel.cursor_start)}</text>
              <text fg={theme.muted}>目标光标: {formatCursor(selectedLevel.target_state.cursor)}</text>
              <text fg={theme.muted}>Par: {selectedLevel.par_moves} · 推荐解法: {formatSequence(selectedLevel.recommended_solution)}</text>
              {selectedLevel.required_sequences?.length ? (
                <text fg={theme.warning}>要求技法: {selectedLevel.required_sequences.map(formatSequence).join(" / ")}</text>
              ) : null}
            </box>
          </Panel>

          <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={1}>
            <Panel title="代码预览" subtitle="直接在这里预判目标位置。" grow={1} accent={theme.accentSoft}>
              <line-number width="100%" height="100%" showLineNumbers>
                <code
                  content={selectedLevel.snippet}
                  filetype="javascript"
                  syntaxStyle={codeStyle}
                  width="100%"
                  height="100%"
                />
              </line-number>
            </Panel>

            <Panel title="战绩面板" subtitle="这关你已经打成什么样。" grow={1} accent={theme.success}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>通关 {selectedStats.completions} 次 / 尝试 {selectedStats.attempts} 次</text>
                <text fg={theme.text}>最佳步数: {selectedStats.bestMoves ?? "--"}</text>
                <text fg={theme.muted}>首条提示: {selectedLevel.hints[0]}</text>
                {selectedLevel.guided_tip ? <text fg={theme.warning}>教练提示: {selectedLevel.guided_tip}</text> : null}
              </box>
            </Panel>
          </box>
        </box>
      </box>
    </AppFrame>
  );
}
