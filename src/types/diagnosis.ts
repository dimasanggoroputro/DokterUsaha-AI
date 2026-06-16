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
  confidenceScore: number
  dataQuality: "tinggi" | "sedang" | "rendah"
  verdict: string // Doctor's Verdict
  insights: string[]
  strengths: string[]
  causes: string[]
  recommendations: string[]
  actionPlan: ActionPlanWeek[]
  checked_tasks?: Record<string, boolean>
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
  revenuePrevMonth?: number
  revenueCurrentMonth?: number
  dailyCustomers?: number
  dailyTransactions?: number
}

export type ConsultationHistory = {
  id: string
  consultationData: ConsultationData
  diagnosisResult: DiagnosisResult
  createdAt: string
}

