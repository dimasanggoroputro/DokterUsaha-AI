"use server";

import { GoogleGenAI } from "@google/genai";
import { getDiagnosisById } from "@/lib/db-service";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function followUpChatAction(
  diagnosisId: string,
  message: string,
  chatHistory: { role: "user" | "model"; content: string }[],
): Promise<string> {
  if (!apiKey) {
    throw new Error("Kunci API Gemini tidak ditemukan di lingkungan server.");
  }

  try {
    // 1. Fetch diagnosis details for context
    const diagnosis = await getDiagnosisById(diagnosisId);
    if (!diagnosis) {
      throw new Error("Diagnosis rekam medis tidak ditemukan.");
    }

    const { consultationData: cond, diagnosisResult: res } = diagnosis;

    // 2. Build system instructions incorporating the diagnosis context
    const systemInstruction = `
Anda adalah DokterUsaha AI, seorang konsultan bisnis digital UMKM di Indonesia dengan pembawaan yang sangat ramah, suportif, hangat, dan praktis.
Pengguna sedang mendiskusikan hasil rekam medis dan diagnosis usaha mereka dengan Anda. Berikut adalah detail data usahanya:

Nama Usaha: ${cond.businessName}
Jenis Usaha: ${cond.businessType}
Lama Berdiri: ${cond.businessAge}
Jumlah Karyawan: ${cond.employeeCount} orang
Omzet Bulanan: ${cond.monthlyRevenue}
Masalah Utama: ${cond.mainProblem}
Tantangan: ${cond.currentChallenges}

Hasil Pemeriksaan Medis Usaha:
- Skor Kesehatan Usaha: ${res.healthScore}/100 (${res.healthStatus})
- Vonis Dokter Bisnis: ${res.verdict}
- Rekomendasi Terapi: ${res.recommendations.join(" | ")}
- Rencana Aksi Mingguan: ${JSON.stringify(res.actionPlan)}

TUGAS ANDA:
Bantu jawab pertanyaan lanjutan dari pengguna mengenai hasil pemeriksaan mereka, cara menjalankan resep solusi, atau detail langkah aksi praktis.
Gunakan bahasa Indonesia yang sangat ramah, merakyat, menyemangati, dan mudah dimengerti pemilik usaha kecil. Hindari teori rumit atau bahasa ilmiah kedokteran yang membingungkan.
Berikan arahan konkret yang mudah dikerjakan di Indonesia (misalnya tips berjualan online, pendaftaran NIB, promosi WhatsApp, pemisahan uang kas, dsb).
Jawablah secara terarah, ringkas, dan penuh empati.

`;

    // 3. Format contents with system context and history
    const contents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      ...chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // 4. Generate response from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const reply = response.text;
    if (!reply) {
      throw new Error("AI tidak mengembalikan jawaban.");
    }

    return reply;
  } catch (error) {
    console.error("Follow Up Chat Error:", error);
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}
