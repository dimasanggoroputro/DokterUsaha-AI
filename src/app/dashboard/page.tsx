"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ClipboardList,
  Clock,
  Activity,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
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
import { getDiagnosesByUserId } from "@/lib/db-service";
import { getOrCreateUserId, cn } from "@/lib/utils";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";
import {
  getDashboardHistory,
  syncDashboardCache,
  DashboardCacheEntry,
} from "@/lib/local-dashboard-cache";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type FilterStatus = "all" | "sehat" | "perlu-perhatian" | "kritis";

// Shared type for display items — works for both Supabase and cached data
type DashboardItem = {
  id: string;
  businessName: string;
  healthScore: number;
  healthStatus: string;
  urgency?: string;
  createdAt: string;
  // These fields only exist when data comes from Supabase (online mode)
  mainProblem?: string;
  causes?: string[];
  recommendations?: string[];
};

export default function DashboardPage() {
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredItems = useMemo(() => {
    if (filterStatus === "all") return items;
    return items.filter((item) => {
      if (filterStatus === "sehat") return item.healthScore >= 70;
      if (filterStatus === "perlu-perhatian") return item.healthScore >= 40 && item.healthScore < 70;
      if (filterStatus === "kritis") return item.healthScore < 40;
      return true;
    });
  }, [items, filterStatus]);

  const formatDateShort = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  const chartData = [...items].reverse().map((item) => ({
    date: formatDateShort(item.createdAt),
    skor: item.healthScore,
    businessName: item.businessName,
  }));

  useEffect(() => {
    setIsMounted(true);
    async function loadDashboardData() {
      setIsLoading(true);
      setErrorMsg(null);
      setIsOffline(false);

      try {
        const userId = getOrCreateUserId();
        const data = await getDiagnosesByUserId(userId);

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
        }));

        setItems(mapped);

        const cacheEntries: DashboardCacheEntry[] = mapped.map((item) => ({
          id: item.id,
          businessName: item.businessName,
          healthScore: item.healthScore,
          healthStatus: item.healthStatus,
          createdAt: item.createdAt,
        }));
        syncDashboardCache(cacheEntries);
      } catch (err) {
        console.log("Dashboard Catch Jalan");
        console.error("Dashboard load error:", err);

        // Attempt fallback from localStorage cache
        const cached = getDashboardHistory();
        if (cached.length > 0) {
          const mapped: DashboardItem[] = cached.map((item) => ({
            id: item.id,
            businessName: item.businessName,
            healthScore: item.healthScore,
            healthStatus: item.healthStatus,
            createdAt: item.createdAt,
          }));
          setItems(mapped);
          setIsOffline(true);
          toast.info(
            "Menampilkan riwayat konsultasi yang tersimpan di perangkat.",
            {
              duration: 5000,
            },
          );
        } else {
          setErrorMsg(getUserFriendlyErrorMessage(err));
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Dynamic statistics
  const totalDiagnosis = items.length;
  const totalCauses = items.reduce(
    (acc, item) => acc + (item.causes?.length ?? 0),
    0,
  );
  const totalRecommendations = items.reduce(
    (acc, item) => acc + (item.recommendations?.length ?? 0),
    0,
  );



  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

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
    );
  }

  if (errorMsg) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          <Card className="border-destructive-border/30 bg-destructive/5 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <ShieldAlert className="size-12 text-destructive" />
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold text-destructive">
                  Gagal Memuat Rekam Medis
                </h2>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }
  const latestItem = items.length > 0 ? items[0] : null;
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Dashboard Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#C6E7FF] to-[#D4F6FF] p-4 sm:p-5 text-slate-900 shadow-sm border border-[#A5D6FA]/30 min-h-[120px] sm:min-h-[140px] flex items-center">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#003647]/70">
                <Stethoscope className="size-3.5 text-[#003647]" />
                Pusat Rekam Medis Usaha
              </div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl text-[#002D54]">
                Dashboard Kesehatan UMKM
              </h1>
              
              {/* Score / Status Info */}
              {latestItem ? (
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="text-[#003647]/80 font-medium">Skor Terakhir:</span>
                  <span className="font-extrabold bg-[#002D54] text-white px-1.5 py-0.5 rounded text-[10px]">
                    {latestItem.healthScore}/100
                  </span>
                  <span className="text-[#003647]/40">•</span>
                  <span className="text-[#003647]/80 font-medium">Status:</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                    latestItem.healthScore < 40 
                      ? "bg-destructive/20 text-destructive border-destructive-border/10" 
                      : latestItem.healthScore < 70 
                        ? "bg-warning/20 text-warning-foreground border-warning-border/10" 
                        : "bg-success/20 text-success-foreground border-success-border/10"
                  )}>
                    {latestItem.healthScore < 40 ? "Kritis" : latestItem.healthScore < 70 ? "Perlu Perhatian" : "Sehat"}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#003647]/80 font-medium mt-1">
                  Belum ada diagnosis. Mulai check-up pertama Anda.
                </p>
              )}

              {/* Offline Mode Badge */}
              {isOffline && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] bg-warning/30 text-warning-foreground px-2 py-1 rounded-lg w-fit border border-warning-border/20 font-semibold shadow-sm">
                  <WifiOff className="size-3" />
                  <span>Mode Offline (Cache)</span>
                </div>
              )}
            </div>

            <Link href="/diagnosis" className="shrink-0">
              <Button
                size="sm"
                className="w-full sm:w-auto gap-1.5 text-xs font-bold bg-[#002D54] text-white hover:bg-[#002D54]/95 border-none shadow-md py-4 px-4 sm:py-5"
              >
                <ClipboardList className="size-3.5" />
                Konsultasi Baru
              </Button>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State Redesign */
          <div className="flex flex-col gap-6">
            <Card className="rounded-[24px] border-border/50 shadow-sm bg-card">
              <CardContent className="flex flex-col items-center gap-6 py-16 px-6 text-center max-w-xl mx-auto">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/20 text-[#002D54] shadow-sm border border-[#A5D6FA]/20">
                  <Stethoscope className="size-8" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-[#002D54]">
                    Belum Ada Rekam Medis
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                    Anda belum pernah melakukan konsultasi bisnis. Mulai
                    pemeriksaan pertama untuk mengetahui kondisi kesehatan usaha
                    Anda, mendeteksi potensi masalah operasional, dan menerima
                    resep rencana aksi pemulihan.
                  </p>
                </div>
                <Link href="/diagnosis">
                  <Button
                    size="lg"
                    className="font-bold shadow-md px-8 gap-2 bg-[#002D54] text-white hover:bg-[#002D54]/95"
                  >
                    <ClipboardList className="size-4" />
                    Mulai Konsultasi Pertama
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Small Footer Disclaimer */}
            <div className="py-4 text-center">
              <p className="text-[10px] text-muted-foreground/80 font-medium">
                Data rekam medis tersimpan aman di cloud dan local cache.
              </p>
            </div>
          </div>
        ) : (
          /* Active Dashboard Content with New Section Order */
          <div className="flex flex-col gap-6">
            
            {/* 1. Status Saat Ini */}
            {latestItem && (
              <Card className={cn(
                "rounded-[24px] border-l-4 shadow-sm bg-gradient-to-br from-card to-secondary/5 overflow-hidden",
                latestItem.healthScore < 40 
                  ? "border-l-destructive border-t-border/50 border-r-border/50 border-b-border/50" 
                  : latestItem.healthScore < 70 
                    ? "border-l-warning border-t-border/50 border-r-border/50 border-b-border/50" 
                    : "border-l-success border-t-border/50 border-r-border/50 border-b-border/50"
              )}>
                <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
                  {/* Header/Title */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="size-3.5 text-primary-foreground animate-pulse" />
                      Status Usaha Saat Ini
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      Diagnosa Terakhir: {latestItem.businessName}
                    </span>
                  </div>

                  {/* Main Score & Status Section */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#002d54]">
                      {latestItem.healthScore}
                    </span>
                    <span className="text-lg font-bold text-muted-foreground">/100</span>
                    
                    <Badge
                      className={cn(
                        "ml-3 text-[10px] py-0.5 px-2 font-bold uppercase",
                        latestItem.healthScore < 40
                          ? "bg-destructive/20 text-destructive border border-destructive-border/20"
                          : latestItem.healthScore < 70
                            ? "bg-warning/20 text-warning-foreground border border-warning-border/20"
                            : "bg-success/20 text-success-foreground border border-success-border/20",
                      )}
                    >
                      {latestItem.healthScore < 40 ? "Kritis" : latestItem.healthScore < 70 ? "Perlu Perhatian" : "Sehat"}
                    </Badge>
                  </div>

                  {/* Divider Line */}
                  <Separator className="bg-border/60" />

                  {/* Prioritas Hari Ini Section */}
                  <div className="flex flex-col gap-2.5 text-left">
                    <h3 className="text-xs font-extrabold text-[#002d54] uppercase tracking-wider flex items-center gap-1.5">
                      ⚡ Prioritas Hari Ini
                    </h3>
                    <div className="grid gap-2">
                      {latestItem.recommendations && latestItem.recommendations.length > 0 ? (
                        latestItem.recommendations.slice(0, 3).map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-[#002d54] font-bold select-none">•</span>
                            <span className="leading-relaxed font-medium">{rec}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-[#002d54] font-bold select-none">•</span>
                            <span className="leading-relaxed font-medium font-semibold">Perjelas masalah utama usaha Anda</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-[#002d54] font-bold select-none">•</span>
                            <span className="leading-relaxed font-medium font-semibold">Catat data penjualan mingguan untuk melacak keuangan</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-[#002d54] font-bold select-none">•</span>
                            <span className="leading-relaxed font-medium font-semibold">Tentukan target usaha yang lebih spesifik agar fokus</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2. Riwayat Rekam Medis (dengan Filter) */}
            <Card id="history" className="rounded-[24px] border-border/50 scroll-mt-20 overflow-hidden">
              <CardHeader className="pb-3 p-4 sm:p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                      <Clock className="size-4 text-primary-foreground" />
                      Riwayat Rekam Medis
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-semibold rounded-full px-2.5 py-0.5">
                      {filteredItems.length} diagnosis
                    </Badge>
                  </div>
                  
                  {/* Filter Chips row (scrollable if mobile) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0",
                        filterStatus === "all"
                          ? "bg-[#002d54] text-white border-transparent shadow-sm"
                          : "bg-background text-muted-foreground border-input hover:bg-accent"
                      )}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setFilterStatus("sehat")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0",
                        filterStatus === "sehat"
                          ? "bg-[#002d54] text-white border-transparent shadow-sm"
                          : "bg-background text-muted-foreground border-input hover:bg-accent"
                      )}
                    >
                      Sehat
                    </button>
                    <button
                      onClick={() => setFilterStatus("perlu-perhatian")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0",
                        filterStatus === "perlu-perhatian"
                          ? "bg-[#002d54] text-white border-transparent shadow-sm"
                          : "bg-background text-muted-foreground border-input hover:bg-accent"
                      )}
                    >
                      Perlu Perhatian
                    </button>
                    <button
                      onClick={() => setFilterStatus("kritis")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0",
                        filterStatus === "kritis"
                          ? "bg-[#002d54] text-white border-transparent shadow-sm"
                          : "bg-background text-muted-foreground border-input hover:bg-accent"
                      )}
                    >
                      Kritis
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 pt-0">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-[24px] border border-dashed border-border/60 bg-muted/10">
                    <ClipboardList className="size-8 text-muted-foreground/60 mb-2" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tidak ada diagnosis dengan status ini.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                      className="text-xs font-bold text-[#002d54] mt-1"
                    >
                      Kembali ke Semua
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-border/50">
                    {filteredItems.map((item) => {
                      const statusLabel =
                        item.healthScore < 40
                          ? "Kritis"
                          : item.healthScore < 70
                            ? "Perlu Perhatian"
                            : "Sehat";
                      
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex flex-col gap-1 text-left min-w-0">
                            <span className="text-sm font-bold text-foreground line-clamp-2 break-words">
                              {item.businessName}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span className="font-black text-[#002d54]">
                                {item.healthScore}/100
                              </span>
                              <span>•</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                item.healthScore < 40
                                  ? "bg-destructive/20 text-destructive border-destructive-border/10"
                                  : item.healthScore < 70
                                    ? "bg-warning/20 text-warning-foreground border-warning-border/10"
                                    : "bg-success/20 text-success-foreground border-success-border/10"
                              )}>
                                Status: {statusLabel}
                              </span>
                              <span>•</span>
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                          <Link
                            href={`/result?id=${item.id}`}
                            className="shrink-0"
                            onClick={(e) => {
                              if (!navigator.onLine) {
                                e.preventDefault();
                                toast.error(
                                  "Hubungkan internet untuk membuka resep lengkap.",
                                );
                              }
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-xs w-full sm:w-auto font-bold border-primary/20 hover:bg-primary/5 text-[#002d54]"
                            >
                              Buka Resep
                              <ArrowRight className="size-3" strokeWidth={2.5} />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Statistik (Gabungan) */}
            <Card className="rounded-[24px] border-border/50 shadow-sm bg-card overflow-hidden">
              <CardContent className="grid grid-cols-3 divide-x divide-border/60 p-4 text-center">
                <div className="flex flex-col items-center justify-center py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#002d54]">{totalDiagnosis}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5">Checkup</span>
                </div>
                <div className="flex flex-col items-center justify-center py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#002d54]">{isOffline ? "-" : totalCauses}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5">Gejala</span>
                </div>
                <div className="flex flex-col items-center justify-center py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#002d54]">{isOffline ? "-" : totalRecommendations}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5">Resep</span>
                </div>
              </CardContent>
            </Card>

            {/* 4. Chart (jika tersedia) */}
            {items.length >= 2 ? (
              <Card className="rounded-[24px] border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 p-4 sm:p-5">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Activity className="size-4 text-[#002d54]" />
                    Riwayat Perkembangan Kesehatan Usaha
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tren skor kesehatan bisnis Anda dari waktu ke waktu
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 p-4 sm:p-5">
                  {isMounted ? (
                    <div className="h-48 sm:h-64 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E2E8F0"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9 }}
                            stroke="#94A3B8"
                            interval="preserveStartEnd"
                            minTickGap={15}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                            stroke="#94A3B8"
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="rounded-lg border border-border/50 bg-background/95 p-2 shadow-md backdrop-blur-sm text-xs flex flex-col gap-0.5">
                                    <span className="font-bold">
                                      {data.businessName}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {data.date}
                                    </span>
                                    <span className="font-extrabold text-[#002d54]">
                                      Skor: {data.skor}/100
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="skor"
                            stroke="#002d54"
                            strokeWidth={3}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            dot={{ r: 4, strokeWidth: 0, fill: "#002d54" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex h-48 sm:h-64 items-center justify-center text-xs text-muted-foreground">
                      Mempersiapkan data grafik...
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-[24px] border-border/50 shadow-sm bg-card overflow-hidden">
                <CardContent className="flex flex-col items-center gap-4 py-8 px-4 text-center max-w-sm mx-auto">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-[#002D54]">
                    <Activity className="size-6" />
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                      Belum cukup data untuk melihat perkembangan kesehatan usaha.
                    </p>
                    <p className="text-[11px] text-muted-foreground/85 leading-relaxed">
                      Lakukan diagnosis berikutnya untuk mulai melihat tren.
                    </p>
                  </div>
                  <Link href="/diagnosis">
                    <Button
                      size="sm"
                      className="font-bold shadow-md bg-[#002D54] text-white hover:bg-[#002D54]/95 text-xs rounded-full px-5"
                    >
                      Mulai Konsultasi Kedua
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* 5. Skala Kesehatan */}
            <Card className="rounded-[24px] border-border/50 shadow-sm bg-card overflow-hidden">
              <CardHeader className="pb-2 p-4 sm:p-5">
                <CardTitle className="text-sm font-bold text-foreground">
                  Skala Kesehatan Usaha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-5 pt-0 text-xs">
                {/* Visual Gradient Bar with Indicator Pin */}
                <div className="relative w-full pt-2.5 pb-2">
                  <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-destructive via-warning to-success shadow-inner" />
                  {latestItem && (
                    <div 
                      className="absolute top-1 flex flex-col items-center -translate-x-1/2 transition-all duration-500"
                      style={{ left: `${latestItem.healthScore}%` }}
                    >
                      <span className="size-3.5 rounded-full bg-[#002d54] border-2 border-white shadow-md animate-bounce" />
                      <span className="text-[9px] font-black mt-0.5 px-1 bg-[#002d54] text-white rounded">
                        {latestItem.healthScore}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono mt-1 px-1">
                  <span>0 (Kritis)</span>
                  <span>40 (Perhatian)</span>
                  <span>70 (Sehat)</span>
                  <span>100</span>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-border/30 mt-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-destructive" />
                      <span className="font-bold text-destructive">
                        Kritis
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono font-semibold">
                      0 - 39
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-warning" />
                      <span className="font-bold text-warning-foreground">
                        Perlu Perhatian
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono font-semibold">
                      40 - 69
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-success" />
                      <span className="font-bold text-success-foreground">
                        Sehat
                      </span>
                    </div>
                    <span className="text-muted-foreground font-mono font-semibold">
                      70 - 100
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. Footer (disclaimer) */}
            <div className="py-4 text-center">
              <p className="text-[10px] text-muted-foreground/80 font-medium">
                Data rekam medis tersimpan aman di cloud dan local cache.
              </p>
            </div>

          </div>
        )}
      </div>
    </PageContainer>
  );
}
