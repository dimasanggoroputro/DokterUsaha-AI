export type ActionPlanWeek = {
  week: number
  title: string
  tasks: string[]
}

export type DiagnosisResult = {
  id: string
  summary: string
  urgency: "rendah" | "sedang" | "tinggi" | "kritis"
  healthScore: number // 0-100
  healthStatus: "sehat" | "perlu-perhatian" | "kritis" // Healthy, Warning, Critical
  verdict: string // Doctor's Verdict
  causes: string[]
  recommendations: string[]
  actionPlan: ActionPlanWeek[]
  createdAt: string
}

export type ConsultationData = {
  businessName: string
  businessType: string
  businessAge: string
  employeeCount: number
  monthlyRevenue: string
  mainProblem: string
  currentChallenges: string
  businessGoal: string
  expectedOutcome: string
}

export type ConsultationHistory = {
  id: string
  consultationData: ConsultationData
  diagnosisResult: DiagnosisResult
  createdAt: string
}

