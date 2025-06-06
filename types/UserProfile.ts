export interface RestActivityPreference {
  type: string
  selected: boolean
  minDuration?: number
  maxDuration?: number
  minDistance?: number
  maxDistance?: number
}

export interface UserProfile {
  age: number
  gender: "male" | "female" | "other"
  height: number
  weight: number
  fitnessLevel: "beginner" | "intermediate" | "advanced"
  fitnessGoals: "weightLoss" | "muscleGain" | "endurance" | "strength" | "toning"
  workoutsPerWeek: number
  timePerWorkout: number
  exercisesPerWorkout?: number // Número de exercícios por treino
  focusAreas: "fullBody" | "upperBody" | "lowerBody" | "core" | "glutes"
  healthConditions?: string
  trainingExperience?: number // Anos de experiência com treinos
  preferredEquipment?: string[] // Equipamentos preferidos/disponíveis
  sleepWeekday: number // Horas de sono durante a semana
  sleepWeekend: number // Horas de sono no final de semana
  supplements: string[] // Suplementos utilizados atualmente
  restActivities: Record<string, RestActivityPreference> // Preferências de atividades para dias de descanso

  // Medidas corporais adicionais
  waistCircumference?: number // Circunferência abdominal (cm)
  hipCircumference?: number // Circunferência dos quadris (cm)
  chestCircumference?: number // Circunferência do peito/tórax (cm)
  armCircumference?: number // Circunferência dos braços (cm)
  thighCircumference?: number // Circunferência das coxas (cm)
  calfCircumference?: number // Circunferência das panturrilhas (cm)
}

export interface BodyMetrics {
  imc: number
  imcCategory: string
  basalMetabolicRate: number
  dailyCalorieNeeds: number
  bodyFatPercentageEstimate: number
  waistToHipRatio?: number // Relação cintura-quadril
}

export interface SupplementRecommendation {
  name: string
  description: string
  dosage: string
  timing: string
  benefits: string[]
  priority: "essential" | "recommended" | "optional"
}
