"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { AlertCircle, HelpCircle, Sparkles } from "lucide-react"
import { ConsultationFormValues } from "@/lib/consultation-schema"
import { VoiceInputButton } from "@/components/ui/voice-input-button"
import { Badge } from "@/components/ui/badge"

const QUICK_SYMPTOMS = [
  "Penjualan menurun",
  "Pelanggan sepi",
  "Sulit promosi",
  "Modal terbatas",
  "Banyak pesaing",
  "Arus kas bermasalah",
  "Stok sering menumpuk",
  "Sulit mencari pelanggan baru",
  "Kesulitan mengelola karyawan",
]

export function StepBusinessProblems() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>()

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  // Parse existing selected symptoms on mount if present in the form value
  useEffect(() => {
    const currentVal = getValues("mainProblem") || ""
    const match = currentVal.match(/^\[Masalah Utama: ([^\]]+)\]/)
    if (match && match[1]) {
      const parsed = match[1].split(", ").map(s => s.trim())
      setSelectedSymptoms(parsed)
    }
  }, [getValues])

  const toggleSymptom = (symptom: string) => {
    let updated = [...selectedSymptoms]
    if (updated.includes(symptom)) {
      updated = updated.filter(s => s !== symptom)
    } else {
      updated.push(symptom)
    }
    setSelectedSymptoms(updated)

    const currentText = getValues("mainProblem") || ""
    // Strip existing symptom prefix if exists
    const cleanText = currentText.replace(/^\[Masalah Utama: [^\]]+\]\s*/g, "")
    
    if (updated.length > 0) {
      setValue("mainProblem", `[Masalah Utama: ${updated.join(", ")}] ${cleanText}`)
    } else {
      setValue("mainProblem", cleanText)
    }
  }

  // Voice handler helpers
  const handleVoiceInput = (field: "mainProblem" | "currentChallenges", text: string) => {
    const currentText = getValues(field) || ""
    const separator = currentText ? " " : ""
    setValue(field, `${currentText}${separator}${text}`, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-warning/10 p-4 text-sm text-warning-foreground leading-relaxed border border-warning/20">
        <strong>Bagian Diagnosis Keluhan.</strong> Jelaskan gejala atau masalah utama yang sedang dihadapi bisnis Anda. Ceritakan secara jujur dan apa adanya, sama seperti menjelaskan rasa sakit ke dokter.
      </div>

      {/* Pilihan Gejala Cepat (Quick Symptoms) */}
      <div className="flex flex-col gap-2 border border-border/50 rounded-xl p-3 bg-muted/10">
        <span className="flex items-center gap-1 text-xs font-bold text-foreground">
          <Sparkles className="size-3 text-warning-foreground" />
          Pilihan Cepat Masalah Bisnis (Klik untuk memilih)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom)
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#002d54] text-white border-transparent"
                    : "bg-background text-muted-foreground hover:bg-secondary border-border"
                }`}
              >
                {symptom}
              </button>
            )
          })}
        </div>
      </div>

      {/* Masalah Utama */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="mainProblem" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <AlertCircle className="size-4 text-muted-foreground" />
            Masalah Utama Usaha Anda
          </label>
          <VoiceInputButton
            onTranscript={(text) => handleVoiceInput("mainProblem", text)}
          />
        </div>
        <textarea
          id="mainProblem"
          rows={5}
          placeholder="Contoh: Penjualan warung bakso saya menurun drastis sebesar 40% sejak 2 bulan terakhir. Banyak pelanggan langganan yang tidak pernah datang lagi ke warung..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("mainProblem")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Ceritakan masalah utama Anda atau gunakan pilihan cepat di atas.
        </p>
        {errors.mainProblem && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.mainProblem.message}</p>
        )}
      </div>

      {/* Tantangan Spesifik */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="currentChallenges" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <HelpCircle className="size-4 text-muted-foreground" />
            Tantangan Spesifik Saat Ini
          </label>
          <VoiceInputButton
            onTranscript={(text) => handleVoiceInput("currentChallenges", text)}
          />
        </div>
        <textarea
          id="currentChallenges"
          rows={4}
          placeholder="Contoh: Di seberang jalan baru buka warung mi ayam baru yang harganya lebih murah. Saya juga kesulitan membagi waktu antara belanja bahan dan melayani pelanggan..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("currentChallenges")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Sebutkan hambatan yang paling menyulitkan Anda saat ini.
        </p>
        {errors.currentChallenges && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.currentChallenges.message}</p>
        )}
      </div>
    </div>
  )
}
