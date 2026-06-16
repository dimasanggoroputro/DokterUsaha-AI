"use server";

import { supabase } from "@/lib/supabase";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

export interface BenchmarkResult {
  averageScore: number;
  totalSamples: number;
  userScore: number;
  position: "di atas" | "di bawah" | "seimbang";
}

/**
 * Calculates a benchmark comparing a user's health score with other businesses of the same type.
 * Uses real data from the database, fallbacks gracefully if no samples are found.
 */
export async function getBenchmarkAction(
  businessType: string,
  userScore: number
): Promise<BenchmarkResult> {
  try {
    // Query diagnoses matching the businessType
    // To handle JSONB query in Supabase JS client, we select the columns we need.
    // Since we'll need to parse them, fetching all diagnoses and parsing is safer and avoids potential issues
    // with different Supabase column setups, as long as the dataset size is reasonable.
    // If the database has many records, we can refine this.
    const { data, error } = await supabase
      .from("diagnoses")
      .select("diagnosis_result, consultation_data");

    if (error) {
      console.error("Supabase Benchmark Error:", error);
      throw new Error(getUserFriendlyErrorMessage(error));
    }

    if (!data || data.length === 0) {
      return {
        averageScore: userScore,
        totalSamples: 1,
        userScore,
        position: "seimbang",
      };
    }

    let totalScore = 0;
    let count = 0;

    data.forEach((row: any) => {
      const dbType = row.consultation_data?.businessType;
      const score = Number(row.diagnosis_result?.healthScore);

      if (
        dbType &&
        dbType.trim().toLowerCase() === businessType.trim().toLowerCase() &&
        !isNaN(score)
      ) {
        totalScore += score;
        count++;
      }
    });

    // If no other businesses of same type, fallback to user's score as average
    if (count === 0) {
      return {
        averageScore: userScore,
        totalSamples: 1,
        userScore,
        position: "seimbang",
      };
    }

    const averageScore = Math.round(totalScore / count);
    let position: "di atas" | "di bawah" | "seimbang" = "seimbang";

    if (userScore > averageScore + 2) {
      position = "di atas";
    } else if (userScore < averageScore - 2) {
      position = "di bawah";
    }

    return {
      averageScore,
      totalSamples: count,
      userScore,
      position,
    };
  } catch (error) {
    console.error("getBenchmarkAction error:", error);
    // Graceful fallback for UI continuity
    return {
      averageScore: userScore,
      totalSamples: 1,
      userScore,
      position: "seimbang",
    };
  }
}
