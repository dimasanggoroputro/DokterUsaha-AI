import Link from "next/link";
import {
  Stethoscope,
  ClipboardList,
  Activity,
  HeartPulse,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Star,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";

const consultationSteps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Isi Gejala Usaha",
    description:
      "Ceritakan kondisi operasional, tantangan harian, dan omzet usaha Anda melalui form konsultasi sederhana tanpa istilah teknis yang rumit.",
    tag: "Form singkat · 3 menit",
    accent: "bg-primary/20 border-t-primary",
    tagColor: "bg-primary/10 text-primary-foreground",
    iconBg: "bg-primary",
  },
  {
    step: "02",
    icon: Activity,
    title: "Analisis Kesehatan",
    description:
      "Dokter Bisnis AI memeriksa keluhan Anda, menghitung Skor Kesehatan usaha, dan mengidentifikasi akar masalah yang sedang terjadi.",
    tag: "Diagnosa otomatis",
    accent: "bg-secondary/30 border-t-secondary",
    tagColor: "bg-secondary/40 text-secondary-foreground",
    iconBg: "bg-secondary",
  },
  {
    step: "03",
    icon: HeartPulse,
    title: "Terima Resep Aksi",
    description:
      "Dapatkan rekomendasi dan panduan rencana aksi konkret langkah demi langkah setiap minggu untuk memulihkan usaha Anda.",
    tag: "Solusi mingguan",
    accent: "bg-success/20 border-t-success",
    tagColor: "bg-success/20 text-success-foreground",
    iconBg: "bg-success/20",
  },
];

const stats = [
  { num: "2.400+", label: "UMKM terbantu", icon: Users },
  { num: "92%", label: "Kepuasan mitra", icon: Star },
  { num: "3 mnt", label: "Waktu check-up", icon: Clock },
];

const testCases = [
  {
    role: "Pemilik Rumah Makan",
    quote:
      "Omzet sempat turun 30% karena ada saingan baru. Setelah konsultasi, saya ikuti resep dokter untuk membuat paket bundling dan mendaftar ojek online. Pelanggan lama mulai kembali!",
    name: "Ibu Hartati",
    business: "Warung Nasi Sedap",
    initial: "I",
    avatarBg: "bg-primary",
  },
  {
    role: "Penjual Kelontong",
    quote:
      "Uang kas sering selisih terus. Dokter mendiagnosa kebocoran kas akibat campur uang pribadi. Resep pisah dompet dan pasang WhatsApp Business sangat menolong usaha saya.",
    name: "Pak Bambang",
    business: "Toko Kelontong Berkah",
    initial: "P",
    avatarBg: "bg-success",
  },
];

