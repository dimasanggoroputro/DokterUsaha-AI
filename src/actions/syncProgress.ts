"use server";

import { supabase } from "@/lib/supabase";

/**
 * Synchronizes the action plan checklist progress to Supabase diagnoses table.
 * Embeds checked tasks into the diagnosis_result JSONB column.
 */
export async function syncProgressAction(
  diagnosisId: string,
  checkedTasks: Record<string, boolean>
): Promise<boolean> {
  if (!diagnosisId) return false;

  try {
    // 1. Fetch current diagnosis_result
    const { data: row, error: fetchError } = await supabase
      .from("diagnoses")
      .select("diagnosis_result")
      .eq("id", diagnosisId)
      .single();

    if (fetchError || !row) {
      console.error("Failed to fetch diagnosis for progress sync:", fetchError);
      return false;
    }

    // 2. Merge checked_tasks into diagnosis_result
    const updatedResult = {
      ...row.diagnosis_result,
      checked_tasks: checkedTasks,
    };

    // 3. Save back to Supabase diagnoses table
    const { error: updateError } = await supabase
      .from("diagnoses")
      .update({ diagnosis_result: updatedResult })
      .eq("id", diagnosisId);

    if (updateError) {
      console.error("Failed to update progress in Supabase:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("syncProgressAction error:", error);
    return false;
  }
}
