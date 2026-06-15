"use client";

import { useFormContext } from "react-hook-form";
import { Target, Sparkles } from "lucide-react";
import { ConsultationFormValues } from "@/lib/consultation-schema";
import { VoiceInputButton } from "@/components/ui/voice-input-button";

export function StepBusinessGoals() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>();

  const handleVoiceInput = (field: "businessGoal" | "expectedOutcome", text: string) => {
    const currentText = getValues(field) || "";
    const separator = currentText ? " " : "";
    setValue(field, `${currentText}${separator}${text}`, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-success/10 p-4 text-sm text-success-foreground leading-relaxed border border-success/20">
        <strong>Tujuan & Harapan Usaha.</strong> Agar diagnosa dan rekomendasi
        Dokter sesuai sasaran, ceritakan apa target jangka pendek/panjang Anda
        dan hasil akhir yang paling Anda inginkan.
      </div>

      {/* Target Bisnis */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="businessGoal"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Target className="size-4 text-muted-foreground" />
            Target Bisnis dalam 6 Bulan ke Depan
          </label>
          <VoiceInputButton
            onTranscript={(text) => handleVoiceInput("businessGoal", text)}
          />
        </div>
        <textarea
          id="businessGoal"
          rows={4}
          placeholder="Contoh: Mengembalikan omzet bulanan ke angka 15 juta per bulan, mempertahankan pelanggan setia, dan mulai membuka layanan pesan antar via ojek online..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("businessGoal")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Apa rencana atau pencapaian yang ingin dicapai usaha Anda dalam waktu
          dekat?
        </p>
        {errors.businessGoal && (
          <p className="text-xs font-medium text-destructive mt-0.5">
            {errors.businessGoal.message}
          </p>
        )}
      </div>

      {/* Hasil yang Diharapkan */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="expectedOutcome"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Sparkles className="size-4 text-muted-foreground" />
            Hasil yang Paling Diharapkan dari Konsultasi Ini
          </label>
          <VoiceInputButton
            onTranscript={(text) => handleVoiceInput("expectedOutcome", text)}
          />
        </div>
        <textarea
          id="expectedOutcome"
          rows={4}
          placeholder="Contoh: Saya ingin mendapatkan panduan langkah demi langkah cara bersaing dengan kompetitor baru tanpa harus ikut perang harga, serta ide promosi gratis yang bisa dikerjakan sendiri..."
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("expectedOutcome")}
        />
        <p className="text-xs text-muted-foreground/70">
          *Solusi spesifik apa yang paling Anda harapkan dari dokter bisnis ini?
        </p>
        {errors.expectedOutcome && (
          <p className="text-xs font-medium text-destructive mt-0.5">
            {errors.expectedOutcome.message}
          </p>
        )}
      </div>
    </div>
  );
}
