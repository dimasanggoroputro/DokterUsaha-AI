"use server";

import { GoogleGenAI } from "@google/genai";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Generates an AI narrative analyzing progress between two diagnoses.
 * Backend calculates the numbers; Gemini only provides the narrative explanation.
 */
export async function generateProgressReportAction(context: {
  currentScore: number;
  previousScore: number;
  scoreDiff: number;
  currentStatus: string;
  previousStatus: string;
  currentMainProblem: string;
  previousMainProblem: string;
  businessName: string;
}): Promise<string> {
  if (!apiKey) {
    return "Tidak dapat menghasilkan analisis perkembangan: API key tidak tersedia.";
  }

  const trend =
    context.scoreDiff > 0
      ? "meningkat"
      : context.scoreDiff < 0
        ? "menurun"
        : "stabil";

  const prompt = `
Anda adalah DokterUsaha AI, konsultan bisnis profesional untuk UMKM Indonesia.

Berikan analisis singkat tentang perkembangan kesehatan usaha "${context.businessName}" berdasarkan data berikut:

- Skor Kesehatan Sebelumnya: ${context.previousScore}/100 (Status: ${context.previousStatus})
- Skor Kesehatan Saat Ini: ${context.currentScore}/100 (Status: ${context.currentStatus})
- Perubahan Skor: ${context.scoreDiff > 0 ? "+" : ""}${context.scoreDiff} poin (Tren: ${trend})
- Masalah Utama Sebelumnya: "${context.previousMainProblem}"
- Masalah Utama Saat Ini: "${context.currentMainProblem}"

ATURAN:
1. Tulis dalam Bahasa Indonesia yang ramah dan profesional.
2. Maksimal 150 kata.
3. JANGAN menghitung angka atau membuat data baru.
4. Jelaskan kemungkinan alasan tren ${trend}.
5. Berikan 1 saran konkret untuk langkah selanjutnya.
6. Gunakan nada yang suportif dan memotivasi.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text?.trim() ||
      "Tidak dapat menghasilkan analisis perkembangan saat ini."
    );
  } catch (error) {
    console.error("generateProgressReport error:", error);
    return `Tidak dapat menghasilkan analisis: ${getUserFriendlyErrorMessage(error)}`;
  }
}
