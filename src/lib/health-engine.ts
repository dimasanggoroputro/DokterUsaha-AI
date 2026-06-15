import { ConsultationData } from "@/types/diagnosis";

/**
 * Calculates a logical, transparent, and reproducible health score for the business.
 * Avoids LLM scoring hallucination by using kuantitatif rules and keyword analysis.
 */
export function calculateHealthScore(data: ConsultationData): {
  healthScore: number;
  healthStatus: "sehat" | "perlu-perhatian" | "kritis";
} {
  let score = 100;

  // 1. Business Age Factor
  switch (data.businessAge) {
    case "kurang-dari-1-tahun":
      score -= 8; // Early stage risk
      break;
    case "1-3-tahun":
      score -= 2; // Stabilizing
      break;
    case "3-5-tahun":
      score += 3; // Established
      break;
    case "lebih-dari-5-tahun":
      score += 8; // Mature
      break;
  }

  // 2. Revenue & Employee Efficiency Ratio
  const employees = Number(data.employeeCount) || 0;
  
  switch (data.monthlyRevenue) {
    case "kurang-dari-5jt":
      score -= 15;
      if (employees > 1) {
        score -= Math.min(15, (employees - 1) * 4); // Inefficient labor cost
      }
      break;
    case "5jt-15jt":
      score -= 5;
      if (employees > 3) {
        score -= Math.min(10, (employees - 3) * 3);
      }
      break;
    case "15jt-50jt":
      score += 5;
      if (employees > 0 && employees <= 5) {
        score += 2; // Optimal size for this revenue range
      }
      break;
    case "50jt-100jt":
      score += 10;
      break;
    case "lebih-dari-100jt":
      score += 15;
      break;
  }

  // 3. Problem Severity Heuristics (Keywords in Indonesian)
  const textToAnalyze = `${data.mainProblem} ${data.currentChallenges}`.toLowerCase();
  
  const severeKeywords = [
    "rugi", "bangkrut", "tutup", "hutang", "utang", "bocor", "hilang", "macet", 
    "sita", "gagal", "hancur", "gulung", "kas seret", "pinjol", "krisis"
  ];
  const moderateKeywords = [
    "turun", "sepi", "kurang", "sulit", "lambat", "pesaing", "saingan", "kompetitor",
    "mahal", "numpuk", "karyawan keluar", "lemah", "drop", "merosot", "bingung"
  ];

  let severeMatches = 0;
  severeKeywords.forEach(kw => {
    if (textToAnalyze.includes(kw)) severeMatches++;
  });

  let moderateMatches = 0;
  moderateKeywords.forEach(kw => {
    if (textToAnalyze.includes(kw)) moderateMatches++;
  });

  score -= Math.min(25, severeMatches * 8);
  score -= Math.min(15, moderateMatches * 4);

  // 4. Clarity of goals bonus
  if (data.businessGoal && data.businessGoal.length > 20) {
    score += 5; // Clear goals
  }
  if (data.expectedOutcome && data.expectedOutcome.length > 20) {
    score += 3; // Realistic expectations
  }

  // 5. Normalization & Status Assignment
  score = Math.max(10, Math.min(98, score)); // Min 10, Max 98

  let status: "sehat" | "perlu-perhatian" | "kritis" = "perlu-perhatian";
  if (score >= 70) {
    status = "sehat";
  } else if (score < 40) {
    status = "kritis";
  }

  return {
    healthScore: score,
    healthStatus: status
  };
}
