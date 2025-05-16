import type { UserProfile } from "@/types/UserProfile"
import type { BodyMetrics } from "@/types/UserProfile"

export function calculateBodyMetrics(profile: UserProfile): BodyMetrics {
  // Cálculo do IMC
  const heightInMeters = profile.height / 100
  const imc = profile.weight / (heightInMeters * heightInMeters)

  // Determinar categoria do IMC
  let imcCategory = ""
  if (imc < 18.5) {
    imcCategory = "Abaixo do peso"
  } else if (imc >= 18.5 && imc < 25) {
    imcCategory = "Peso normal"
  } else if (imc >= 25 && imc < 30) {
    imcCategory = "Sobrepeso"
  } else if (imc >= 30 && imc < 35) {
    imcCategory = "Obesidade Grau I"
  } else if (imc >= 35 && imc < 40) {
    imcCategory = "Obesidade Grau II"
  } else {
    imcCategory = "Obesidade Grau III"
  }

  // Cálculo da Taxa Metabólica Basal (usando fórmula de Mifflin-St Jeor)
  let basalMetabolicRate = 0
  if (profile.gender === "male") {
    basalMetabolicRate = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  } else {
    basalMetabolicRate = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
  }

  // Estimativa de necessidades calóricas diárias
  // Fator de atividade baseado no número de treinos por semana
  let activityFactor = 1.2 // Sedentário
  if (profile.workoutsPerWeek >= 1 && profile.workoutsPerWeek <= 2) {
    activityFactor = 1.375 // Levemente ativo
  } else if (profile.workoutsPerWeek >= 3 && profile.workoutsPerWeek <= 5) {
    activityFactor = 1.55 // Moderadamente ativo
  } else if (profile.workoutsPerWeek >= 6) {
    activityFactor = 1.725 // Muito ativo
  }

  const dailyCalorieNeeds = Math.round(basalMetabolicRate * activityFactor)

  // Estimativa de percentual de gordura corporal (fórmula simplificada)
  // Esta é uma estimativa muito aproximada baseada apenas no IMC
  let bodyFatPercentageEstimate = 0
  if (profile.gender === "male") {
    bodyFatPercentageEstimate = 1.2 * imc + 0.23 * profile.age - 16.2
  } else {
    bodyFatPercentageEstimate = 1.2 * imc + 0.23 * profile.age - 5.4
  }

  // Limitar o percentual de gordura a valores razoáveis
  bodyFatPercentageEstimate = Math.max(5, Math.min(bodyFatPercentageEstimate, 50))

  // Calcular relação cintura-quadril se as medidas estiverem disponíveis
  let waistToHipRatio = undefined
  if (profile.waistCircumference && profile.hipCircumference) {
    waistToHipRatio = profile.waistCircumference / profile.hipCircumference
  }

  // Criar objeto de métricas corporais com todas as medidas disponíveis
  const bodyMetrics: BodyMetrics = {
    imc: Number.parseFloat(imc.toFixed(2)),
    imcCategory,
    basalMetabolicRate: Math.round(basalMetabolicRate),
    dailyCalorieNeeds,
    bodyFatPercentageEstimate: Number.parseFloat(bodyFatPercentageEstimate.toFixed(1)),
    waistToHipRatio,
    waistCircumference: profile.waistCircumference,
    hipCircumference: profile.hipCircumference,
    chestCircumference: profile.chestCircumference,
    armCircumference: profile.armCircumference,
    thighCircumference: profile.thighCircumference,
    calfCircumference: profile.calfCircumference,
  }

  return bodyMetrics
}
