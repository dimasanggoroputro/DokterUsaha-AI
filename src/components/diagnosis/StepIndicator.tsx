"use client"

import { Check, ClipboardList, AlertCircle, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const steps = [
  { id: 1, label: "Info Usaha", icon: ClipboardList, desc: "Identitas Bisnis" },
  { id: 2, label: "Masalah Usaha", icon: AlertCircle, desc: "Keluhan & Gejala" },
  { id: 3, label: "Target & Harapan", icon: Target, desc: "Tujuan Usaha" },
]

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  // Calculate progress percentage
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full">
      {/* Mobile-first: simple header info */}
      <div className="mb-4 flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#003647]">
          Langkah {currentStep} dari {totalSteps}
        </span>
        <span className="text-sm font-bold text-[#003647]">
          {steps[currentStep - 1].label}
        </span>
      </div>

      {/* Progress Bar (Desktop & Mobile) */}
      <div className="relative mb-8 mt-2">
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 rounded bg-muted"></div>
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        ></div>

        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full border bg-background transition-all duration-300",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isActive && "border-secondary-foreground ring-4 ring-primary/10 text-[#003647] font-bold scale-110",
                    !isCompleted && !isActive && "border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    <StepIcon className="size-4" />
                  )}
                </div>
                {/* Labels - hidden on extra small mobile, shown on tablet/desktop */}
                <div className="absolute top-11 hidden flex-col items-center text-center sm:flex">
                  <span
                    className={cn(
                      "text-xs font-semibold leading-none transition-colors",
                      isActive && "text-foreground",
                      isCompleted && "text-muted-foreground",
                      !isActive && !isCompleted && "text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="mt-1 text-[10px] text-muted-foreground/60 leading-none">
                    {step.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Spacer to compensate absolute labels at bottom */}
      <div className="hidden h-8 sm:block"></div>
    </div>
  )
}
