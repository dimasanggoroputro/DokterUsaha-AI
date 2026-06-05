import Link from "next/link";
import {
  Stethoscope,
  ClipboardList,
  Activity,
  HeartPulse,
  ArrowRight,
  Sparkles,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";

const consultationSteps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Isi Gejala Usaha",
    description:
      "Ceritakan kondisi operasional, tantangan harian, dan omzet usaha Anda melalui form konsultasi sederhana tanpa istilah teknis yang rumit.",
  },
  {
    step: "02",
    icon: Activity,
    title: "Analisis Kesehatan",
    description:
      "Dokter Bisnis AI akan memeriksa keluhan Anda, menghitung Skor Kesehatan usaha, dan mengidentifikasi akar masalah yang sedang terjadi.",
  },
  {
    step: "03",
    icon: HeartPulse,
    title: "Terima Resep Aksi",
    description:
      "Dapatkan resep rekomendasi penyembuhan serta panduan rencana aksi konkret langkah-demi-langkah per minggu untuk memulihkan usaha Anda.",
  },
];

const testCases = [
  {
    role: "Pemilik Rumah Makan",
    quote:
      "Omzet sempat turun 30% karena ada saingan baru. Setelah konsultasi, saya ikuti resep dokter untuk membuat paket bundling dan mendaftar ojek online. Pelanggan lama mulai kembali!",
    name: "Ibu Hartati",
    business: "Warung Nasi Sedap",
  },
  {
    role: "Penjual Kelontong",
    quote:
      "Uang kas sering selisih terus. Dokter mendiagnosa kebocoran kas akibat campur uang pribadi. Resep pisah dompet dan pasang WhatsApp Business sangat menolong usaha saya.",
    name: "Pak Bambang",
    business: "Toko Kelontong Berkah",
  },
];

export default function HomePage() {
  return (
    <PageContainer className="flex flex-col items-center gap-16 py-10">
      {/* Hero Section */}
      <section className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="size-3 text-primary animate-pulse" />
          Dokter Bisnis Digital Terpercaya
        </div>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Jaga Usaha Anda Tetap{" "}
          <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
            Sehat & Bugar
          </span>
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Sama seperti tubuh manusia, bisnis juga butuh pemeriksaan berkala.
          Ceritakan keluhan operasional atau keuangan Anda, dapatkan diagnosa
          instan, dan terima resep solusi per minggu untuk pemulihan usaha.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row w-full justify-center sm:w-auto">
          <Link href="/diagnosis" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full gap-2 px-8 text-xs font-bold shadow-sm"
            >
              Mulai Konsultasi Gratis
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full px-8 text-xs font-bold"
            >
              Buka Rekam Medis
            </Button>
          </Link>
        </div>
      </section>

      {/* Consultation Steps Section */}
      <section className="w-full">
        <div className="mb-10 text-center">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
            3 Langkah Mudah Menuju Usaha Sehat
          </h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Metode check-up praktis yang dirancang untuk UMKM mandiri, toko
            kecil, dan usaha digital yang ingin bertumbuh.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {consultationSteps.map((item, index) => (
            <Card
              key={index}
              className="border-border/50 shadow-sm relative overflow-hidden group hover:border-border transition-all duration-200"
            >
              <span className="absolute right-4 top-2 text-3xl font-black text-muted-foreground/10 select-none">
                {item.step}
              </span>
              <CardHeader className="pb-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <item.icon className="size-4.5" />
                </div>
                <CardTitle className="text-sm font-bold mt-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dynamic Diagnostic Simulator Callout */}
      <section className="w-full max-w-3xl">
        <Card className="border-primary/20 bg-primary/[0.01] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 rounded-full bg-primary/[0.02] flex items-center justify-center pointer-events-none select-none">
            <Stethoscope className="size-16 text-primary/5" />
          </div>
          <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Heart className="size-6 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h3 className="text-base font-bold text-foreground sm:text-lg">
                Siap Melakukan Check-Up Pertama?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hanya butuh 3 menit. Tanpa biaya, tanpa daftar akun rumit. Mari
                cari tahu di mana letak kendala usaha Anda dan temukan obatnya.
              </p>
            </div>
            <Link
              href="/diagnosis"
              className="w-full md:w-auto shrink-0 mt-2 md:mt-0"
            >
              <Button size="default" className="w-full gap-2 text-xs font-bold">
                Mulai Check-up
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Supportive Testimonials (Connection builder) */}
      <section className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h3 className="text-base font-bold text-foreground">
            Kisah Sukses Mitra UMKM
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Mereka yang telah memulihkan kesehatan usahanya bersama DokterUsaha
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {testCases.map((tc, idx) => (
            <Card key={idx} className="border-border/40 bg-muted/20">
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <p className="text-xs italic text-muted-foreground/90 leading-relaxed font-serif">
                  "{tc.quote}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {tc.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                      {tc.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {tc.business} • {tc.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
