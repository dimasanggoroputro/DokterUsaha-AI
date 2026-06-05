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
import { ConsultationData, DiagnosisResult } from "@/types/diagnosis";

const getMockDiagnosis = (
  consultation: ConsultationData | null,
): DiagnosisResult => {
  const businessName = consultation?.businessName || "Bisnis Anda";
  const businessType = consultation?.businessType || "makanan";

  // Custom critical detection logic for dynamic feel
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
      verdict: `HASIL PEMERIKSAAN UTAMA: Usaha Anda terdiagnosis mengalami 'Dehidrasi Likuiditas' akut. Aliran kas keluar lebih deras dibanding arus kas masuk, diperparah oleh tekanan persaingan pasar yang ketat. Anda harus segera memisahkan uang bisnis dengan uang pribadi, menunda belanja modal non-esensial, serta merumuskan penawaran likuidasi stok lambat demi menyuntikkan kas segar dalam 48 jam ke depan.`,
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
      verdict: `HASIL PEMERIKSAAN UTAMA: Dokter mendeteksi gejala 'Kelesuan Trafik Pembeli'. Hal ini umum terjadi akibat munculnya opsi makanan alternatif yang lebih murah di sekitar Anda. Tenang, pondasi bisnis Anda masih kokoh. Dokter menyarankan aktivasi promo loyalitas kecil, penyempurnaan kebersihan area makan, dan pendaftaran ke ekosistem ojek online untuk membuka pintu penjualan baru.`,
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

  // Default fallback for retail/services/other
  return {
    id: "diag-default",
    summary: `Bisnis retail/jasa ${businessName} Anda terindikasi mengalami gejala penyusutan margin laba akibat fluktuasi musiman dan pencatatan kas yang belum tertib.`,
    urgency: "sedang",
    healthScore: 72,
    healthStatus: "sehat",
    verdict: `HASIL PEMERIKSAAN UTAMA: Hasil pemeriksaan klinis menunjukkan bisnis dalam keadaan 'Cukup Bugar' namun rawan terhadap kebocoran kas kecil. Dokter menyarankan pendisiplinan pencatatan keuangan harian, pemisahan uang pribadi, dan penataan ulang display toko untuk merangsang pembelian impulsif dari pelanggan yang datang.`,
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
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  sedang: {
    label: "Sedang",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  tinggi: {
    label: "Tinggi",
    className: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  },
  kritis: {
    label: "Kritis",
    className: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

export default function ResultPage() {
  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null,
  );
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem("dokterusaha_consultation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConsultationData;
        setConsultation(parsed);
        setResult(getMockDiagnosis(parsed));
      } catch (e) {
        console.error(e);
        setResult(getMockDiagnosis(null));
      }
    } else {
      setResult(getMockDiagnosis(null));
    }
    setIsLoading(false);
  }, []);

  if (isLoading || !result) {
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

  const urgency = urgencyConfig[result.urgency];

  return (
    <PageContainer maxWidth="sm">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-border/40 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <HeartPulse className="size-4 text-primary" />
              Hasil Pemeriksaan Bisnis
            </div>
            <Badge variant="outline" className={urgency.className}>
              Tingkat Urgensi: {urgency.label}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {consultation?.businessName
              ? `Resep Solusi: ${consultation.businessName}`
              : "Hasil Diagnosa Bisnis"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Tanggal Pemeriksaan: {result.createdAt}
          </p>
        </div>

        {/* Health Score Ring (Top Section) */}
        <HealthScoreRing
          score={result.healthScore}
          status={result.healthStatus}
        />

        {/* Dedicated Doctor Verdict Card (Formal Prescriptive styling) */}
        <Card className="border-primary/20 bg-primary/[0.01] relative overflow-hidden">
          {/* Decorative stamp-like border */}
          <div className="absolute top-0 right-0 w-24 h-24 -mt-6 -mr-6 rounded-full border-4 border-primary/5 flex items-center justify-center rotate-12 pointer-events-none select-none">
            <span className="text-[10px] font-black text-primary/5 uppercase tracking-widest">
              DIAGNOSED
            </span>
          </div>

          <CardHeader className="pb-3 border-b border-dashed border-border">
            <div className="flex items-center gap-2">
              <Stethoscope className="size-5 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                Verdiksi Klinis Dokter Bisnis
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Catatan diagnosa medis profesional atas keluhan usaha Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-sm leading-relaxed font-serif text-foreground/90 italic">
            "{result.verdict}"
            <div className="mt-4 flex items-center justify-between not-italic font-sans text-xs text-muted-foreground/70">
              <span>Dr. DokterUsaha AI</span>
              <span className="border-t border-muted-foreground/30 pt-1 px-4 text-center">
                Tanda Tangan Digital AI
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
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

        {/* Potential Causes Cards */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <AlertTriangle className="size-4 text-amber-500" />
              Penyebab Potensial (Akar Masalah)
            </CardTitle>
            <CardDescription className="text-xs">
              Faktor-faktor yang teridentifikasi memperburuk kesehatan usaha
              Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {result.causes.map((cause, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-amber-500/10 bg-amber-500/[0.01] p-3 text-xs"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-muted-foreground">
                  {cause}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations Cards */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Lightbulb className="size-4 text-emerald-500" />
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
                className="flex items-start gap-2.5 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.01] p-3 text-xs"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-muted-foreground">
                  {rec}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Timeline Action Plan */}
        <ActionPlanTimeline timeline={result.actionPlan} />

        <Separator />

        {/* Navigation Actions */}
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
