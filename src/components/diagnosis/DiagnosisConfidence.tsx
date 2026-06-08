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
  let scoreColorClass = "text-destructive"
  let scoreBgClass = "bg-destructive"
  
  if (score >= 80) {
    scoreColorClass = "text-success-foreground"
    scoreBgClass = "bg-success"
  } else if (score >= 50) {
    scoreColorClass = "text-warning-foreground"
    scoreBgClass = "bg-warning"
  }

  // Determine quality badge and text
  const qualityConfigs = {
    tinggi: {
      label: "Tinggi",
      badgeVariant: "success" as const,
      description: "Data yang Anda berikan cukup lengkap sehingga hasil analisis memiliki tingkat kepercayaan yang tinggi.",
      icon: ShieldCheck,
      iconClass: "text-success",
    },
    sedang: {
      label: "Sedang",
      badgeVariant: "warning" as const,
      description: "Beberapa informasi masih dapat diperjelas agar analisis menjadi lebih akurat.",
      icon: ShieldCheck,
      iconClass: "text-warning",
    },
    rendah: {
      label: "Rendah",
      badgeVariant: "destructive" as const,
      description: "Informasi yang diberikan masih terlalu umum atau kurang spesifik. Hasil diagnosis sebaiknya digunakan sebagai gambaran awal, bukan kesimpulan final.",
      icon: ShieldAlert,
      iconClass: "text-destructive",
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
            <Badge variant={config.badgeVariant} className="text-[10px] font-bold px-2 py-0.5">
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Dynamic Explanation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {config.description}
        </p>

        {/* Info Card Tambahan */}
        <div className="flex items-start gap-2.5 rounded-lg bg-secondary/15 border border-secondary-border/20 p-3">
          <Info className="size-4 text-secondary-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-secondary-foreground">
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
