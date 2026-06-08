import type { Metadata } from "next"
import { Stethoscope } from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { DiagnosisWizard } from "@/components/diagnosis/DiagnosisWizard"

export const metadata: Metadata = {
  title: "Konsultasi Bisnis",
  description:
    "Ceritakan keluhan usaha Anda dan dapatkan analisis resep solusi bisnis dari Dokter Bisnis AI.",
}

export default function DiagnosisPage() {
  return (
    <PageContainer maxWidth="sm">
      <div className="flex flex-col gap-6">
        {/* Medical Doctor themed header */}
        <div className="flex flex-col gap-2 border-b border-border/40 pb-4 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-tertiary">
              <Stethoscope className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
              Konsultasi Dokter Bisnis
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Periksa Kesehatan Usaha Anda
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
            Sama seperti tubuh kita, bisnis juga butuh pemeriksaan rutin. Jawab beberapa pertanyaan berikut untuk mendiagnosa masalah dan mendapatkan resep solusi.
          </p>
        </div>

        {/* Wizard Container */}
        <DiagnosisWizard />
      </div>
    </PageContainer>
  )
}
