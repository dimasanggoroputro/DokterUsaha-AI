"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ShieldCheck, Info } from "lucide-react"

interface DiagnosisConfidenceProps {
  score: number
  quality: "tinggi" | "sedang" | "rendah"
}

export function DiagnosisConfidence({ score, quality }: DiagnosisConfidenceProps) {
  // Determine color based on score
  let scoreColorClass = "text-rose-500"
  let scoreBgClass = "bg-rose-500"
  
  if (score >= 80) {
    scoreColorClass = "text-emerald-600 dark:text-emerald-400"
    scoreBgClass = "bg-emerald-500"
  } else if (score >= 50) {
    scoreColorClass = "text-amber-600 dark:text-amber-400"
    scoreBgClass = "bg-amber-500"
  }

  // Determine quality badge and text
  const qualityConfigs = {
    tinggi: {
      label: "Tinggi",
      badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/10",
      description: "Data yang Anda berikan cukup lengkap sehingga hasil analisis memiliki tingkat kepercayaan yang tinggi.",
      icon: ShieldCheck,
      iconClass: "text-emerald-500",
    },
    sedang: {
      label: "Sedang",
      badgeClass: "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10",
      description: "Beberapa informasi masih dapat diperjelas agar analisis menjadi lebih akurat.",
      icon: ShieldCheck,
      iconClass: "text-amber-500",
    },
    rendah: {
      label: "Rendah",
      badgeClass: "bg-rose-500/10 text-rose-700 border-rose-500/20 hover:bg-rose-500/10",
      description: "Informasi yang diberikan masih terlalu umum atau kurang spesifik. Hasil diagnosis sebaiknya digunakan sebagai gambaran awal, bukan kesimpulan final.",
      icon: ShieldAlert,
      iconClass: "text-rose-500",
    },
  }

  const config = qualityConfigs[quality] || qualityConfigs.rendah
  const IconComponent = config.icon

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold">
          <IconComponent className={`size-4 ${config.iconClass}`} />
          Tingkat Kepercayaan Diagnosis
        </CardTitle>
        <CardDescription className="text-xs">
          Mengukur keakuratan diagnosis berdasarkan kelengkapan informasi yang Anda berikan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Score & Progress Bar */}
        <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3.5 border border-border/10">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted-foreground">Confidence Score</span>
            <span className={`text-2xl font-black ${scoreColorClass}`}>{score}%</span>
          </div>
          
          {/* Custom Progress Bar */}
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${scoreBgClass}`}
              style={{ width: `${score}%` }}
            />
          </div>
          
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Kualitas Data Masukan:</span>
            <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${config.badgeClass}`}>
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Dynamic Explanation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {config.description}
        </p>

        {/* Info Card Tambahan */}
        <div className="flex items-start gap-2.5 rounded-lg bg-indigo-500/[0.02] border border-indigo-500/10 p-3">
          <Info className="size-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
              Mengapa tingkat kepercayaan penting?
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              DokterUsaha AI menganalisis bisnis berdasarkan informasi yang Anda masukkan. Semakin detail dan spesifik data yang diberikan, semakin akurat rekomendasi yang dihasilkan.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
