"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  AlertTriangle,
  Lightbulb,
  FileText,
  ArrowLeft,
  ClipboardList,
  ArrowRight,
  HeartPulse,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from "@/components/layout/PageContainer";
import { HealthScoreRing } from "@/components/diagnosis/HealthScoreRing";
import { ActionPlanTimeline } from "@/components/diagnosis/ActionPlanTimeline";
import { DiagnosisConfidence } from "@/components/diagnosis/DiagnosisConfidence";
import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";

const getMockDiagnosis = (
  consultation: ConsultationData | null,
): DiagnosisResult => {
  const businessName = consultation?.businessName || "Bisnis Anda";
  const businessType = consultation?.businessType || "makanan";

  const isCritical =
    consultation?.mainProblem?.toLowerCase().includes("bangkrut") ||
    consultation?.mainProblem?.toLowerCase().includes("tutup") ||
    consultation?.mainProblem?.toLowerCase().includes("rugi besar") ||
    consultation?.monthlyRevenue === "kurang-dari-5jt";

  if (isCritical) {
    return {
      id: "diag-critical",
      summary: `Usaha ${businessName} Anda saat ini berada dalam fase darurat operasional. Penurunan pendapatan yang signifikan dipadukan dengan tantangan kas yang mendesak menuntut intervensi segera.`,
      urgency: "kritis",
      healthScore: 32,
      healthStatus: "kritis",
      confidenceScore: 95,
      dataQuality: "tinggi",
      verdict: `HASIL PEMERIKSAAN UTAMA: Usaha Anda terdiagnosis mengalami 'Dehidrasi Likuiditas' akut. Aliran kas keluar lebih deras dibanding arus kas masuk, diperparah oleh tekanan persaingan pasar yang ketat. Anda harus segera memisahkan uang bisnis dengan uang pribadi, menunda belanja modal non-esensial, serta merumuskan penawaran likuidasi stok lambat demi menyuntikkan kas segar dalam 48 jam ke depan.`,
      insights: [
        "Masalah terbesar usaha Anda kemungkinan bukan kurangnya modal, melainkan kebocoran kas harian akibat pencampuran keuangan pribadi.",
        "Mengurangi variasi produk lambat laku (slow-moving) akan langsung melepaskan kas yang terikat pada stok mati.",
      ],
      strengths: [
        "Memiliki kemauan kuat dari pemilik untuk melakukan perbaikan operasional secara mendasar",
        "Tujuan akhir bisnis terdefinisi dengan jelas",
      ],
      causes: [
        "Struktur pengeluaran harian tidak terkontrol dan mencampur keuangan pribadi",
        "Penurunan volume pelanggan harian di bawah titik impas (break-even point)",
        "Ketiadaan dana cadangan darurat untuk menyokong kebutuhan operasional harian",
        "Penumpukan barang modal/stok mati yang mengunci perputaran kas",
      ],
      recommendations: [
        "Hentikan sementara seluruh pengeluaran modal (renovasi, beli alat baru, dll) selama 14 hari",
        "Lakukan konversi stok mati menjadi kas dengan mengadakan promo cuci gudang / paket rugi",
        "Buat pemisahan kas fisik warung dengan dompet rumah tangga hari ini juga",
        "Minta keringanan tenor pembayaran kepada supplier langganan secara kekeluargaan",
      ],
      actionPlan: [
        {
          week: 1,
          title: "Tindakan Darurat Kas & Pemisahan Dompet",
          tasks: [
            "Buka rekening bank terpisah khusus usaha atau siapkan wadah kas terisolasi",
            "Tulis daftar seluruh sisa stok barang dan buat harga promo diskon 20-30% untuk menghabiskan stok mati",
            "Hitung biaya operasional mutlak mingguan (sewa, listrik, gaji) untuk 4 minggu ke depan",
          ],
        },
        {
          week: 2,
          title: "Negosiasi Supplier & Efisiensi Bahan",
          tasks: [
            "Hubungi supplier utama untuk menegosiasikan kelonggaran pembayaran bahan baku",
            "Kurangi variasi menu atau stok barang yang jarang dibeli, fokus hanya pada 3 produk terlaris",
            "Catat arus kas masuk harian dan laporkan di akhir hari",
          ],
        },
        {
          week: 3,
          title: "Restrukturisasi Harga & Penawaran Baru",
          tasks: [
            "Sesuaikan harga jual jika harga bahan baku naik, komunikasikan dengan ramah ke pelanggan",
            "Mulai tawarkan layanan pesan antar ojek online untuk menambah opsi orderan masuk",
            "Kaji ulang kondisi kas bersih setelah 14 hari pengetatan ikat pinggang",
          ],
        },
      ],
      createdAt: new Date().toLocaleDateString("id-ID"),
    };
  }

  if (businessType === "makanan") {
    return {
      id: "diag-food-1",
      summary: `Bisnis kuliner ${businessName} Anda menghadapi tantangan loyalitas pembeli dan persaingan harga. Omzet Anda terpengaruh oleh fluktuasi kedatangan pembeli baru serta kurangnya promosi aktif.`,
      urgency: "tinggi",
      healthScore: 58,
      healthStatus: "perlu-perhatian",
      confidenceScore: 95,
      dataQuality: "tinggi",
      verdict: `HASIL PEMERIKSAAN UTAMA: Dokter mendeteksi gejala 'Kelesuan Trafik Pembeli'. Hal ini umum terjadi akibat munculnya opsi makanan alternatif yang lebih murah di sekitar Anda. Tenang, pondasi bisnis Anda masih kokoh. Dokter menyarankan aktivasi promo loyalitas kecil, penyempurnaan kebersihan area makan, dan pendaftaran ke ekosistem ojek online untuk membuka pintu penjualan baru.`,
      insights: [
        "Sepinya pembeli kemungkinan besar terjadi karena munculnya kompetitor baru dengan harga lebih bersaing di dekat lokasi Anda.",
        "Pelanggan lama yang jarang kembali menunjukkan adanya penurunan kepuasan layanan atau kejenuhan menu yang belum Anda sadari.",
      ],
      strengths: [
        "Sektor bisnis makanan memiliki permintaan pasar harian yang stabil",
        "Sudah memiliki pemahaman produk yang baik",
      ],
      causes: [
        "Munculnya kompetitor kuliner baru yang menawarkan harga lebih murah atau promo gencar",
        "Kurangnya aktivitas promosi digital untuk menjangkau pelanggan baru di luar radius berjalan kaki",
        "Fluktuasi konsistensi kualitas porsi atau rasa hidangan",
        "Pelanggan lama mulai jenuh dengan variasi menu yang monoton",
      ],
      recommendations: [
        "Buat program kartu stamp loyalitas (beli 9 porsi gratis 1 porsi) untuk mengikat pelanggan tetap",
        "Segera daftarkan titik kuliner Anda ke minimal dua aplikasi pemesanan makanan online utama",
        "Pastikan resep porsi dan rasa dicatat tertulis agar koki/karyawan melayani secara konsisten",
        "Buat menu paket hemat (nasi + lauk + es teh) dengan harga coret untuk pembeli sensitif harga",
      ],
      actionPlan: [
        {
          week: 1,
          title: "Standardisasi Porsi & Riset Harga",
          tasks: [
            "Tulis takaran pasti untuk setiap piring (misalnya gramasi daging, takaran bumbu dasar)",
            "Lakukan survei kecil dengan mampir ke warung kompetitor untuk melihat menu dan harga mereka",
            "Siapkan kartu stamp sederhana (bisa diprint sendiri) untuk program loyalis pelanggan",
          ],
        },
        {
          week: 2,
          title: "Aktivasi Penjualan Digital & Kebersihan",
          tasks: [
            "Mulai proses registrasi merchant makanan online (siapkan KTP dan foto menu)",
            "Bersihkan dan tata ulang pencahayaan area depan warung agar terlihat cerah dan bersih",
            "Mulai bagikan kartu stamp loyalitas ke setiap pembeli dine-in",
          ],
        },
        {
          week: 3,
          title: "Peluncuran Promo & Menu Paket",
          tasks: [
            "Pasang spanduk kecil di depan warung bertuliskan menu paket hemat baru",
            "Bagikan brosur sederhana atau share menu ke grup WhatsApp RT/RW sekitar warung",
            "Evaluasi apakah ada peningkatan transaksi harian dari program loyalis",
          ],
        },
      ],
      createdAt: new Date().toLocaleDateString("id-ID"),
    };
  }

  return {
    id: "diag-default",
    summary: `Bisnis retail/jasa ${businessName} Anda terindikasi mengalami gejala penyusutan margin laba akibat fluktuasi musiman dan pencatatan kas yang belum tertib.`,
    urgency: "sedang",
    healthScore: 72,
    healthStatus: "sehat",
    confidenceScore: 90,
    dataQuality: "sedang",
    verdict: `HASIL PEMERIKSAAN UTAMA: Hasil pemeriksaan klinis menunjukkan bisnis dalam keadaan 'Cukup Bugar' namun rawan terhadap kebocoran kas kecil. Dokter menyarankan pendisiplinan pencatatan keuangan harian, pemisahan uang pribadi, dan penataan ulang display toko untuk merangsang pembelian impulsif dari pelanggan yang datang.`,
    insights: [
      "Meskipun penjualan Anda terlihat stabil, inefisiensi pada penataan display produk menghambat peluang transaksi impulsif tambahan.",
      "Pemberdayaan WhatsApp Business dapat melipatgandakan repeat order dari pelanggan lokal tanpa biaya iklan tambahan.",
    ],
    strengths: [
      "Struktur operasional yang fleksibel dan efisien",
      "Skor kesehatan umum berada dalam kategori Sehat",
    ],
    causes: [
      "Pencatatan kas keluar-masuk belum rapi sehingga laba bersih harian sulit dihitung pasti",
      "Display barang terlaris kurang menonjol di area pandang pembeli",
      "Belum mengoptimalkan pesan chat WhatsApp untuk melayani pelanggan lokal secara instan",
      "Pencampuran dana usaha dengan dana dompet pribadi",
    ],
    recommendations: [
      "Beli buku kas khusus atau unduh aplikasi pencatatan keuangan untuk warung",
      "Tata produk paling laku atau barang pelengkap di dekat kasir untuk merangsang belanja tambahan",
      "Gunakan WhatsApp Business dan cantumkan nomornya di etalase depan toko agar tetangga bisa memesan jarak jauh",
      "Ambil gaji bulanan tetap untuk diri Anda sendiri, jangan ambil kas warung secara acak",
    ],
    actionPlan: [
      {
        week: 1,
        title: "Disiplin Kas & Tata Ruang",
        tasks: [
          "Mulai mencatat setiap transaksi rupiah tanpa terkecuali pada buku kas terdedikasi",
          "Tata ulang rak pajangan, taruh produk promo di area pandang utama pembeli",
          "Pisahkan dompet pribadi dan laci uang warung fisik",
        ],
      },
      {
        week: 2,
        title: "WhatsApp Order & Penawaran Lokal",
        tasks: [
          "Unduh dan pasang profil usaha di WhatsApp Business",
          "Buat tulisan di etalase: 'Bisa Pesan Lewat WA & Kirim ke Rumah (Hubungi: 08xx...)'",
          "Tawarkan paket bundling produk pelengkap (contoh: detergen + pewangi dengan harga hemat)",
        ],
      },
      {
        week: 3,
        title: "Evaluasi Kas Mingguan",
        tasks: [
          "Hitung laba bersih warung setelah berjalan tertib selama 14 hari",
          "Identifikasi barang dagangan yang lambat berputar (slow moving) untuk dikurangi pemesanan berikutnya",
          "Tentukan nominal gaji tetap bulanan Anda agar tidak mengganggu kas utama warung",
        ],
      },
    ],
    createdAt: new Date().toLocaleDateString("id-ID"),
  };
};

