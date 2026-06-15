"use server";

import { GoogleGenAI } from "@google/genai";
import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";
import { saveDiagnosis } from "@/lib/db-service";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";
import { calculateHealthScore } from "@/lib/health-engine";

// Initialize GoogleGenAI client
// Next.js Server Actions execute on the server, so process.env is accessible
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function createDiagnosisAction(
  consultationData: ConsultationData,
  userId?: string,
): Promise<DiagnosisResult> {
  if (!apiKey) {
    throw new Error(
      "Kunci API (GEMINI_API_KEY) tidak ditemukan di lingkungan server. Harap tambahkan Kunci API Anda di file .env untuk mengaktifkan diagnosis AI.",
    );
  }

  // Calculate health score at backend before invoking Gemini
  const calculated = calculateHealthScore(consultationData);
  const calculatedStatusLabel = 
    calculated.healthStatus === "sehat" ? "Sehat (Bugar)" : 
    calculated.healthStatus === "perlu-perhatian" ? "Perlu Perhatian (Rawat Jalan)" : 
    "Kritis (Gawat Darurat)";

  const prompt = `
Anda adalah seorang konsultan bisnis profesional untuk UMKM di Indonesia dengan pembawaan yang sangat ramah, hangat, dan suportif. Gaya komunikasi Anda memadukan keahlian analitis bisnis tingkat tinggi dengan metafora medis yang halus dan santun (sebagai "Dokter Bisnis Digital"). Hindari kesan sebagai dokter gadungan yang terlalu berlebihan atau menggunakan humor medis/nama penyakit fiktif yang konyol.

Tugas Anda adalah mendiagnosis kesehatan bisnis dari pemilik usaha berdasarkan data rekam medis berikut:

- **Nama Usaha**: ${consultationData.businessName}
- **Jenis Usaha**: ${consultationData.businessType}
- **Lama Usaha**: ${consultationData.businessAge}
- **Jumlah Karyawan**: ${consultationData.employeeCount} orang
- **Omzet Bulanan**: ${consultationData.monthlyRevenue}
- **Masalah Utama (Keluhan)**: ${consultationData.mainProblem}
- **Tantangan Spesifik saat ini**: ${consultationData.currentChallenges}
- **Target Bisnis 6 Bulan ke Depan**: ${consultationData.businessGoal}
- **Hasil yang Diharapkan dari Konsultasi**: ${consultationData.expectedOutcome}

Sistem kami telah menghitung kondisi kesehatan bisnis kuantitatif awal secara objektif:
- **Skor Kesehatan Usaha**: ${calculated.healthScore} dari 100
- **Status Kesehatan**: ${calculatedStatusLabel} (${calculated.healthStatus})

PANDUAN UTAMA DIAGNOSIS & ANALISIS:
1. **Analisis Riil & Menyeluruh**: Lakukan analisis menggunakan logika bisnis yang rasional berdasarkan semua parameter di atas. Anda wajib menjelaskan alasan di balik Skor Kesehatan sebesar ${calculated.healthScore}/100 dan status kesehatan ${calculatedStatusLabel} yang telah dihitung oleh sistem. Pertimbangkan hubungan antara umur bisnis, jumlah staf, omzet, dan masalah yang dihadapi. Jangan abaikan bidang masukan apa pun.
2. **Larangan Fabrikasi Data & Aturan Akurasi**: JANGAN PERNAH membuat-buat metrik bisnis baru atau fakta numerik yang tidak disediakan oleh pengguna (seperti angka penjualan fiktif atau persentase spesifik). Jangan pernah menyatakan sesuatu sebagai fakta jika pengguna tidak memberikan informasi tersebut secara eksplisit dalam input. Jika Anda ingin menyebut kemungkinan penyebab/faktor yang belum dipastikan oleh user, gunakan format tentatif seperti: *'Kemungkinan'*, *'Dugaan'*, *'Perlu diperiksa lebih lanjut'*, atau *'Indikasi awal'*.
3. **Penggunaan Metafora Medis yang Halus**: Metafora medis bersifat opsional dan harus realistis serta mudah dipahami oleh pemilik usaha kecil di Indonesia.
   - Gunakan istilah yang wajar seperti "Kas Seret" (bukan "Dehidrasi Likuiditas Akut"), "Sepi Pembeli" atau "Krisis Trafik" (bukan "Kelesuan Trafik"), dan "Kelebihan Beban" (bukan "Penyakit Obesitas Operasional").
   - Jangan gunakan nama penyakit medis fiktif atau istilah kedokteran yang rumit/membingungkan.
4. **Kewajiban Skor Kesehatan**: Dalam JSON output Anda, Anda wajib mengisi property "healthScore" dengan nilai integer ${calculated.healthScore} dan property "healthStatus" dengan string "${calculated.healthStatus}". Jangan diubah ke nilai lain.
5. **Identifikasi Kekuatan Bisnis (Strengths)**: Tentukan 2-3 aspek positif dari usaha pengguna berdasarkan data yang diinput (misalnya: umur bisnis yang sudah matang, memiliki tim kerja, kejelasan target bisnis, atau sektor bisnis yang potensial) untuk memotivasi pengguna di awal laporan.
6. **Vonis Dokter (Verdict)**: Tulis dalam satu paragraf dengan struktur berikut:
   - Diawali persis dengan kalimat "HASIL PEMERIKSAAN UTAMA: ".
   - Tunjukkan empati mendalam atas perjuangan pemilik usaha.
   - Berikan penilaian klinis bisnis yang objektif dan realistis (tanpa bercanda konyol).
   - Tawarkan harapan realistis dan arah tindakan jangka pendek yang konkret.
7. **Insight Bisnis Mendalam (Insights)**: Buat 2-4 insight bisnis mendalam yang didasarkan pada analisis hubungan silang antara minimal dua data input pengguna berikut: umur usaha, omzet bulanan, jumlah karyawan, masalah utama, atau target bisnis. Jangan menulis insight generik layaknya tips bisnis blog umum. Insight harus memberikan 'Aha Moment' dengan menerangkan hubungan sebab-asbab secara tajam.
8. **Validasi Kualitas Informasi Pengguna (SANGAT PENTING)**:
     Sebelum melakukan diagnosis, nilai kualitas informasi yang diberikan pengguna.
     Kategori: Tinggi, Sedang, Rendah.
     Anggap kualitas informasi RENDAH apabila:
     - Masalah utama terlalu pendek.
     - Banyak karakter berulang atau pola seperti "aaa", "eee", "test", "123".
     - Tidak menjelaskan kondisi bisnis secara nyata.
     Jika kualitas informasi RENDAH:
     - Jangan membuat asumsi detail atau insight spesifik.
     - Jelaskan bahwa data belum cukup dan berikan rekomendasi untuk memperjelas masalah.
     - Turunkan confidence score secara signifikan (< 40).
     
  9. **PERILAKU SAAT DATA QUALITY RENDAH (WAJIB)**:
     Jika dataQuality = "rendah" atau confidenceScore < 40:
     - Insights harus berisi: "Belum tersedia informasi yang cukup untuk menghasilkan insight bisnis yang akurat."
     - Causes harus berisi: "Belum tersedia data yang cukup untuk mengidentifikasi akar masalah utama."
     - Recommendations harus fokus pada memperjelas masalah dan mendokumentasikan keluhan lebih detail.
     - Action Plan harus berupa panduan mengumpulkan informasi keuangan/operasional.

Berikan respons Anda dalam format JSON terstruktur yang valid sesuai dengan skema yang diminta.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            healthScore: {
              type: "integer",
              description: "Skor kesehatan bisnis antara 0 sampai 100.",
            },
            healthStatus: {
              type: "string",
              enum: ["sehat", "perlu-perhatian", "kritis"],
            },
            confidenceScore: {
              type: "integer",
              description: "Tingkat keyakinan AI terhadap diagnosis. Nilai 0-100.",
            },
            dataQuality: {
              type: "string",
              enum: ["tinggi", "sedang", "rendah"],
            },
            urgency: {
              type: "string",
              enum: ["rendah", "sedang", "tinggi", "kritis"],
            },
            summary: {
              type: "string",
              description: "Ringkasan kondisi kesehatan bisnis dalam bahasa Indonesia yang ramah.",
            },
            verdict: {
              type: "string",
              description: "Pernyataan verdict/vonis dokter bisnis yang didahului 'HASIL PEMERIKSAAN UTAMA:'.",
            },
            insights: {
              type: "array",
              items: { type: "string" },
            },
            strengths: {
              type: "array",
              items: { type: "string" },
            },
            causes: {
              type: "array",
              items: { type: "string" },
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
            },
            actionPlan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  week: { type: "integer" },
                  title: { type: "string" },
                  tasks: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["week", "title", "tasks"],
              },
            },
          },
          required: [
            "healthScore",
            "healthStatus",
            "confidenceScore",
            "dataQuality",
            "urgency",
            "summary",
            "verdict",
            "insights",
            "strengths",
            "causes",
            "recommendations",
            "actionPlan",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Respon kosong diterima dari Gemini API.");
    }

    // Safely parse and build the final DiagnosisResult object
    const aiResult = JSON.parse(responseText);

    // Build the final DiagnosisResult object - strictly use calculated values
    const finalResult: Omit<DiagnosisResult, "id"> = {
      summary: aiResult.summary || "",
      urgency: aiResult.urgency || "sedang",
      healthScore: calculated.healthScore,
      healthStatus: calculated.healthStatus,
      confidenceScore: Number(aiResult.confidenceScore) || 0,
      dataQuality: aiResult.dataQuality || "rendah",
      verdict: aiResult.verdict || "",
      insights: Array.isArray(aiResult.insights) ? aiResult.insights : [],
      strengths: Array.isArray(aiResult.strengths) ? aiResult.strengths : [],
      causes: Array.isArray(aiResult.causes) ? aiResult.causes : [],
      recommendations: Array.isArray(aiResult.recommendations)
        ? aiResult.recommendations
        : [],
      actionPlan: Array.isArray(aiResult.actionPlan) ? aiResult.actionPlan : [],
      createdAt: new Date().toLocaleDateString("id-ID"),
    };

    // Save to Supabase diagnoses table
    const dbId = await saveDiagnosis(
      consultationData,
      finalResult,
      userId || "anonymous",
    );

    const finalResultWithId: DiagnosisResult = {
      ...finalResult,
      id: dbId,
    };

    return finalResultWithId;
  } catch (error) {
    console.error("Diagnosis Error:", error);
    throw new Error(getUserFriendlyErrorMessage(error));
  }
}
