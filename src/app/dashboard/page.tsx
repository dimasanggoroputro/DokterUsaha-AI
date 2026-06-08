"use client"

import { useEffect, useState } from "react"
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
}

const statusConfig = {
  sehat: {
    label: "Bugar (Sehat)",
    className: "bg-success/20 text-success-foreground border border-success-border/20 font-semibold",
  },
  "perlu-perhatian": {
    label: "Rawat Jalan",
    className: "bg-warning/20 text-warning-foreground border border-warning-border/20 font-semibold",
  },
  kritis: {
    label: "Gawat Darurat",
    className: "bg-destructive/20 text-destructive border border-destructive-border/20 font-bold",
  },
}

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([])
  const [latestCheck, setLatestCheck] = useState<any | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("dokterusaha_history")
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      setHistory(parsed)
      if (parsed && parsed.length > 0) {
        setLatestCheck(parsed[0])
      }
    } catch {
      setHistory([])
    }
  }, [])

  // Batch 2.3 — Statistik dinamis
  const totalDiagnosis = history.length
  const totalCauses = history.reduce(
    (acc, item) => acc + (item.diagnosisResult?.causes?.length ?? 0),
    0
  )
  const totalRecommendations = history.reduce(
    (acc, item) => acc + (item.diagnosisResult?.recommendations?.length ?? 0),
    0
  )

  const stats = [
    {
      label: "Total Check-up Usaha",
      value: totalDiagnosis.toString(),
      icon: ClipboardList,
      trend: totalDiagnosis > 0 ? `+1 terbaru` : "Belum ada diagnosis",
    },
    {
      label: "Gejala/Akar Masalah Terdeteksi",
      value: totalCauses.toString(),
      icon: Activity,
      trend:
        totalDiagnosis > 0
          ? `Rata-rata ${Math.round(totalCauses / totalDiagnosis)} per diagnosis`
          : "-",
    },
    {
      label: "Resep Solusi Diberikan",
      value: totalRecommendations.toString(),
      icon: HeartPulse,
      trend:
        totalDiagnosis > 0
          ? `Rata-rata ${Math.round(totalRecommendations / totalDiagnosis)} per diagnosis`
          : "-",
    },
  ]

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Dashboard Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C6E7FF] to-[#D4F6FF] p-6 sm:p-8 text-slate-900 shadow-sm border border-[#A5D6FA]/30">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5 max-w-xl text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#003647]/70">
                <Stethoscope className="size-4 text-[#003647]" />
                Pusat Rekam Medis Usaha
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-[#002D54]">
                Dashboard Kesehatan UMKM
              </h1>
              <p className="text-xs sm:text-sm text-[#003647]/80 font-medium leading-relaxed">
                Selamat datang kembali! Mari pantau kondisi vitalitas dan resep perbaikan usaha Anda secara berkala.
              </p>
              {latestCheck && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#002D54] bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-lg w-fit border border-white/20 font-semibold shadow-sm">
                  <span>Diagnosa Terakhir:</span>
                  <span className="font-extrabold">{latestCheck.consultationData?.businessName}</span>
                  <span className="opacity-40">•</span>
                  <span>Skor:</span>
                  <span className="font-extrabold bg-[#002D54] text-white px-1.5 py-0.5 rounded text-[10px]">
                    {latestCheck.diagnosisResult?.healthScore}/100
                  </span>
                </div>
              )}
            </div>
            <Link href="/diagnosis" className="shrink-0">
              <Button size="lg" className="gap-2 text-xs font-bold bg-[#002D54] text-white hover:bg-[#002D54]/95 border-none shadow-md">
                <ClipboardList className="size-4" />
                Konsultasi Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground border border-primary-border/10">
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
                {history.length} Diagnosis
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 px-6 text-center bg-secondary/10 border border-secondary-border/20 rounded-xl max-w-md mx-auto my-6 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm">
                  <Stethoscope className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">
                    Lembar Rekam Medis Masih Kosong
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Anda belum pernah melakukan check-up kesehatan usaha. Yuk, mulai konsultasi pertama Anda bersama DokterUsaha AI untuk memantau kesehatan bisnis Anda!
                  </p>
                </div>
                <Link href="/diagnosis">
                  <Button size="sm" className="font-bold shadow-sm">
                    Mulai Konsultasi Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/50">
                {history.map((item) => {
                  const dr = item.diagnosisResult
                  const urgency =
                    urgencyConfig[dr.urgency as keyof typeof urgencyConfig]
                  const status =
                    statusConfig[dr.healthStatus as keyof typeof statusConfig]
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {item.consultationData?.businessName ?? "-"}
                          </span>
                          {urgency && (
                            <Badge variant="outline" className={urgency.className}>
                              Urgensi: {urgency.label}
                            </Badge>
                          )}
                          {status && (
                            <Badge variant="outline" className={status.className}>
                              Status: {status.label} ({dr.healthScore}/100)
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                          "{item.consultationData?.mainProblem ?? "-"}"
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Calendar className="size-3" />
                          Pemeriksaan dilakukan pada{" "}
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
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
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="flex items-center gap-2.5 justify-center rounded-lg border border-dashed border-success-border/30 bg-success/5 p-4 text-center">
          <ShieldCheck className="size-4 text-success-foreground shrink-0" />
          <p className="text-[10px] text-muted-foreground/80 max-w-md leading-relaxed">
            Data rekam medis tersimpan secara lokal dan dienkripsi untuk kerahasiaan bisnis Anda. Konsultasi berkala membantu menjaga vitalitas usaha Anda tetap bugar di tengah dinamika pasar.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}