export interface Exercise {
  name: string
  description: string
  sets: number
  reps: string | number
  restBetweenSets?: number
  difficulty: "beginner" | "intermediate" | "advanced"
  targetMuscles: string[]
  equipment?: string
  tips?: string[]
  alternatives?: string[]
  videoUrl?: string
  imageUrl?: string
  tempo?: string // Cadência do exercício (ex: "2-0-2-0")
}

export interface Workout {
  name: string
  description: string
  type: "strength" | "cardio" | "hiit" | "flexibility" | "recovery"
  targetMuscleGroups: string[]
  estimatedDuration: number
  warmup: string[]
  exercises: Exercise[]
  cooldown: string[]
  intensity?: "light" | "moderate" | "high" | "deload" // Intensidade do treino
  notes?: string
}

export interface RestDayActivity {
  name: string
  description: string
  duration: number
  intensity: "very_light" | "light" | "moderate"
  benefits: string[]
  notes?: string
}

export interface WorkoutWeek {
  weekNumber: number
  description: string
  focus: string
  isDeloadWeek: boolean
  workouts: Workout[]
  restDays: number
  restDayActivities: RestDayActivity[]
}

export interface BodyMetrics {
  weight: number
  height: number
  bodyFatPercentage: number
  muscleMass: number
}

export interface SupplementRecommendation {
  name: string
  dosage: string
  benefits: string[]
  timing: string
}

export interface WorkoutPlan {
  name: string
  description: string
  daysPerWeek: number
  restDays: number
  focusArea: string
  fitnessLevel: "beginner" | "intermediate" | "advanced"
  totalWeeks: number
  currentWeek: number
  weeks: WorkoutWeek[]
  bodyMetrics?: BodyMetrics
  supplementRecommendations?: SupplementRecommendation[]
  sleepRecommendations?: string[]
  notes?: string
}
