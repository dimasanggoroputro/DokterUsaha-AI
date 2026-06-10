"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  ShieldAlert,
  WifiOff,
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
import { getDiagnosisById, getDiagnosesByUserId } from "@/lib/db-service";
import { getUserFriendlyErrorMessage } from "@/lib/error-handler";

const urgencyConfig = {
  rendah: {
    label: "Rendah",
    className:
      "bg-success/20 text-success-foreground border border-success-border/20 font-semibold",
  },
  sedang: {
    label: "Sedang",
    className:
      "bg-warning/20 text-warning-foreground border border-warning-border/20 font-semibold",
  },
  tinggi: {
    label: "Tinggi",
    className:
      "bg-warning/35 text-warning-foreground border border-warning-border/30 font-bold",
  },
  kritis: {
    label: "Kritis",
    className:
      "bg-destructive/20 text-destructive border border-destructive-border/20 font-bold",
  },
};

function ResultPageContent() {
  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null,
  );
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previousResult, setPreviousResult] = useState<DiagnosisResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOfflineError, setIsOfflineError] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    async function loadDiagnosis() {
      if (!id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      setIsOfflineError(false);
      try {
        const data = await getDiagnosisById(id);
        if (data) {
          setConsultation(data.consultationData);
          setResult(data.diagnosisResult);

          // Get user diagnoses to find the previous one for comparison
          if (data.user_id) {
            const history = await getDiagnosesByUserId(data.user_id);
            const currentIndex = history.findIndex((h) => h.id === id);
            if (currentIndex !== -1 && currentIndex + 1 < history.length) {
              setPreviousResult(history[currentIndex + 1].diagnosisResult);
            }
          }
        }
      } catch (err) {
        console.error("Fetch diagnosis error:", err);
        const message = getUserFriendlyErrorMessage(err);
        const isOffline =
          (typeof navigator !== "undefined" && !navigator.onLine) ||
          message ===
            "Tidak ada koneksi internet. Periksa jaringan Anda lalu coba lagi.";
        if (isOffline) {
          setIsOfflineError(true);
        } else {
          setErrorMsg(message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagnosis();
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer maxWidth="sm">
        <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
          <Activity className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-semibold">
            Membuat diagnosis klinis bisnis...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (isOfflineError) {
    return (
      <PageContainer maxWidth="sm">
        <Card className="border-warning-border/30 bg-warning/5 shadow-sm">
          <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-warning/20 border border-warning-border/20 shadow-sm">
              <WifiOff className="size-7 text-warning-foreground" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-warning-foreground">
                Resep Lengkap Memerlukan Koneksi Internet
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Hasil diagnosis lengkap dan rencana aksi disimpan secara aman di
                cloud. Sambungkan internet untuk melihat resep bisnis terbaru.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <Button
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Coba Lagi
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <ArrowLeft className="size-3.5" />
                  Kembali ke Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (errorMsg) {
    return (
      <PageContainer maxWidth="sm">
        <Card className="border-destructive-border/30 bg-destructive/5 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <ShieldAlert className="size-12 text-destructive" />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-destructive">
                Terjadi Gangguan
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <Button size="sm" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer maxWidth="sm">
        <Card className="border-secondary-border/20 bg-secondary/5 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Stethoscope className="size-12 text-secondary-foreground" />
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-[#002D54]">
                Diagnosis Tidak Ditemukan
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Hasil resep solusi tidak dapat ditemukan. Silakan lakukan
                diagnosis kesehatan bisnis terlebih dahulu.
              </p>
            </div>
            <Link href="/diagnosis">
              <Button size="sm">Mulai Diagnosis</Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const urgency = urgencyConfig[result.urgency] || urgencyConfig.sedang;

  return (
    <PageContainer maxWidth="sm">
      <div className="flex flex-col gap-6">
        {/* Premium Title Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary/20 p-6 text-slate-900 shadow-sm border border-[#A5D6FA]/30">
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
                <p className="text-xs leading-relaxed text-foreground">
                  {item}
                </p>
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
            &quot;{result.verdict}&quot;
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
                Temuan penting yang mungkin belum Anda sadari dari kondisi usaha
                Anda.
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
              Faktor-faktor yang teridentifikasi memperburuk kesehatan usaha
              Anda
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

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <PageContainer maxWidth="sm">
          <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
            <Activity className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-semibold">
              Mempersiapkan resep solusi...
            </p>
          </div>
        </PageContainer>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}
