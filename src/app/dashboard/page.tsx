"use client"

import { useEffect, useState } from "react"
import {
  ClipboardList,
  Clock,
  Activity,
  Calendar,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  ShieldAlert,
  WifiOff,
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
import { getDiagnosesByUserId } from "@/lib/db-service"
import { getOrCreateUserId } from "@/lib/utils"
import { getUserFriendlyErrorMessage } from "@/lib/error-handler"
import {
  getDashboardHistory,
  syncDashboardCache,
  DashboardCacheEntry,
} from "@/lib/local-dashboard-cache"
import { toast } from "sonner"

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

// Shared type for display items — works for both Supabase and cached data
type DashboardItem = {
  id: string
  businessName: string
  healthScore: number
  healthStatus: string
  urgency?: string
  createdAt: string
  // These fields only exist when data comes from Supabase (online mode)
  mainProblem?: string
  causes?: string[]
  recommendations?: string[]
}

export default function DashboardPage() {
  const [items, setItems] = useState<DashboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true)
      setErrorMsg(null)
      setIsOffline(false)

      try {
        const userId = getOrCreateUserId()
        const data = await getDiagnosesByUserId(userId)

        // Map Supabase data to display items
        const mapped: DashboardItem[] = data.map((item) => ({
          id: item.id,
          businessName: item.consultationData?.businessName ?? "-",
          healthScore: item.diagnosisResult?.healthScore ?? 0,
          healthStatus: item.diagnosisResult?.healthStatus ?? "perlu-perhatian",
          urgency: item.diagnosisResult?.urgency ?? "sedang",
          createdAt: item.createdAt,
          mainProblem: item.consultationData?.mainProblem,
          causes: item.diagnosisResult?.causes,
          recommendations: item.diagnosisResult?.recommendations,
        }))

        setItems(mapped)

        const cacheEntries: DashboardCacheEntry[] = mapped.map((item) => ({
          id: item.id,
          businessName: item.businessName,
          healthScore: item.healthScore,
          healthStatus: item.healthStatus,
          createdAt: item.createdAt,
        }))
        syncDashboardCache(cacheEntries)
      } catch (err) {
        console.log("Dashboard Catch Jalan")
        console.error("Dashboard load error:", err)

        // Attempt fallback from localStorage cache
        const cached = getDashboardHistory()
        if (cached.length > 0) {
          const mapped: DashboardItem[] = cached.map((item) => ({
            id: item.id,
            businessName: item.businessName,
            healthScore: item.healthScore,
            healthStatus: item.healthStatus,
            createdAt: item.createdAt,
          }))
          setItems(mapped)
          setIsOffline(true)
          toast.info("Menampilkan riwayat konsultasi yang tersimpan di perangkat.", {
            duration: 5000,
          })
        } else {
          setErrorMsg(getUserFriendlyErrorMessage(err))
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // Dynamic statistics
  const totalDiagnosis = items.length
  const totalCauses = items.reduce(
    (acc, item) => acc + (item.causes?.length ?? 0),
    0
  )
  const totalRecommendations = items.reduce(
    (acc, item) => acc + (item.recommendations?.length ?? 0),
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
      value: isOffline ? "-" : totalCauses.toString(),
      icon: Activity,
      trend: isOffline
        ? "Data tersedia saat online"
        : totalDiagnosis > 0
          ? `Rata-rata ${Math.round(totalCauses / totalDiagnosis)} per diagnosis`
          : "-",
    },
    {
      label: "Resep Solusi Diberikan",
      value: isOffline ? "-" : totalRecommendations.toString(),
      icon: HeartPulse,
      trend: isOffline
        ? "Data tersedia saat online"
        : totalDiagnosis > 0
          ? `Rata-rata ${Math.round(totalRecommendations / totalDiagnosis)} per diagnosis`
          : "-",
    },
  ]

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          {/* Hero Banner Skeleton */}
          <div className="h-44 w-full rounded-2xl bg-muted/65 animate-pulse border border-border/10"></div>
          {/* Stats Grid Skeletons */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="h-24 rounded-xl bg-muted/45 animate-pulse border border-border/10"></div>
            <div className="h-24 rounded-xl bg-muted/45 animate-pulse border border-border/10"></div>
            <div className="h-24 rounded-xl bg-muted/45 animate-pulse border border-border/10"></div>
          </div>
          {/* History Card Skeleton */}
          <div className="h-64 rounded-xl bg-muted/35 animate-pulse border border-border/10"></div>
        </div>
      </PageContainer>
    )
  }

  if (errorMsg) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          <Card className="border-destructive-border/30 bg-destructive/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <ShieldAlert className="size-12 text-destructive" />
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold text-destructive">Gagal Memuat Rekam Medis</h2>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  const latestItem = items.length > 0 ? items[0] : null

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

              {/* Offline Mode Badge */}
              {isOffline && (
                <div className="mt-2 flex items-center gap-2 text-xs bg-warning/30 text-warning-foreground px-3 py-2 rounded-lg w-fit border border-warning-border/30 font-semibold shadow-sm">
                  <WifiOff className="size-3.5" />
                  <span>Mode Offline — Menampilkan data terakhir yang tersimpan</span>
                </div>
              )}

              {!isOffline && latestItem && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#002D54] bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-lg w-fit border border-white/20 font-semibold shadow-sm">
                  <span>Diagnosa Terakhir:</span>
                  <span className="font-extrabold">{latestItem.businessName}</span>
                  <span className="opacity-40">•</span>
                  <span>Skor:</span>
                  <span className="font-extrabold bg-[#002D54] text-white px-1.5 py-0.5 rounded text-[10px]">
                    {latestItem.healthScore}/100
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
                  <Clock className="size-4 text-primary-foreground" />
                  Lembar Riwayat Rekam Medis (Medical Records)
                </CardTitle>
                <CardDescription className="text-xs">
                  {isOffline
                    ? "Riwayat konsultasi dari penyimpanan lokal perangkat"
                    : "Daftar diagnosa klinis dan rekomendasi terapi usaha Anda sebelumnya"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {items.length} Diagnosis
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
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
                {items.map((item) => {
                  const urgency =
                    urgencyConfig[item.urgency as keyof typeof urgencyConfig]
                  const status =
                    statusConfig[item.healthStatus as keyof typeof statusConfig]
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-1.5 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-foreground">
                            {item.businessName}
                          </span>
                          {urgency && (
                            <Badge className={urgency.className}>
                              Urgensi: {urgency.label}
                            </Badge>
                          )}
                          {status && (
                            <Badge className={status.className}>
                              Status: {status.label} ({item.healthScore}/100)
                            </Badge>
                          )}
                        </div>
                        {/* Main problem only available when online (from Supabase) */}
                        {item.mainProblem && (
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                            &quot;{item.mainProblem}&quot;
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Calendar className="size-3" />
                          Pemeriksaan dilakukan pada {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <Link
                        href={`/result?id=${item.id}`}
                        className="shrink-0"
                        onClick={(e) => {
                          if (!navigator.onLine) {
                            e.preventDefault();
                            toast.error("Hubungkan internet untuk membuka resep lengkap.");
                          }
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs w-full sm:w-auto font-semibold"
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
            {isOffline
              ? "Menampilkan riwayat tersimpan. Sambungkan internet untuk mengakses data terbaru dan resep diagnosis lengkap."
              : "Data rekam medis tersimpan secara aman di cloud dan di-cache secara lokal untuk akses offline. Konsultasi berkala membantu menjaga vitalitas usaha Anda tetap bugar."}
          </p>
        </div>
      </div>
    </PageContainer>
  )
}