const urgencyConfig = {
  rendah: {
    label: "Rendah",
    className: "bg-success/20 text-success-foreground border border-success-border/20 font-semibold",
  },
  sedang: {
    label: "Sedang",
    className: "bg-warning/20 text-warning-foreground border border-warning-border/20 font-semibold",
  },
  tinggi: {
    label: "Tinggi",
    className: "bg-warning/35 text-warning-foreground border border-warning-border/30 font-bold",
  },
  kritis: {
    label: "Kritis",
    className: "bg-destructive/20 text-destructive border border-destructive-border/20 font-bold",
  },
};

export default function ResultPage() {
  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null,
  );
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previousResult, setPreviousResult] = useState<DiagnosisResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const savedConsultation = localStorage.getItem("dokterusaha_consultation");
    const savedResult = localStorage.getItem("dokterusaha_result");

    if (savedConsultation) {
      try {
        setConsultation(JSON.parse(savedConsultation) as ConsultationData);
      } catch (e) {
        console.error(e);
      }
    }

    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult) as DiagnosisResult);
      } catch (e) {
        console.error(e);
        setResult(null);
      }
    }

    // Batch 3 — Comparison score
    const historyRaw = localStorage.getItem("dokterusaha_history");
    if (historyRaw) {
      try {
        const history = JSON.parse(historyRaw);
        if (history.length >= 2) {
          setPreviousResult(history[1].diagnosisResult);
        }
      } catch {
        // ignore
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <PageContainer maxWidth="sm">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
          <Activity className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Memuat diagnosis klinis bisnis...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer maxWidth="sm">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <Stethoscope className="size-12 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-bold">Belum Ada Hasil Diagnosis</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Anda belum melakukan pemeriksaan kesehatan bisnis.
              </p>
            </div>
            <Link href="/diagnosis">
              <Button>Mulai Diagnosis</Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const urgency = urgencyConfig[result.urgency];

  return (
    <PageContainer maxWidth="sm">
      <div className="flex flex-col gap-6">
        {/* Premium Title Header Banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 text-slate-900 shadow-sm border border-[#A5D6FA]/30">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003647]/70">
                <HeartPulse className="size-4 text-[#003647]" />
                Hasil Pemeriksaan Bisnis
              </div>
              <Badge className={urgency.className}>
                Tingkat Urgensi: {urgency.label}
              </Badge>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#002D54] sm:text-3xl">
              {consultation?.businessName
                ? `Resep Solusi: ${consultation.businessName}`
                : "Hasil Diagnosa Bisnis"}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#003647]/70 font-semibold">
              Tanggal Pemeriksaan: {result.createdAt}
            </p>
          </div>
        </div>

        {/* Health Score Ring */}
        <HealthScoreRing
          score={result.healthScore}
          status={result.healthStatus}
        />

        {/* Diagnosis Confidence */}
        <DiagnosisConfidence
          score={result.confidenceScore}
          quality={result.dataQuality}
        />

        {/* Prioritas 48 Jam Kedepan */}
        <Card className="border-destructive-border/30 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-destructive">
              ⚡ Prioritas 48 Jam Kedepan
            </CardTitle>
            <CardDescription className="text-xs">
              Fokus pada langkah berikut terlebih dahulu sebelum menjalankan
              seluruh rencana aksi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-lg border border-destructive-border/20 bg-card p-3 shadow-sm"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white shadow-sm">
                  {index + 1}
                </div>
                <p className="text-xs leading-relaxed text-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Verdiksi Klinis */}
        <Card className="border-primary-border/40 bg-primary/10 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 -mt-6 -mr-6 rounded-full border-4 border-primary/10 flex items-center justify-center rotate-12 pointer-events-none select-none">
            <span className="text-[10px] font-black text-primary-foreground/15 uppercase tracking-widest">
              DIAGNOSED
            </span>
          </div>
          <CardHeader className="pb-3 border-b border-dashed border-primary-border/30">
            <div className="flex items-center gap-2">
              <Stethoscope className="size-5 text-primary-foreground" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary-foreground">
                Verdiksi Klinis Dokter Bisnis
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-primary-foreground/70">
              Catatan diagnosa medis profesional atas keluhan usaha Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm leading-relaxed font-serif text-primary-foreground italic">
            "{result.verdict}"
            <div className="mt-4 flex items-center justify-between not-italic font-sans text-xs text-primary-foreground/80">
              <span className="font-bold">Dr. DokterUsaha AI</span>
              <span className="border-t border-primary-foreground/30 pt-1 px-4 text-center">
                Tanda Tangan Digital AI
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4 text-muted-foreground" />
              Ringkasan Analisis Keluhan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.summary}
            </p>
          </CardContent>
        </Card>

        {/* Insights */}
        {result.insights && result.insights.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-bold text-secondary-foreground">
                <Lightbulb className="size-4 text-secondary-foreground" />
                <span>Insight DokterUsaha AI</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Temuan penting yang mungkin belum Anda sadari dari kondisi usaha Anda.
              </p>
            </div>
            <div className="grid gap-2">
              {result.insights.map((insight, index) => (
                <Card
                  key={index}
                  className="border-secondary-border/30 bg-secondary/15 shadow-sm"
                >
                  <CardContent className="p-3 text-xs leading-relaxed text-foreground/90">
                    <span className="font-extrabold text-secondary-foreground mr-1.5">
                      Analisis #{index + 1}:
                    </span>
                    {insight}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {result.strengths && result.strengths.length > 0 && (
          <Card className="border-success-border/30 bg-success/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-success-foreground">
                <CheckCircle2 className="size-4 text-success-foreground" />
                Kekuatan Usaha Anda
              </CardTitle>
              <CardDescription className="text-xs">
                Aspek positif dan potensi terkuat dari bisnis Anda saat ini
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {result.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 rounded-lg border border-success-border/10 bg-success/10 p-3 text-xs"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-[10px] font-bold text-success-foreground">
                    ✓
                  </span>
                  <span className="pt-0.5 leading-relaxed text-foreground/80">
                    {strength}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Causes */}
        <Card className="border-warning-border/30 bg-warning/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-warning-foreground">
              <AlertTriangle className="size-4 text-warning-foreground" />
              Penyebab Potensial (Akar Masalah)
            </CardTitle>
            <CardDescription className="text-xs">
              Faktor-faktor yang teridentifikasi memperburuk kesehatan usaha Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {result.causes.map((cause, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-warning-border/10 bg-warning/10 p-3 text-xs"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/20 text-[10px] font-bold text-warning-foreground">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-foreground/80">
                  {cause}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-success-border/30 bg-success/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-success-foreground">
              <Lightbulb className="size-4 text-success-foreground" />
              Rekomendasi Terapi (Resep Dokter)
            </CardTitle>
            <CardDescription className="text-xs">
              Tindakan penyembuhan langsung yang disarankan untuk diterapkan
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-success-border/10 bg-success/10 p-3 text-xs"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-[10px] font-bold text-success-foreground">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-foreground/80">
                  {rec}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Batch 3 — Comparison Score */}
        {previousResult &&
          (() => {
            const scoreDiff = result.healthScore - previousResult.healthScore;
            return (
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold">
                    <Activity className="size-4 text-primary" />
                    Perbandingan Pemeriksaan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Perkembangan skor kesehatan usaha Anda dibanding pemeriksaan
                    sebelumnya
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Sebelumnya
                    </span>
                    <span className="text-2xl font-bold text-muted-foreground">
                      {previousResult.healthScore}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <span
                      className={`text-2xl font-black ${scoreDiff > 0 ? "text-success-foreground" : scoreDiff < 0 ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {scoreDiff > 0
                        ? "↑ Membaik"
                        : scoreDiff < 0
                          ? "↓ Menurun"
                          : "Tidak berubah"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      Sekarang
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {result.healthScore}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

        {/* Timeline Action Plan */}
        <ActionPlanTimeline timeline={result.actionPlan} />

        <Separator />

        {/* Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/diagnosis" className="flex-1">
            <Button
              variant="outline"
              size="default"
              className="w-full gap-2 text-xs"
            >
              <ClipboardList className="size-4" />
              Konsultasi Ulang
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button size="default" className="w-full gap-2 text-xs">
              Dashboard Usaha
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <Link href="/" className="mx-auto mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Kembali ke Halaman Utama
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
