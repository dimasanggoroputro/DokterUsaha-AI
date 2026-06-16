"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Store, Users, Calendar, Wallet } from "lucide-react"
import {
  BUSINESS_TYPE_LABELS,
  BUSINESS_AGE_LABELS,
  REVENUE_RANGE_LABELS,
} from "@/types/consultation"
import { ConsultationFormValues } from "@/lib/consultation-schema"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StepBusinessInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>()

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg bg-primary/5 p-4 text-sm text-[#003647] leading-relaxed border border-primary/10">
        <strong>Halo Mitra UMKM!</strong> Mari mulai konsultasi dengan mengisi identitas bisnis Anda. Informasi ini membantu Dokter memahami skala dan konteks operasional usaha Anda secara akurat.
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
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Store className="size-4 text-muted-foreground" />
          Jenis Usaha
        </label>
        <Controller
          control={control}
          name="businessType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="-- Pilih Jenis Usaha --" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" avoidCollisions={true}>
                {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.businessType && (
          <p className="text-xs font-medium text-destructive mt-0.5">{errors.businessType.message}</p>
        )}
      </div>

      {/* Lama Usaha */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Calendar className="size-4 text-muted-foreground" />
          Lama Berdiri
        </label>
        <Controller
          control={control}
          name="businessAge"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="-- Pilih Lama Berdiri --" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" avoidCollisions={true}>
                {Object.entries(BUSINESS_AGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
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
          <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Wallet className="size-4 text-muted-foreground" />
            Omzet Bulanan
          </label>
          <Controller
            control={control}
            name="monthlyRevenue"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="-- Pilih Omzet --" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" avoidCollisions={true}>
                  {Object.entries(REVENUE_RANGE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.monthlyRevenue && (
            <p className="text-xs font-medium text-destructive mt-0.5">{errors.monthlyRevenue.message}</p>
          )}
        </div>
      </div>

      {/* Metrik Bisnis Opsional */}
      <div className="mt-2 rounded-xl border border-border/80 bg-muted/30 p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
          <Wallet className="size-4 text-primary" />
          Metrik Bisnis Tambahan (Opsional)
        </h3>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Lengkapi metrik di bawah untuk mendapatkan analisis finansial dan tingkat konversi pelanggan yang lebih mendalam dari DokterUsaha AI.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Omzet Bulan Lalu */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="revenuePrevMonth" className="text-xs font-semibold text-foreground">
              Omzet Bulan Lalu (Rp)
            </label>
            <input
              id="revenuePrevMonth"
              type="number"
              min="0"
              placeholder="Contoh: 10000000"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("revenuePrevMonth", {
                setValueAs: (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
              })}
            />
            {errors.revenuePrevMonth && (
              <p className="text-xs font-medium text-destructive mt-0.5">{errors.revenuePrevMonth.message}</p>
            )}
          </div>

          {/* Omzet Bulan Ini */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="revenueCurrentMonth" className="text-xs font-semibold text-foreground">
              Omzet Bulan Ini (Rp)
            </label>
            <input
              id="revenueCurrentMonth"
              type="number"
              min="0"
              placeholder="Contoh: 8500000"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("revenueCurrentMonth", {
                setValueAs: (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
              })}
            />
            {errors.revenueCurrentMonth && (
              <p className="text-xs font-medium text-destructive mt-0.5">{errors.revenueCurrentMonth.message}</p>
            )}
          </div>

          {/* Pelanggan per Hari */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dailyCustomers" className="text-xs font-semibold text-foreground">
              Pelanggan per Hari
            </label>
            <input
              id="dailyCustomers"
              type="number"
              min="0"
              placeholder="Contoh: 20"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("dailyCustomers", {
                setValueAs: (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
              })}
            />
            {errors.dailyCustomers && (
              <p className="text-xs font-medium text-destructive mt-0.5">{errors.dailyCustomers.message}</p>
            )}
          </div>

          {/* Transaksi per Hari */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dailyTransactions" className="text-xs font-semibold text-foreground">
              Transaksi per Hari
            </label>
            <input
              id="dailyTransactions"
              type="number"
              min="0"
              placeholder="Contoh: 15"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
              {...register("dailyTransactions", {
                setValueAs: (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
              })}
            />
            {errors.dailyTransactions && (
              <p className="text-xs font-medium text-destructive mt-0.5">{errors.dailyTransactions.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}