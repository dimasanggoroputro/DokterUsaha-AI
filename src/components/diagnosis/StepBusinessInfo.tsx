"use client"

import { useFormContext } from "react-hook-form"
import { Store, Users, Calendar, Wallet } from "lucide-react"
import {
  BUSINESS_TYPE_LABELS,
  BUSINESS_AGE_LABELS,
  REVENUE_RANGE_LABELS,
} from "@/types/consultation"
import { ConsultationFormValues } from "@/lib/consultation-schema"

export function StepBusinessInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>()

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-primary/5 p-4 text-sm text-primary/80 leading-relaxed border border-primary/10">
        👋 <strong>Halo Mitra UMKM!</strong> Mari mulai konsultasi dengan mengisi identitas bisnis Anda. Informasi ini membantu Dokter memahami skala dan konteks operasional usaha Anda secara akurat.
      </div>

      {/* Nama Usaha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="businessName" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Store className="size-4 text-muted-foreground" />
          Nama Usaha
        </label>
        <input
          id="businessName"
          type="text"
          placeholder="Contoh: Bakso Pak Joko, Toko Kelontong Maju"
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          {...register("businessName")}
        />
        {errors.businessName && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.businessName.message}</p>
        )}
      </div>

      {/* Jenis Usaha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="businessType" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Store className="size-4 text-muted-foreground" />
          Jenis Usaha
        </label>
        <div className="relative">
          <select
            id="businessType"
            className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            {...register("businessType")}
          >
            <option value="">-- Pilih Jenis Usaha --</option>
            {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        {errors.businessType && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.businessType.message}</p>
        )}
      </div>

      {/* Lama Usaha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="businessAge" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Calendar className="size-4 text-muted-foreground" />
          Lama Berdiri
        </label>
        <div className="relative">
          <select
            id="businessAge"
            className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            {...register("businessAge")}
          >
            <option value="">-- Pilih Lama Berdiri --</option>
            {Object.entries(BUSINESS_AGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        {errors.businessAge && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.businessAge.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Jumlah Karyawan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="employeeCount" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Users className="size-4 text-muted-foreground" />
            Jumlah Karyawan
          </label>
          <input
            id="employeeCount"
            type="number"
            min="0"
            placeholder="0"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
            {...register("employeeCount", { valueAsNumber: true })}
          />
          {errors.employeeCount && (
            <p className="text-xs font-medium text-destructive mt-0.5">{errors.employeeCount.message}</p>
          )}
        </div>

        {/* Omzet Bulanan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="monthlyRevenue" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Wallet className="size-4 text-muted-foreground" />
            Omzet Bulanan
          </label>
          <div className="relative">
            <select
              id="monthlyRevenue"
              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("monthlyRevenue")}
            >
              <option value="">-- Pilih Omzet --</option>
              {Object.entries(REVENUE_RANGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {errors.monthlyRevenue && (
            <p className="text-xs font-medium text-destructive mt-0.5">{errors.monthlyRevenue.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
