"use server";

import { GoogleGenAI } from "@google/genai";
import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";
import { saveDiagnosis } from "@/lib/db-service";

// Initialize GoogleGenAI client
// Next.js Server Actions execute on the server, so process.env is accessible
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function createDiagnosisAction(
  consultationData: ConsultationData,
  userId?: string
): Promise<DiagnosisResult> {
  if (!apiKey) {
    throw new Error(
      "Kunci API (GEMINI_API_KEY) tidak ditemukan di lingkungan server. Harap tambahkan Kunci API Anda di file .env untuk mengaktifkan diagnosis AI.",
    );
  }

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

PANDUAN UTAMA DIAGNOSIS & ANALISIS:
1. **Analisis Riil & Menyeluruh**: Lakukan analisis menggunakan logika bisnis yang rasional berdasarkan semua parameter di atas. Pertimbangkan hubungan antara umur bisnis, jumlah staf, omzet, dan masalah yang dihadapi. Jangan abaikan bidang masukan apa pun.
2. **Larangan Fabrikasi Data & Aturan Akurasi**: JANGAN PERNAH membuat-buat metrik bisnis baru atau fakta numerik yang tidak disediakan oleh pengguna (seperti angka penjualan fiktif atau persentase spesifik). **Jangan pernah menyatakan sesuatu sebagai fakta jika pengguna tidak memberikan informasi tersebut secara eksplisit dalam input.** (Misalnya, jangan pernah menuduh "Manajemen stok belum optimal", "Karyawan belum mendapat pelatihan", atau "Analisis pelanggan belum dimanfaatkan" sebagai fakta kecuali pengguna menyatakannya tertulis). Jika Anda ingin menyebut kemungkinan penyebab/faktor yang belum dipastikan oleh user, gunakan format tentatif seperti: *'Kemungkinan'*, *'Dugaan'*, *'Perlu diperiksa lebih lanjut'*, atau *'Indikasi awal'*.
   *Contoh Benar*: 'Kemungkinan terdapat ketidakefisienan operasional yang perlu diperiksa lebih lanjut.'
   *Contoh Salah*: 'Operasional bisnis Anda tidak efisien.'
3. **Penggunaan Metafora Medis yang Halus**: Metafora medis bersifat opsional dan harus realistis serta mudah dipahami oleh pemilik usaha kecil di Indonesia.
   - Gunakan istilah yang wajar seperti "Kas Seret" (bukan "Dehidrasi Likuiditas Akut" atau "Aritmia Keuangan"), "Sepi Pembeli" atau "Krisis Trafik" (bukan "Kelesuan Trafik" atau "Obat Trafik"), dan "Kelebihan Beban" (bukan "Penyakit Obesitas Operasional").
   - Jangan gunakan nama penyakit medis fiktif atau istilah kedokteran yang rumit/membingungkan.
4. **Formula Perhitungan Skor Kesehatan**: Tentukan skor kesehatan bisnis (0-100) secara logis dan transparan dengan langkah berikut:
   - Mulai dari nilai dasar 100.
   - Kurangi berdasarkan tingkat keparahan masalah utama (-10 hingga -30).
   - Kurangi berdasarkan tingkat kesulitan tantangan saat ini (-10 hingga -25).
   - Kurangi jika target bisnis atau hasil yang diharapkan kurang jelas/spesifik (-10).
   - Kurangi jika ada ketidakseimbangan operasional (misal: jumlah karyawan terlalu banyak tetapi omzet rendah, atau bisnis sudah lama berjalan tetapi omzet sangat kecil) (-5 hingga -15).
   - Tambahkan bonus poin atas kelebihan yang dimiliki bisnis (+5 hingga +15).
   - Pastikan skor akhir (0-100) berkorelasi dengan status kesehatan:
     - 70-100: "sehat"
     - 40-69: "perlu-perhatian"
     - 0-39: "kritis"
5. **Identifikasi Kekuatan Bisnis (Strengths)**: Tentukan 2-3 aspek positif dari usaha pengguna berdasarkan data yang diinput (misalnya: umur bisnis yang sudah matang, memiliki tim kerja, kejelasan target bisnis, atau sektor bisnis yang potensial). Bagian ini penting untuk memotivasi pengguna di awal laporan.
6. **Vonis Dokter (Verdict)**: Tulis dalam satu paragraf dengan struktur berikut:
   - Diawali persis dengan kalimat "HASIL PEMERIKSAAN UTAMA: ".
   - Tunjukkan empati mendalam atas perjuangan pemilik usaha.
   - Berikan penilaian klinis bisnis yang objektif dan realistis (tanpa bercanda konyol).
   - Tawarkan harapan realistis dan arah tindakan jangka pendek yang konkret.
7. **Insight Bisnis Mendalam (Insights)**: Buat 2-4 insight bisnis mendalam yang **didasarkan pada analisis hubungan silang antara minimal dua data input pengguna berikut: umur usaha, omzet bulanan, jumlah karyawan, masalah utama, atau target bisnis.** Jangan menulis insight generik layaknya tips bisnis blog umum, jangan mengulang keluhan/masalah utama, dan jangan mengulang rekomendasi. Insight harus memberikan 'Aha Moment' dengan menerangkan hubungan sebab-akibat antar metrik tersebut secara tajam.
   *Contoh*: 'Karena bisnis sudah berjalan lebih dari 5 tahun dan omzet relatif stabil, fokus utama seharusnya bukan mencari validasi pasar, tetapi membangun sistem yang dapat direplikasi saat ekspansi.'
8. **Validasi Kualitas Informasi Pengguna (SANGAT PENTING)**
    Sebelum melakukan diagnosis, nilai kualitas informasi yang diberikan pengguna.
    Kategori:
    - Tinggi
    - Sedang
    - Rendah
    Anggap kualitas informasi RENDAH apabila:
    - Masalah utama terlalu pendek
    - Banyak karakter berulang atau pola seperti "aaa", "eee", "test", "123"
    - Tidak menjelaskan kondisi bisnis secara nyata
    - Tantangan spesifik tidak memberikan konteks yang cukup
    Jika kualitas informasi RENDAH:
    - Jangan membuat asumsi detail.
    - Jangan mengarang akar masalah.
    - Jangan membuat insight yang terlalu spesifik.
    - Jangan berpura-pura mengetahui penyebab bisnis.
    Sebaliknya:
    - Jelaskan bahwa data belum cukup.
    - Berikan rekomendasi untuk memperjelas masalah.
    - Turunkan confidence score secara signifikan.
    Berikan respons Anda dalam format JSON terstruktur yang valid sesuai dengan skema yang diminta.

    Confidence Score:
    - 90-100 = Data lengkap dan sangat spesifik
    - 70-89 = Data cukup jelas
    - 40-69 = Beberapa informasi kurang jelas
    - 0-39 = Informasi sangat minim atau ambigu

    ATURAN EMAS:
    Jika sebuah kesimpulan tidak dapat ditelusuri langsung ke data pengguna,
    maka kesimpulan tersebut tidak boleh ditulis sebagai fakta.
    Gunakan:
    "Kemungkinan..."
    "Perlu diperiksa lebih lanjut..."
    "Belum terdapat cukup data untuk memastikan..."

    Jangan pernah menulis:
    "Anda mengalami..."
    "Penyebabnya adalah..."
    "Karyawan Anda..."
    "Operasional Anda..."

    kecuali pengguna menyatakan hal tersebut secara eksplisit.
    
  9. **PERILAKU SAAT DATA QUALITY RENDAH (WAJIB)**
    Jika dataQuality = "rendah" atau confidenceScore < 40:

    - Jangan membuat insight bisnis spesifik.
    - Jangan membuat akar masalah spesifik.
    - Jangan membuat analisis operasional spesifik.
    - Jangan membuat asumsi tentang pelanggan, stok, pemasaran, SDM, keuangan, atau proses bisnis.
    - Jangan menyebut kemungkinan penyebab yang tidak berasal dari data pengguna.

    Sebagai gantinya:

    Insights harus berisi:
    "Belum tersedia informasi yang cukup untuk menghasilkan insight bisnis yang akurat."

    Causes harus berisi:
    "Belum tersedia data yang cukup untuk mengidentifikasi akar masalah utama."

    Recommendations harus fokus pada:
    - memperjelas masalah
    - mengumpulkan data bisnis
    - menjelaskan kondisi usaha lebih rinci

    Action Plan harus berupa:
    - panduan mengumpulkan informasi
    - panduan mendokumentasikan masalah
    - panduan melakukan evaluasi kondisi usaha

    Jangan pernah berpura-pura mengetahui kondisi bisnis jika data tidak mencukupi.
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
              description:
                "Skor kesehatan bisnis antara 0 (kritis) sampai 100 (sehat bugar).",
            },
            healthStatus: {
              type: "string",
              enum: ["sehat", "perlu-perhatian", "kritis"],
              description:
                "Kategori status kesehatan usaha. Skor 70-100: sehat. Skor 40-69: perlu-perhatian. Skor 0-39: kritis.",
            },
            confidenceScore: {
              type: "integer",
              description:
                "Tingkat keyakinan AI terhadap diagnosis berdasarkan kualitas data pengguna. Nilai 0-100.",
            },
            dataQuality: {
              type: "string",
              enum: ["tinggi", "sedang", "rendah"],
            },
            urgency: {
              type: "string",
              enum: ["rendah", "sedang", "tinggi", "kritis"],
              description: "Tingkat kedaruratan penanganan keluhan bisnis.",
            },
            summary: {
              type: "string",
              description:
                "Ringkasan kondisi kesehatan bisnis dalam bahasa Indonesia yang ramah, sopan, dan hangat.",
            },
            verdict: {
              type: "string",
              description:
                "Pernyataan verdict/vonis dokter bisnis yang didahului dengan kalimat 'HASIL PEMERIKSAAN UTAMA:'. Menjelaskan penyakit utama bisnis beserta solusinya dalam bahasa yang hangat dan profesional.",
            },
            insights: {
              type: "array",
              items: { type: "string" },
              description:
                "Daftar 2-4 insight bisnis mendalam yang tidak mengulang masalah utama atau rekomendasi, menjelaskan pola tersembunyi, akar masalah sebenarnya, peluang baru, atau prioritas tindakan.",
            },
            strengths: {
              type: "array",
              items: { type: "string" },
              description:
                "Daftar 2-3 aspek positif atau kekuatan bisnis yang teridentifikasi untuk memotivasi pemilik usaha.",
            },
            causes: {
              type: "array",
              items: { type: "string" },
              description:
                "Daftar 3-5 akar masalah potensial (gejala penyakit) yang dialami bisnis.",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Daftar 4-6 obat/resep rekomendasi praktis jangka pendek yang harus segera dikerjakan.",
            },
            actionPlan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  week: {
                    type: "integer",
                    description: "Nomor minggu rencana aksi, mulai 1 sampai 3.",
                  },
                  title: {
                    type: "string",
                    description: "Fokus tema pemulihan pada minggu tersebut.",
                  },
                  tasks: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Daftar 2-4 langkah aksi harian/praktis yang harus dikerjakan pada minggu tersebut.",
                  },
                },
                required: ["week", "title", "tasks"],
              },
              description:
                "Panduan terperinci per minggu (Rencana Aksi 3 minggu).",
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

    // Validate structure matches requirements
    const finalResult: Omit<DiagnosisResult, "id"> = {
      summary: aiResult.summary || "",
      urgency: aiResult.urgency || "sedang",
      healthScore: Number(aiResult.healthScore) || 50,
      healthStatus: aiResult.healthStatus || "perlu-perhatian",
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
    const dbId = await saveDiagnosis(consultationData, finalResult, userId || "anonymous");

    const finalResultWithId: DiagnosisResult = {
      ...finalResult,
      id: dbId,
    };

    return finalResultWithId;
  } catch (error) {
    console.error("Diagnosis Error:", error);

    const message =
      error instanceof Error ? error.message : String(error);

    // Supabase save failure
    if (
      message.includes("gagal disimpan") ||
      message.includes("insert") ||
      message.includes("database") ||
      message.includes("Supabase")
    ) {
      throw new Error("Diagnosis gagal disimpan. Silakan coba kembali.");
    }

    // Gemini overload
    if (
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.includes("high demand")
    ) {
      throw new Error(
        "Dokter AI sedang melayani banyak konsultasi saat ini. Silakan coba lagi dalam beberapa menit.",
      );
    }

    // Rate limit
    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      throw new Error(
        "Permintaan konsultasi sedang sangat ramai. Mohon tunggu beberapa saat sebelum mencoba kembali.",
      );
    }

    // API Key salah
    if (message.includes("API_KEY") || message.includes("API key")) {
      throw new Error(
        "Sistem diagnosis sedang dalam pemeliharaan. Silakan hubungi administrator.",
      );
    }

    // Koneksi / server / network
    if (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("ECONNRESET") ||
      message.includes("ETIMEDOUT")
    ) {
      throw new Error(
        "Gagal terhubung ke server. Periksa koneksi internet Anda.",
      );
    }

    // Fallback
    throw new Error(
      "Terjadi kendala saat membuat hasil diagnosis. Silakan coba kembali beberapa saat lagi.",
    );
  }
}
