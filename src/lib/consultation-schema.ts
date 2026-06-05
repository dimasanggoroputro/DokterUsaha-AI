import { z } from "zod"

export const step1Schema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Nama usaha harus diisi (minimal 2 karakter)" }),
  businessType: z
    .string()
    .min(1, { message: "Silakan pilih jenis usaha Anda" }),
  businessAge: z
    .string()
    .min(1, { message: "Silakan pilih berapa lama usaha Anda berjalan" }),
  employeeCount: z
    .number({ message: "Jumlah karyawan harus berupa angka" })
    .min(0, { message: "Jumlah karyawan tidak boleh minus" }),
  monthlyRevenue: z
    .string()
    .min(1, { message: "Silakan pilih rentang omzet bulanan Anda" }),
})

export const step2Schema = z.object({
  mainProblem: z
    .string()
    .min(10, { message: "Ceritakan masalah utama minimal 10 karakter agar dokter bisa menganalisis" }),
  currentChallenges: z
    .string()
    .min(10, { message: "Tuliskan tantangan spesifik saat ini minimal 10 karakter" }),
})

export const step3Schema = z.object({
  businessGoal: z
    .string()
    .min(10, { message: "Tuliskan target bisnis Anda minimal 10 karakter" }),
  expectedOutcome: z
    .string()
    .min(10, { message: "Tuliskan hasil yang diharapkan minimal 10 karakter" }),
})

export const consultationSchema = step1Schema.merge(step2Schema).merge(step3Schema)

export type ConsultationFormValues = z.infer<typeof consultationSchema>
