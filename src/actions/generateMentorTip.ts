"use server";

import { GoogleGenAI } from "@google/genai";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Generates a weekly mentor tip from AI based on latest diagnosis and progress.
 * Max 100 words, actionable and motivational.
 */
export async function generateMentorTipAction(context: {
  businessName: string;
  healthScore: number;
  healthStatus: string;
  mainProblem: string;
  completedTasks: number;
  totalTasks: number;
  topRecommendation: string;
}): Promise<string> {
  if (!apiKey) {
    return "Tidak dapat menghasilkan saran mentor: API key tidak tersedia.";
  }

  const prompt = `
Anda adalah DokterUsaha AI, mentor bisnis digital yang ramah dan suportif untuk UMKM Indonesia.

Buat 1 pesan mentor mingguan yang singkat, personal, dan actionable untuk pemilik usaha "${context.businessName}" berdasarkan kondisi berikut:

- Skor Kesehatan: ${context.healthScore}/100 (${context.healthStatus})
- Masalah Utama: "${context.mainProblem}"
- Progress Rencana Aksi: ${context.completedTasks} dari ${context.totalTasks} tugas selesai
- Rekomendasi Utama: "${context.topRecommendation}"

ATURAN:
1. Tulis dalam Bahasa Indonesia yang ramah, hangat, dan memotivasi.
2. Maksimal 100 kata.
3. Langsung ke inti — tidak perlu sapaan panjang.
4. Berikan 1 saran konkret yang bisa dilakukan minggu ini.
5. Jika progress rendah, dorong dengan lembut tanpa menyalahkan.
6. Jika progress bagus, beri apresiasi singkat.
7. JANGAN menghitung angka baru.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text?.trim() || "Tidak dapat menghasilkan saran mentor saat ini."
    );
  } catch (error) {
    console.error("generateMentorTip error:", error);
    return `Tidak dapat menghasilkan saran: ${getUserFriendlyErrorMessage(error)}`;
  }
}
