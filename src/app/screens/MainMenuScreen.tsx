import { useState } from "react";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";

import { chapterStats } from "../../tui/progressStore.js";
import { getChapterDoc, getChapterLevels, orderedChapters } from "../../game/chapters.js";
import { levels } from "../../game/levels.js";
import { levelStats, progressLocation } from "../../tui/progressStore.js";
import { clampLevelIndex, findNextLevelIndex } from "../navigation.js";
import { formatCursor, formatSequence } from "../formatters.js";
import { codeStyle, theme } from "../theme";
import { AppFrame } from "../components/AppFrame";
import { Panel } from "../components/Panel";

function chapterHeaderLabel(chapter: string) {
  const chapterIndex = orderedChapters.indexOf(chapter);
  return `第 ${chapterIndex + 1} 章 · ${chapter}`;
}

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
  const selectedChapterStats = chapterStats(progress, selectedLevel.chapter);
  const selectedChapterDoc = getChapterDoc(selectedLevel.chapter);
  const selectedChapterLevels = getChapterLevels(selectedLevel.chapter);
  const selectedChapterIndex = orderedChapters.indexOf(selectedLevel.chapter);
  const selectedChapterCompletedCount = selectedChapterLevels.filter((level) => levelStats(progress, level.id).completions > 0).length;
  const firstChapterLevelIndex = levels.findIndex((level) => level.chapter === selectedLevel.chapter);
  const lastChapterLevelIndex = firstChapterLevelIndex + selectedChapterLevels.length - 1;
  const selectedChapterLevelOffset = selectedIndex - firstChapterLevelIndex + 1;
  const nextLevelIndex = findNextLevelIndex(progress);
  const nextLevel = levels[nextLevelIndex];
  const completedCount = levels.filter((level) => levelStats(progress, level.id).completions > 0).length;
  const isWide = width >= 120;
  const mapTitleWidth = isWide ? 20 : 16;
  const listRowHeight = 1;
  const reservedRows = isWide ? 18 : 24;
  const mapChromeRows = 6;
  const visibleRowCount = Math.max(10, Math.floor(Math.max(16, height - reservedRows) / listRowHeight) - mapChromeRows);
  const allMapRows: Array<
    | { type: "chapter"; chapter: string }
    | { type: "level"; level: (typeof levels)[number]; index: number; completed: boolean; selected: boolean; stats: ReturnType<typeof levelStats> }
  > = [];

  levels.forEach((level, index) => {
    const stats = levelStats(progress, level.id);
    const selected = index === selectedIndex;
    const completed = stats.completions > 0;
    const previousLevel = levels[index - 1];

    if (!previousLevel || previousLevel.chapter !== level.chapter) {
      allMapRows.push({ type: "chapter", chapter: level.chapter });
    }

    allMapRows.push({ type: "level", level, index, completed, selected, stats });
  });

  const selectedRowIndex = allMapRows.findIndex((row) => row.type === "level" && row.selected);
  const maxRowStart = Math.max(0, allMapRows.length - visibleRowCount);
  const rowStart = Math.min(maxRowStart, Math.max(0, selectedRowIndex - Math.floor(visibleRowCount / 2)));
  const rowEnd = Math.min(allMapRows.length, rowStart + visibleRowCount);
  const mapRows = allMapRows.slice(rowStart, rowEnd);
  const visibleLevelRows = mapRows.filter((row): row is Extract<(typeof mapRows)[number], { type: "level" }> => row.type === "level");
  const firstVisibleLevelIndex = visibleLevelRows[0]?.index ?? 0;
  const lastVisibleLevelIndex = visibleLevelRows[visibleLevelRows.length - 1]?.index ?? firstVisibleLevelIndex;

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

    if (key.name === "c") {
      onAction({ type: "chapter-guide", levelIndex: selectedIndex, chapter: selectedLevel.chapter });
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
      subtitle="用真实 Vim 练动作、练判断、练复盘。"
      progressLabel={`${completedCount}/${levels.length} 已通关`}
      footer={
        <>
          <text fg={theme.muted}>`j/k` 移动  `Enter` 查看关卡  `c` 本章讲义  `n` 直奔下一关  `q` 退出</text>
          <text fg={theme.dim}>先看自己学到哪，再决定下一关；进度文件: {progressLocation()}</text>
        </>
      }
    >
      <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={1}>
        <Panel
          title="课程地图"
          subtitle={`17 章 / ${levels.length} 关 · 显示 ${firstVisibleLevelIndex + 1}-${lastVisibleLevelIndex + 1}`}
          grow={isWide ? 0 : 1}
          width={isWide ? 50 : undefined}
          accent={theme.accent}
        >
          <box flexDirection="column" flexGrow={1} gap={1}>
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>
                <strong>{chapterHeaderLabel(selectedLevel.chapter)}</strong> · 已通 {selectedChapterCompletedCount}/{selectedChapterLevels.length}
              </text>
              <text fg={theme.muted}>
                当前第 {selectedChapterLevelOffset} 关 / 下一关：{nextLevel.title}
              </text>
            </box>

            <box flexDirection="row" flexGrow={1} gap={1}>
              <box flexDirection="column" flexGrow={1}>
                {mapRows.map((row, rowIndex) => {
                  if (row.type === "chapter") {
                    return (
                      <box
                        key={`chapter-${row.chapter}-${rowIndex}`}
                        paddingTop={rowIndex === 0 ? 0 : 1}
                        height={1}
                        overflow="hidden"
                      >
                        <text fg={theme.accent}>
                          <strong>{chapterHeaderLabel(row.chapter)}</strong>
                        </text>
                      </box>
                    );
                  }

                  const status = row.completed ? `${row.stats.bestMoves ?? "--"} 步` : "未通";
                  const prefix = row.selected ? "›" : row.completed ? "·" : " ";

                  return (
                    <box
                      key={row.level.id}
                      flexDirection="row"
                      justifyContent="space-between"
                      backgroundColor={row.selected ? theme.selection : "transparent"}
                      paddingLeft={1}
                      paddingRight={1}
                      height={1}
                      overflow="hidden"
                    >
                      <box flexDirection="row" flexGrow={1} gap={1} height={1} overflow="hidden">
                        <box width={2} justifyContent="flex-start">
                          <text fg={row.selected ? theme.text : row.completed ? theme.muted : theme.dim}>
                            <strong>{prefix}</strong>
                          </text>
                        </box>
                        <box width={5} justifyContent="flex-start" overflow="hidden">
                          <text fg={row.selected ? theme.text : row.completed ? theme.muted : theme.dim}>
                            <strong>{row.index + 1}.</strong>
                          </text>
                        </box>
                        <box width={mapTitleWidth} overflow="hidden" height={1}>
                          <text fg={row.selected ? theme.text : row.completed ? theme.muted : theme.dim}>
                            <strong>{row.level.title}</strong>
                          </text>
                        </box>
                      </box>

                      <box width={8} justifyContent="flex-end" overflow="hidden">
                        <text fg={row.completed ? theme.success : theme.dim}>
                          <strong>{status}</strong>
                        </text>
                      </box>
                    </box>
                  );
                })}
              </box>

              <box width={1} flexDirection="column" justifyContent="flex-start">
                {Array.from({ length: Math.max(mapRows.length, 1) }, (_, row) => {
                  const thumbSize = Math.max(1, Math.round((visibleRowCount / allMapRows.length) * mapRows.length));
                  const thumbOffset = maxRowStart === 0 ? 0 : Math.round((rowStart / maxRowStart) * Math.max(0, mapRows.length - thumbSize));
                  const active = row >= thumbOffset && row < thumbOffset + thumbSize;

                  return (
                    <text key={`scroll-${row}`} fg={active ? theme.text : theme.dim}>
                      {active ? "█" : "│"}
                    </text>
                  );
                })}
              </box>
            </box>

            <box border={["top"]} borderColor={theme.accentSoft} paddingTop={1}>
              <text fg={theme.dim}>先定位自己在哪，再决定下一步练什么。</text>
            </box>
          </box>
        </Panel>

        <box flexDirection="column" flexGrow={1} gap={1}>
          <Panel
            title="当前章节"
            subtitle={`第 ${selectedChapterIndex + 1} 章 · ${selectedLevel.chapter} · 本章 ${selectedChapterLevels.length} 关，当前第 ${selectedChapterLevelOffset} 关`}
            grow={0}
            accent={theme.accent}
            framed={false}
          >
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>
                关卡范围: {firstChapterLevelIndex + 1}-{lastChapterLevelIndex + 1} / 本章已通 {selectedChapterCompletedCount}/{selectedChapterLevels.length}
              </text>
              {selectedChapterDoc ? <text fg={theme.muted}>讲义主题: {selectedChapterDoc.intro.title}</text> : null}
              <text fg={selectedChapterStats.introSeen ? theme.muted : theme.warning}>
                章节讲义: `c` 打开{selectedChapterStats.introSeen ? "（已读）" : "（建议先看）"}
              </text>
            </box>
          </Panel>

          <Panel
            title={selectedLevel.title}
            subtitle={`${selectedLevel.chapter} · 重点 ${selectedLevel.concept_tags.join(", ")}`}
            grow={0}
            accent={theme.warning}
            framed={false}
          >
            <box flexDirection="column" gap={1}>
              <text fg={theme.text}>{selectedLevel.goal_description}</text>
              <text fg={theme.muted}>起始光标: {formatCursor(selectedLevel.cursor_start)}</text>
              <text fg={theme.muted}>目标光标: {formatCursor(selectedLevel.target_state.cursor)}</text>
              <text fg={theme.muted}>Par: {selectedLevel.par_moves}</text>
              <text fg={theme.muted}>推荐解法: {formatSequence(selectedLevel.recommended_solution)}</text>
              {selectedChapterDoc ? (
                <text fg={selectedChapterStats.introSeen ? theme.muted : theme.warning}>
                  本章讲义: `c` 打开{selectedChapterStats.introSeen ? "（已读）" : "（未读）"}
                </text>
              ) : null}
              {selectedLevel.required_sequences?.length ? (
                <text fg={theme.warning}>要求技法: {selectedLevel.required_sequences.map(formatSequence).join(" / ")}</text>
              ) : null}
            </box>
          </Panel>

          <box flexDirection={isWide ? "row" : "column"} flexGrow={1} gap={2}>
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

            <Panel title="学习提示" subtitle="只保留对当前选择最有帮助的信息。" grow={1} accent={theme.success} framed={false}>
              <box flexDirection="column" gap={1}>
                <text fg={theme.text}>通关 {selectedStats.completions} 次 / 尝试 {selectedStats.attempts} 次</text>
                <text fg={theme.text}>最佳步数: {selectedStats.bestMoves ?? "--"}</text>
                <text fg={theme.muted}>首条提示: {selectedLevel.hints[0]}</text>
                {selectedChapterDoc ? (
                  <text fg={theme.muted}>讲义主题: {selectedChapterDoc.intro.title}</text>
                ) : null}
                {selectedLevel.guided_tip ? <text fg={theme.warning}>教练提示: {selectedLevel.guided_tip}</text> : null}
                <text fg={theme.accent}>按 `Enter` 进关；先想路线，再动手。</text>
              </box>
            </Panel>
          </box>
        </box>
      </box>
    </AppFrame>
  );
}
