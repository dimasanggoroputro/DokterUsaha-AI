"use server";

import { supabase } from "@/lib/supabase";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

/**
 * Server Action to delete a business diagnosis from Supabase by ID.
 * Verifies existence before deletion and formats the response.
 */
export async function deleteDiagnosisAction(
  diagnosisId: string
): Promise<{ success: boolean; message?: string }> {
  if (!diagnosisId) {
    return { success: false, message: "ID diagnosis tidak valid." };
  }

  try {
    // 1. Verify that the diagnosis exists in the database
    const { data: checkData, error: checkError } = await supabase
      .from("diagnoses")
      .select("id")
      .eq("id", diagnosisId)
      .single();

    if (checkError || !checkData) {
      return { success: false, message: "Rekam medis tidak ditemukan." };
    }

    // 2. Perform deletion
    const { error: deleteError } = await supabase
      .from("diagnoses")
      .delete()
      .eq("id", diagnosisId);

    if (deleteError) {
      throw deleteError;
    }

    return { success: true };
  } catch (error) {
    console.error("deleteDiagnosisAction error:", error);
    return {
      success: false,
      message: getUserFriendlyErrorMessage(error),
    };
  }
}
