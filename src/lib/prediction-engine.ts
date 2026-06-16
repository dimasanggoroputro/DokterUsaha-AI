import { ActionPlanWeek } from "@/types/diagnosis";

/**
 * Calculates a deterministic prediction for business health score 30 days ahead.
 * Uses: currentScore, completedTasks, totalTasks.
 * NOT random — purely based on quantitative data.
 * Gemini only explains the result, never calculates.
 */
export interface PredictionResult {
  predictedScore: number;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  potentialGain: number;
}

export function calculatePrediction(
  currentScore: number,
  checkedTasks: Record<string, boolean> | undefined,
  actionPlan: ActionPlanWeek[]
): PredictionResult {
  // Count total tasks from action plan
  let totalTasks = 0;
  actionPlan.forEach((week) => {
    totalTasks += week.tasks.length;
  });

  // Count completed tasks from checked_tasks
  let completedTasks = 0;
  if (checkedTasks) {
    Object.values(checkedTasks).forEach((isChecked) => {
      if (isChecked) completedTasks++;
    });
  }

  // Calculate completion rate
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate potential gain:
  // - The gap between current score and 100 represents room for improvement
  // - completionRate determines how much of that gap can be closed
  // - 0.6 is a conservative multiplier (not all tasks have equal weight)
  const gap = 100 - currentScore;
  const potentialGain = Math.round(gap * (completionRate / 100) * 0.6);

  // Final predicted score
  const predictedScore = Math.min(98, currentScore + potentialGain);

  return {
    predictedScore,
    completionRate,
    completedTasks,
    totalTasks,
    potentialGain,
  };
}
