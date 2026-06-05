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
  ConsultationFormValues,
} from "@/lib/consultation-schema";

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
    mode: "onChange",
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

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    // Validate only fields on the current step
    const fieldsToValidate = STEP_FIELDS[step as keyof typeof STEP_FIELDS];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: ConsultationFormValues) => {
    setIsSubmitting(true);

    // Save to localStorage to simulate state transfer
    localStorage.setItem("dokterusaha_consultation", JSON.stringify(data));

    // Simulate short analysis delay (feels like doctor is reviewing the chart)
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/result");
    }, 1500);
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
