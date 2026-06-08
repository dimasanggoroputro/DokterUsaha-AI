import { supabase } from "./supabase";
import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";

export interface DiagnosisRow {
  id: string;
  user_id: string;
  consultation_data: ConsultationData;
  diagnosis_result: DiagnosisResult;
  created_at: string;
  updated_at: string;
}

// Maps database row to dynamic consultation and result interfaces
export function mapRowToDiagnosis(row: DiagnosisRow): {
  consultationData: ConsultationData;
  diagnosisResult: DiagnosisResult;
  user_id: string;
} {
  // Extract custom result from db properties
  const res = row.diagnosis_result;
  const data = row.consultation_data;

  // Format date correctly
  const formattedDate = row.created_at
    ? new Date(row.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID");

  return {
    user_id: row.user_id,
    consultationData: {
      businessName: data?.businessName || "",
      businessType: data?.businessType || "",
      businessAge: data?.businessAge || "",
      employeeCount: Number(data?.employeeCount) || 0,
      monthlyRevenue: data?.monthlyRevenue || "",
      mainProblem: data?.mainProblem || "",
      currentChallenges: data?.currentChallenges || "",
      businessGoal: data?.businessGoal || "",
      expectedOutcome: data?.expectedOutcome || "",
    },
    diagnosisResult: {
      id: row.id,
      summary: res?.summary || "",
      urgency: res?.urgency || "sedang",
      healthScore: Number(res?.healthScore) || 50,
      healthStatus: res?.healthStatus || "perlu-perhatian",
      confidenceScore: Number(res?.confidenceScore) || 0,
      dataQuality: res?.dataQuality || "rendah",
      verdict: res?.verdict || "",
      insights: Array.isArray(res?.insights) ? res.insights : [],
      strengths: Array.isArray(res?.strengths) ? res.strengths : [],
      causes: Array.isArray(res?.causes) ? res.causes : [],
      recommendations: Array.isArray(res?.recommendations) ? res.recommendations : [],
      actionPlan: Array.isArray(res?.actionPlan) ? res.actionPlan : [],
      createdAt: formattedDate,
    },
  };
}

/**
 * Saves a consultation diagnosis to the Supabase diagnoses table.
 * Returns the UUID of the newly inserted record.
 */
export async function saveDiagnosis(
  consultationData: ConsultationData,
  result: Omit<DiagnosisResult, "id">,
  userId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("diagnoses")
    .insert([
      {
        user_id: userId,
        consultation_data: consultationData,
        // Exclude temporary/placeholder ID before saving
        diagnosis_result: {
          summary: result.summary,
          urgency: result.urgency,
          healthScore: result.healthScore,
          healthStatus: result.healthStatus,
          confidenceScore: result.confidenceScore,
          dataQuality: result.dataQuality,
          verdict: result.verdict,
          insights: result.insights,
          strengths: result.strengths,
          causes: result.causes,
          recommendations: result.recommendations,
          actionPlan: result.actionPlan,
        },
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Supabase Save Error Details:", error);
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  if (!data || !data.id) {
    throw new Error("Gagal memperoleh ID resep diagnosis dari database.");
  }

  return data.id;
}

/**
 * Fetches a single diagnosis record from Supabase by its ID.
 */
export async function getDiagnosisById(id: string): Promise<{
  consultationData: ConsultationData;
  diagnosisResult: DiagnosisResult;
  user_id: string;
} | null> {
  const { data, error } = await supabase
    .from("diagnoses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Supabase Fetch Error (id=${id}):`, error);
    return null;
  }

  if (!data) return null;

  return mapRowToDiagnosis(data as DiagnosisRow);
}

/**
 * Fetches all diagnoses associated with an anonymous userId, sorted by created_at DESC.
 */
export async function getDiagnosesByUserId(userId: string): Promise<
  Array<{
    id: string;
    consultationData: ConsultationData;
    diagnosisResult: DiagnosisResult;
    createdAt: string;
  }>
> {
  const { data, error } = await supabase
    .from("diagnoses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Supabase History Error (userId=${userId}):`, error);
    return [];
  }

  if (!data) return [];

  return (data as DiagnosisRow[]).map((row) => {
    const mapped = mapRowToDiagnosis(row);
    return {
      id: row.id,
      consultationData: mapped.consultationData,
      diagnosisResult: mapped.diagnosisResult,
      createdAt: row.created_at,
    };
  });
}
