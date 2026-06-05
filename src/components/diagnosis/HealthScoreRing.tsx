"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HealthScoreRingProps {
  score: number
  status: "sehat" | "perlu-perhatian" | "kritis"
}

const statusConfig = {
  sehat: {
    label: "Sehat",
    sub: "Kondisi bisnis Anda secara umum stabil dan memiliki pondasi yang baik.",
    colorClass: "text-emerald-500 dark:text-emerald-400",
    strokeColor: "#10b981",
    bgColor: "bg-emerald-500/5 border-emerald-500/10",
  },
  "perlu-perhatian": {
    label: "Perlu Perhatian",
    sub: "Terdapat beberapa gejala penurunan kesehatan finansial atau operasional.",
    colorClass: "text-amber-500 dark:text-amber-400",
    strokeColor: "#f59e0b",
    bgColor: "bg-amber-500/5 border-amber-500/10",
  },
  kritis: {
    label: "Kritis",
    sub: "Bisnis Anda memerlukan penanganan darurat segera untuk mencegah kegagalan usaha.",
    colorClass: "text-rose-500 dark:text-rose-400",
    strokeColor: "#f43f5e",
    bgColor: "bg-rose-500/5 border-rose-500/10",
  },
}

export function HealthScoreRing({ score, status }: HealthScoreRingProps) {
  const config = statusConfig[status]
  const [animatedScore, setAnimatedScore] = useState(0)

  // Circumference of our circle with radius 52 is 2 * PI * 52 ≈ 326.7
  const r = 52
  const circ = 2 * Math.PI * r

  useEffect(() => {
    // Animate score number and circle reveal on component mount
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const strokeDashoffset = circ - (animatedScore / 100) * circ

  return (
    <div className={cn("flex flex-col items-center rounded-xl border p-6 text-center shadow-sm", config.bgColor)}>
      <div className="relative flex items-center justify-center">
        {/* Ring SVG */}
        <svg className="size-36 -rotate-90 transform" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={r}
            className="stroke-muted"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke={config.strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Text inside the ring */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {animatedScore}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Skor Kesehatan
          </span>
        </div>
      </div>

      {/* Label and description below */}
      <div className="mt-4">
        <h3 className={cn("text-lg font-bold sm:text-xl", config.colorClass)}>
          {config.label}
        </h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground/80 leading-relaxed">
          {config.sub}
        </p>
      </div>
    </div>
  )
}
