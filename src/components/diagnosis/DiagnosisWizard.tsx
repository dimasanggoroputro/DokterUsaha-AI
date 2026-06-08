"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Stethoscope, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "./StepIndicator";
import { StepBusinessInfo } from "./StepBusinessInfo";
import { StepBusinessProblems } from "./StepBusinessProblems";
import { StepBusinessGoals } from "./StepBusinessGoals";
import {
  consultationSchema,
  step1Schema,
  step2Schema,
  ConsultationFormValues,
} from "@/lib/consultation-schema";

import { createDiagnosisAction } from "@/actions/createDiagnosis";
import { toast } from "sonner";
import { ConsultationData } from "@/types/diagnosis";

const STEP_FIELDS = {
  1: [
    "businessName",
    "businessType",
    "businessAge",
    "employeeCount",
    "monthlyRevenue",
  ] as const,
  2: ["mainProblem", "currentChallenges"] as const,
  3: ["businessGoal", "expectedOutcome"] as const,
};

export function DiagnosisWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      businessType: "",
      businessAge: "",
      employeeCount: 0,
      monthlyRevenue: "",
      mainProblem: "",
      currentChallenges: "",
      businessGoal: "",
      expectedOutcome: "",
    },
  });

  const { handleSubmit, trigger, clearErrors, resetField } = methods;

  const nextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[step as keyof typeof STEP_FIELDS];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      clearErrors();
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };
  const prevStep = () => {
    clearErrors();

    setStep((prev) => Math.max(prev - 1, 1));
  };
  const isOffline = () => {
    return typeof navigator !== "undefined" && !navigator.onLine;
  };
  const onSubmit = async (data: ConsultationFormValues) => {
    console.log("FORM SUBMITTED");

    if (isOffline()) {
      toast.error(
        "Tidak ada koneksi internet. Periksa jaringan Anda lalu coba lagi.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert UI Form structure matching ConsultationData shape
      const consultation: ConsultationData = {
        businessName: data.businessName,
        businessType: data.businessType,
        businessAge: data.businessAge,
        employeeCount: data.employeeCount,
        monthlyRevenue: data.monthlyRevenue,
        mainProblem: data.mainProblem,
        currentChallenges: data.currentChallenges,
        businessGoal: data.businessGoal,
        expectedOutcome: data.expectedOutcome,
      };

      const result = await createDiagnosisAction(consultation);

      // Save inputs and final AI result to localStorage
      localStorage.setItem(
        "dokterusaha_consultation",
        JSON.stringify(consultation),
      );
      localStorage.setItem("dokterusaha_result", JSON.stringify(result));
      // Batch 2.1 — Simpan ke history
      const historyRaw = localStorage.getItem("dokterusaha_history");
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift({
        id: result.id,
        consultationData: consultation,
        diagnosisResult: result,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("dokterusaha_history", JSON.stringify(history));

      toast.success("Diagnosis selesai diproses oleh Dokter AI!");
      router.push("/result");
    } catch (error) {
      console.error(error);

      const message = error instanceof Error ? error.message : "";

      if (
        message.includes("503") ||
        message.includes("high demand") ||
        message.includes("UNAVAILABLE")
      ) {
        toast.error(
          "DokterUsaha AI sedang melayani banyak konsultasi. Silakan coba lagi beberapa saat lagi.",
        );
      } else if (message.includes("Failed to fetch")) {
        toast.error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        );
      } else {
        toast.error(
          "Terjadi kesalahan saat melakukan diagnosis. Silakan coba kembali.",
        );
      }
    } finally {
      if (!navigator.onLine) {
        toast.error(
          "Anda sedang offline. Periksa koneksi internet lalu coba lagi.",
        );
        return;
      }

      setIsSubmitting(true);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm md:p-4">
      <CardContent className="pt-6">
        <StepIndicator currentStep={step} totalSteps={3} />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* Step Content */}
            <div className="min-h-[280px]">
              {step === 1 && <StepBusinessInfo />}
              {step === 2 && <StepBusinessProblems />}
              {step === 3 && <StepBusinessGoals />}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={prevStep}
                  className="gap-1.5"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="size-4" />
                  Kembali
                </Button>
              ) : (
                <div /> // spacer to push Next to right
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  size="default"
                  onClick={nextStep}
                  className="gap-1.5"
                >
                  Lanjut
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="size-4" />
                      Kirim Diagnosa
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
