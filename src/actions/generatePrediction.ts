"use server";

import { GoogleGenAI } from "@google/genai";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Generates AI narrative explaining a prediction result.
 * Backend calculates the prediction score; Gemini only explains *why* and gives advice.
 */
export async function generatePredictionAction(context: {
  currentScore: number;
  predictedScore: number;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  businessName: string;
  healthStatus: string;
}): Promise<string> {
  if (!apiKey) {
    return "Tidak dapat menghasilkan penjelasan prediksi: API key tidak tersedia.";
  }

  const prompt = `
Anda adalah DokterUsaha AI, konsultan bisnis profesional untuk UMKM Indonesia.

Berikan penjelasan singkat tentang prediksi kesehatan usaha "${context.businessName}" berdasarkan data berikut:

- Skor Kesehatan Saat Ini: ${context.currentScore}/100 (Status: ${context.healthStatus})
- Prediksi Skor 30 Hari ke Depan: ${context.predictedScore}/100
- Progress Rencana Aksi: ${context.completedTasks} dari ${context.totalTasks} tugas selesai (${context.completionRate}%)

ATURAN:
1. Tulis dalam Bahasa Indonesia yang ramah, profesional, dan memotivasi.
2. Maksimal 100 kata.
3. JANGAN menghitung angka atau membuat angka baru.
4. Jelaskan alasan prediksi berdasarkan progress yang sudah dicapai.
5. Berikan 1 saran konkret agar prediksi tercapai.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text?.trim() ||
      "Tidak dapat menghasilkan penjelasan prediksi saat ini."
    );
  } catch (error) {
    console.error("generatePrediction error:", error);
    return `Tidak dapat menghasilkan prediksi: ${getUserFriendlyErrorMessage(error)}`;
  }
}
