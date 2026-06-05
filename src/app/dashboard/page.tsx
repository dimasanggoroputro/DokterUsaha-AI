import type { Metadata } from "next"
import {
  ClipboardList,
  Clock,
  Activity,
  Calendar,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/PageContainer"

export const metadata: Metadata = {
  title: "Rekam Medis Usaha",
  description: "Lihat riwayat check-up dan perkembangan resep solusi bisnis Anda.",
}

/** Patient health statistics */
const stats = [
  {
    label: "Total Check-up Usaha",
    value: "3",
    icon: ClipboardList,
    trend: "+1 bulan ini",
  },
  {
    label: "Gejala/Akar Masalah Terdeteksi",
    value: "12",
    icon: Activity,
    trend: "Rata-rata 4 per diagnosis",
  },
  {
    label: "Resep Solusi Diberikan",
    value: "15",
    icon: HeartPulse,
    trend: "Rata-rata 5 per diagnosis",
  },
]

/** Simulated medical history entries */
const recentConsultations = [
  {
    id: "1",
    businessName: "Bakso Pak Joko",
    problem: "Penjualan kuliner menurun 40% dalam 2 bulan terakhir karena kompetitor baru",
    urgency: "tinggi" as const,
    date: "2 Juni 2026",
    status: "perlu-perhatian" as const,
    score: 58,
  },
  {
    id: "2",
    businessName: "Toko Elektronik Maju",
    problem: "Pelanggan beralih belanja online, sepi pengunjung fisik",
    urgency: "sedang" as const,
    date: "28 Mei 2026",
    status: "perlu-perhatian" as const,
    score: 65,
  },
  {
    id: "3",
    businessName: "Warung Kopi Santai",
    problem: "Uang kas sering selisih meskipun pengunjung selalu ramai",
    urgency: "sedang" as const,
    date: "20 Mei 2026",
    status: "sehat" as const,
    score: 72,
  },
]

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
}

const statusConfig = {
  sehat: {
    label: "Bugar (Sehat)",
    className: "bg-emerald-500/10 text-emerald-700",
  },
  "perlu-perhatian": {
    label: "Rawat Jalan",
    className: "bg-amber-500/10 text-amber-700",
  },
  kritis: {
    label: "Gawat Darurat",
    className: "bg-rose-500/10 text-rose-700",
  },
}

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header with patient card styling */}
        <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Stethoscope className="size-4 text-primary" />
              Pusat Rekam Medis Usaha
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Dashboard Kesehatan UMKM
            </h1>
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali! Mari pantau kondisi vitalitas dan resep perbaikan usaha Anda.
            </p>
          </div>
          <Link href="/diagnosis">
            <Button size="lg" className="gap-2 text-xs">
              <ClipboardList className="size-4" />
              Konsultasi Baru
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <stat.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Medical History Card */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-4 text-primary" />
                  Lembar Riwayat Rekam Medis (Medical Records)
                </CardTitle>
                <CardDescription className="text-xs">
                  Daftar diagnosa klinis dan rekomendasi terapi usaha Anda sebelumnya
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {recentConsultations.length} Diagnosis
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-border/50">
              {recentConsultations.map((consultation) => {
                const urgency = urgencyConfig[consultation.urgency]
                const status = statusConfig[consultation.status]
                return (
                  <div
                    key={consultation.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {consultation.businessName}
                        </span>
                        <Badge
                          variant="outline"
                          className={urgency.className}
                        >
                          Urgensi: {urgency.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={status.className}
                        >
                          Status: {status.label} ({consultation.score}/100)
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                        "{consultation.problem}"
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Calendar className="size-3" />
                        Pemeriksaan dilakukan pada {consultation.date}
                      </div>
                    </div>
                    <Link href="/result" className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs w-full sm:w-auto"
                      >
                        Buka Resep
                        <ArrowRight className="size-3" strokeWidth={2.5} />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Supportive Medical Disclaimer */}
        <div className="flex items-center gap-2 justify-center rounded-lg border border-dashed border-border p-4 text-center">
          <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
          <p className="text-[10px] text-muted-foreground/80 max-w-md leading-relaxed">
            Data rekam medis tersimpan secara lokal dan dienkripsi untuk kerahasiaan bisnis Anda. Konsultasi berkala membantu menjaga vitalitas usaha Anda tetap bugar di tengah dinamika pasar.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
