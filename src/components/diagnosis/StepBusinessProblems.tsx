"use client"

import { useFormContext } from "react-hook-form"
import { AlertCircle, HelpCircle } from "lucide-react"
import { ConsultationFormValues } from "@/lib/consultation-schema"

export function StepBusinessProblems() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>()

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-amber-500/5 p-4 text-sm text-amber-800 dark:text-amber-300 leading-relaxed border border-amber-500/10">
        🩺 <strong>Bagian Diagnosis Keluhan.</strong> Jelaskan gejala atau masalah utama yang sedang dihadapi bisnis Anda. Ceritakan secara jujur dan apa adanya, sama seperti menjelaskan rasa sakit ke dokter.
      </div>

      {/* Masalah Utama */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mainProblem" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <AlertCircle className="size-4 text-muted-foreground" />
          Masalah Utama Usaha Anda
        </label>
        <textarea
          id="mainProblem"
          rows={5}
          placeholder="Contoh: Penjualan warung bakso saya menurun drastis sebesar 40% sejak 2 bulan terakhir. Banyak pelanggan langganan yang tidak pernah datang lagi ke warung..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("mainProblem")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Ceritakan masalah utama Anda (misalnya penjualan turun, sepi pembeli, uang kas sering hilang, dsb).
        </p>
        {errors.mainProblem && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.mainProblem.message}</p>
        )}
      </div>

      {/* Tantangan Spesifik */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentChallenges" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <HelpCircle className="size-4 text-muted-foreground" />
          Tantangan Spesifik Saat Ini
        </label>
        <textarea
          id="currentChallenges"
          rows={4}
          placeholder="Contoh: Di seberang jalan baru buka warung mi ayam baru yang harganya lebih murah. Saya juga kesulitan membagi waktu antara belanja bahan dan melayani pelanggan..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("currentChallenges")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Sebutkan hambatan yang paling menyulitkan Anda saat ini (kompetitor baru, modal menipis, kesulitan bahan baku, dsb).
        </p>
        {errors.currentChallenges && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.currentChallenges.message}</p>
        )}
      </div>
    </div>
  )
}
