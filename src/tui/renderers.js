import { levels } from "../game/levels.js";
import {
  levelStats,
  progressLocation
} from "./progressStore.js";

export function clearScreen() {
  process.stdout.write("\x1Bc");
}

export function formatSequence(tokens) {
  return tokens
    .map((token) => {
      if (token === "Escape") {
        return "<Esc>";
      }
      if (token === "Enter") {
        return "<CR>";
      }
      if (token === " ") {
        return "<Space>";
      }
      return token;
    })
    .join(" ");
}

function renderDiff(diff) {
  return diff
    .map((entry) => {
      const prefix = entry.type === "add" ? "+" : entry.type === "remove" ? "-" : " ";
      return `${prefix} ${entry.text}`;
    })
    .join("\n");
}

export function renderMainMenu(progress) {
  clearScreen();
  console.log("Vim Breach Lab");
  console.log("真实 Vim 训练营");
  console.log("");
  console.log("选择关卡编号开始训练。用 `ZZ` 或 `Q` 结束关卡，计分只看训练按键。");
  console.log(`进度文件: ${progressLocation()}`);
  console.log("");

  levels.forEach((level, index) => {
    const stats = levelStats(progress, level.id);
    const badge = stats.completions > 0 ? "已通关" : "未通关";
    const best = stats.bestMoves === null ? "--" : `${stats.bestMoves} 步`;
    console.log(`${index + 1}. [${badge}] ${level.title} (${level.chapter}) | 最佳: ${best}`);
  });

  console.log("");
  console.log("输入编号进入关卡，也可以输入 n 直接开始下一关，或输入 q 退出。");
}

export function renderLevelDetails(level, progress, hintIndex, showAnswer) {
  clearScreen();
  const stats = levelStats(progress, level.id);
  console.log(`${level.title} · ${level.chapter}`);
  console.log("");
  console.log(`目标: ${level.goal_description}`);
  console.log(`重点: ${level.concept_tags.join(", ")}`);
  if (level.required_sequences?.length) {
    console.log(`要求: 至少使用 ${level.required_sequences.map((sequence) => sequence.join("")).join(" / ")}`);
  }
  console.log(`Par: ${level.par_moves}`);
  console.log(`起始光标: 第 ${level.cursor_start.line + 1} 行，第 ${level.cursor_start.col + 1} 列`);
  console.log(`战绩: ${stats.completions} 次通关 / ${stats.attempts} 次尝试 / 最佳 ${stats.bestMoves ?? "--"} 步`);
  console.log("");
  console.log("代码预览:");
  console.log(level.snippet);
  console.log("");
  console.log(`提示: ${level.hints[Math.min(hintIndex, level.hints.length - 1)]}`);
  if (showAnswer) {
    console.log(`推荐解法: ${formatSequence(level.recommended_solution)}`);
  }
  console.log("");
  console.log("[Enter] 开始  [h] 下一条提示  [a] 显示答案  [b] 返回列表");
}

export function renderResult(level, evaluation, runResult) {
  clearScreen();
  console.log(`${level.title} · 结算`);
  console.log("");
  console.log(`结果: ${evaluation.objectivePassed ? "通过" : "未通过"}`);
  if (evaluation.objectivePassed && !evaluation.techniqueMatches) {
    console.log("训练目标: 未完成");
  }
  console.log(`评级: ${evaluation.grade}`);
  console.log(`步数: ${evaluation.keylog.scoredMoves} / Par ${level.par_moves}`);
  console.log(`退出方式: ${evaluation.keylog.quitStrategy ?? "未识别"}`);
  console.log(`最终光标: 第 ${evaluation.actualCursor.line + 1} 行，第 ${evaluation.actualCursor.col + 1} 列`);
  console.log(`目标光标: 第 ${evaluation.expectedCursor.line + 1} 行，第 ${evaluation.expectedCursor.col + 1} 列`);
  console.log("");
  console.log("推荐解法:");
  console.log(formatSequence(level.recommended_solution));
  console.log("");
  console.log("诊断:");
  console.log(`- 文本: ${evaluation.diagnostics.text}`);
  console.log(`- 光标: ${evaluation.diagnostics.cursor}`);
  console.log(`- 技法: ${evaluation.diagnostics.technique}`);
  if (evaluation.firstDiff) {
    console.log(`- 首个差异行: 第 ${evaluation.firstDiff.line} 行`);
    console.log(`  目标: ${evaluation.firstDiff.expected}`);
    console.log(`  实际: ${evaluation.firstDiff.actual}`);
  }
  console.log("");
  console.log("计分按键:");
  console.log(evaluation.keylog.displayForScore || "(未采集到训练按键)");
  console.log("");
  console.log("退出按键:");
  console.log(evaluation.keylog.quitStrategy ?? "未识别");
  console.log("");
  if (evaluation.reasons.length) {
    console.log("判题说明:");
    for (const reason of evaluation.reasons) {
      console.log(`- ${reason}`);
    }
    console.log("");
  }
  console.log("Diff:");
  console.log(renderDiff(evaluation.diff));
  console.log("");
  console.log(`沙盒目录: ${runResult.sandbox.sandboxDir}`);
  console.log("");
  console.log("[r] 重试  [n] 下一关  [b] 返回列表");
}