export default function HomePage() {
  return (
    <PageContainer className="flex flex-col gap-16 py-10">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 gap-10 items-center w-full max-w-4xl mx-auto px-2">
        {/* Left: copy */}
        <div className="flex flex-col gap-5">
          <div className="self-start flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary-foreground">
            <Sparkles className="size-3 animate-pulse" />
            Dokter Bisnis Digital Terpercaya
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-snug tracking-tight text-foreground">
            Usaha Anda <span className="text-[#a5d6fa]">Berhak Sehat</span> &
            Tumbuh
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
            Ceritakan keluhan usaha Anda, dapatkan diagnosa instan, dan resep
            solusi konkret setiap minggu — seperti punya dokter bisnis pribadi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/diagnosis">
              <Button
                size="lg"
                className="gap-2 px-7 text-xs font-bold w-full sm:w-auto"
              >
                <Stethoscope className="size-4" />
                Mulai Konsultasi
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="px-7 text-xs font-bold w-full sm:w-auto"
              >
                Buka Rekam Medis
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-5 pt-2">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  {s.num}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: health card visual */}
        <div className="relative flex items-center justify-center min-h-[240px]">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-4 w-20 h-20 rounded-full bg-primary/20 pointer-events-none" />
          <div className="absolute bottom-4 right-8 w-10 h-10 rounded-full bg-success/30 pointer-events-none" />

          {/* Main card */}
          <Card className="w-[210px] border border-border/60 shadow-md z-10">
            <CardContent className="p-5 flex flex-col gap-3">
              <p className="text-[10px] text-muted-foreground">
                Skor Kesehatan Usaha
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">72</span>
                <span className="text-sm text-muted-foreground font-normal">
                  / 100
                </span>
              </div>
              {/* Score bar */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[72%] rounded-full bg-primary transition-all" />
              </div>
              <div className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                <TrendingUp className="size-3" />
                Naik 12 poin bulan ini
              </div>
            </CardContent>
          </Card>

          {/* Floating pills */}
          <div className="absolute top-2 right-0 flex items-center gap-1.5 bg-background border border-border/60 rounded-xl px-3 py-2 shadow-sm text-[11px] font-medium text-foreground z-20">
            <div className="flex size-5 items-center justify-center rounded-md bg-success/20">
              <CheckCircle2 className="size-3 text-green-600" />
            </div>
            Resep dikirim
          </div>

          <div className="absolute bottom-12 right-[-8px] flex items-center gap-1.5 bg-background border border-border/60 rounded-xl px-3 py-2 shadow-sm text-[11px] font-medium text-foreground z-20">
            <div className="flex size-5 items-center justify-center rounded-md bg-warning/30">
              <AlertCircle className="size-3 text-amber-600" />
            </div>
            Arus kas perlu perhatian
          </div>

          <div className="absolute bottom-2 left-[-8px] flex items-center gap-1.5 bg-background border border-border/60 rounded-xl px-3 py-2 shadow-sm text-[10px] font-medium text-foreground z-20">
            <div className="flex size-5 items-center justify-center rounded-md bg-primary/20">
              <Clock className="size-3 text-primary-foreground" />
            </div>
            Check-up minggu ini
          </div>
        </div>
      </section>

      {/* ── STEPS ────────────────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-2">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-2">
            Cara Kerja
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            3 Langkah Menuju Usaha Sehat
          </h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Metode check-up praktis untuk UMKM, toko kecil, dan usaha digital
            yang ingin bertumbuh.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {consultationSteps.map((item, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-t-2 ${item.accent} group hover:shadow-md transition-shadow duration-200`}
            >
              <span className="absolute right-4 top-2 text-5xl font-black text-muted-foreground/[0.07] select-none leading-none">
                {item.step}
              </span>
              <CardContent className="p-6 flex flex-col gap-3">
                <div
                  className={`flex size-9 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <item.icon className="size-4 text-foreground" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span
                  className={`self-start mt-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.tagColor}`}
                >
                  {item.tag}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-2">
        <div className="bg-foreground rounded-2xl p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="self-center md:self-start inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-1">
              <Sparkles className="size-2.5" />
              Gratis, tanpa daftar akun
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-background leading-snug">
              Siap Check-Up Pertama?
            </h3>
            <p className="text-xs text-background/60 leading-relaxed max-w-sm">
              Hanya 3 menit. Temukan letak kendala usaha Anda dan cara
              mengobatinya sekarang juga.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Link href="/diagnosis" className="w-full md:w-auto">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 text-xs font-bold w-full"
              >
                Mulai Check-Up
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <span className="text-[10px] text-background/40">
              Tanpa biaya · Tanpa daftar akun
            </span>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-2 pb-4">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-2">
            Kisah Mitra
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Mereka Sudah Merasakannya
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            UMKM yang telah memulihkan kesehatan usahanya bersama DokterUsaha.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {testCases.map((tc, idx) => (
            <Card key={idx} className="border-border/40 bg-muted/10">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-5">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs italic text-muted-foreground leading-relaxed font-serif flex-1">
                  &quot;{tc.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tc.avatarBg} text-[11px] font-bold text-background`}
                  >
                    {tc.initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {tc.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {tc.business} · {tc.role}
                    </p>
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
