import type { UserProfile } from "@/types/UserProfile"
import type { WorkoutPlan, WorkoutWeek, Workout, Exercise, RestDayActivity } from "@/types/Workout"
import { exerciseDatabase, deloadExercises } from "@/data/exerciseDatabase"
import { restDayActivities } from "@/data/restDayActivities"
import { supplementRecommendations, generalSupplements } from "@/data/supplementRecommendations"
import { calculateBodyMetrics } from "@/utils/bodyMetrics"
import { restActivityOptions } from "@/data/restActivityOptions"
import type { RestActivityOption } from "@/types/RestActivityOption"
import type { SupplementRecommendation } from "@/types/Supplement"

// Tradução das áreas de foco
const focusAreaTranslations: Record<string, string> = {
  fullBody: "Corpo Inteiro",
  upperBody: "Parte Superior",
  lowerBody: "Parte Inferior",
  core: "Core/Abdômen",
  glutes: "Glúteos",
}

// Tradução dos níveis de condicionamento
const fitnessLevelTranslations: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
}

// Tradução dos objetivos
const fitnessGoalsTranslations: Record<string, string> = {
  weightLoss: "Perda de Peso",
  muscleGain: "Ganho de Massa",
  endurance: "Resistência",
  strength: "Força",
  toning: "Definição",
}

// Função para gerar um plano de treino completo de 8 semanas + 1 semana de deload
export function generateWorkoutPlan(profile: UserProfile): WorkoutPlan {
  // Calcular métricas corporais
  const bodyMetrics = calculateBodyMetrics(profile)

  // Determinar número de treinos por semana
  const daysPerWeek = Math.min(profile.workoutsPerWeek, 6)
  const restDays = 7 - daysPerWeek

  // Determinar área de foco
  const focusArea = profile.focusAreas
  const translatedFocusArea = focusAreaTranslations[focusArea] || focusArea

  // Criar semanas de treino
  const weeks: WorkoutWeek[] = []

  // Gerar 8 semanas de treino + 1 semana de deload (apenas na semana 9)
  for (let weekNumber = 1; weekNumber <= 9; weekNumber++) {
    const isDeloadWeek = weekNumber === 9 // Apenas a semana 9 é de deload

    // Definir foco da semana
    let weekFocus = ""
    let weekDescription = ""

    if (isDeloadWeek) {
      weekFocus = "Recuperação"
      weekDescription = `Semana de recuperação com volume e intensidade reduzidos para permitir adaptação e recuperação.`
    } else {
      // Alternar focos nas semanas regulares
      switch ((weekNumber - 1) % 4) {
        case 0:
          weekFocus = "Volume"
          weekDescription = `Foco em volume de treino com séries e repetições moderadas.`
          break
        case 1:
          weekFocus = "Intensidade"
          weekDescription = `Foco em intensidade com cargas mais pesadas e menos repetições.`
          break
        case 2:
          weekFocus = "Técnica"
          weekDescription = `Foco em técnica e controle do movimento com tempos específicos.`
          break
        case 3:
          weekFocus = "Resistência Muscular"
          weekDescription = `Foco em resistência muscular com mais repetições e menos descanso.`
          break
      }
    }

    // Criar treinos para a semana
    const workouts = generateWorkoutsForWeek(profile, daysPerWeek, weekNumber, isDeloadWeek, weekFocus)

    // Selecionar atividades para dias de descanso
    const restDayActivitiesList = selectRestDayActivities(profile, restDays, isDeloadWeek)

    // Adicionar a semana ao plano
    weeks.push({
      weekNumber,
      description: weekDescription,
      focus: weekFocus,
      isDeloadWeek,
      workouts,
      restDays,
      restDayActivities: restDayActivitiesList,
    })
  }

  // Gerar recomendações de suplementos com base no objetivo
  const supplementRecs = generateSupplementRecommendations(profile)

  // Gerar recomendações de sono
  const sleepRecs = generateSleepRecommendations(profile)

  // Criar o plano de treino completo
  const workoutPlan: WorkoutPlan = {
    name: `Plano de ${translatedFocusArea} ${fitnessLevelTranslations[profile.fitnessLevel]} - 9 Semanas`,
    description: `Um plano de treino de 9 semanas (8 semanas + 1 deload) focado em ${translatedFocusArea} para ${fitnessGoalsTranslations[profile.fitnessGoals]}`,
    daysPerWeek,
    restDays,
    focusArea: translatedFocusArea,
    fitnessLevel: profile.fitnessLevel,
    totalWeeks: 9,
    currentWeek: 1,
    weeks,
    bodyMetrics,
    supplementRecommendations: supplementRecs,
    sleepRecommendations: sleepRecs,
    notes: `Este plano inclui variação de volume e intensidade ao longo das semanas, com uma semana de deload estrategicamente posicionada para maximizar recuperação e resultados. Ajuste as cargas conforme necessário para manter o nível de desafio apropriado. Não negligencie os dias de descanso - eles são essenciais para sua recuperação e progresso.`,
  }

  return workoutPlan
}

// Função para gerar os treinos de uma semana específica
function generateWorkoutsForWeek(
  profile: UserProfile,
  daysPerWeek: number,
  weekNumber: number,
  isDeloadWeek: boolean,
  weekFocus: string,
): Workout[] {
  const workouts: Workout[] = []
  const focusArea = profile.focusAreas

  // Obter exercícios para a área de foco
  const exercisePool = isDeloadWeek ? deloadExercises : exerciseDatabase
  const focusExercises = exercisePool[focusArea] || exercisePool.fullBody

  // Filtrar exercícios com base no nível de condicionamento
  const filteredExercises = focusExercises.filter((exercise) => {
    if (profile.fitnessLevel === "beginner") {
      return exercise.difficulty === "beginner"
    } else if (profile.fitnessLevel === "intermediate") {
      return exercise.difficulty === "beginner" || exercise.difficulty === "intermediate"
    } else {
      return true // Usuários avançados podem fazer todos os exercícios
    }
  })

  // Determinar a divisão de treino com base nos dias por semana e área de foco
  const splitType = determineSplitType(daysPerWeek, focusArea)

  // Criar treinos para cada dia da semana
  for (let day = 1; day <= daysPerWeek; day++) {
    let workoutType = ""
    let targetMuscles: string[] = []

    // Determinar o tipo de treino com base na divisão e área de foco
    if (focusArea !== "fullBody" && daysPerWeek >= 3) {
      // Para áreas específicas, maximizar o trabalho naquela área
      if (focusArea === "upperBody") {
        workoutType = day % 2 === 0 ? "chest_shoulders" : "back_arms"
        targetMuscles =
          workoutType === "chest_shoulders" ? ["peito", "ombros", "tríceps"] : ["costas", "bíceps", "antebraços"]
      } else if (focusArea === "lowerBody") {
        workoutType = day % 2 === 0 ? "quads_calves" : "hamstrings_glutes"
        targetMuscles = workoutType === "quads_calves" ? ["quadríceps", "panturrilhas"] : ["isquiotibiais", "glúteos"]
      } else if (focusArea === "core") {
        workoutType = "core"
        targetMuscles = ["abdominais", "oblíquos", "lombar", "estabilizadores"]
      } else if (focusArea === "glutes") {
        workoutType = "glutes"
        targetMuscles = ["glúteos", "isquiotibiais", "quadríceps"]
      }
    } else {
      // Para treino de corpo inteiro ou poucos dias por semana
      if (splitType === "fullBody") {
        workoutType = "fullBody"
        targetMuscles = ["corpo inteiro"]
      } else if (splitType === "upperLower") {
        workoutType = day % 2 === 1 ? "upperBody" : "lowerBody"
        targetMuscles =
          workoutType === "upperBody"
            ? ["peito", "costas", "ombros", "braços"]
            : ["quadríceps", "isquiotibiais", "glúteos", "panturrilhas"]
      } else {
        // push-pull-legs
        switch (day % 3) {
          case 1:
            workoutType = "push"
            targetMuscles = ["peito", "ombros", "tríceps"]
            break
          case 2:
            workoutType = "pull"
            targetMuscles = ["costas", "bíceps", "antebraços"]
            break
          case 0:
            workoutType = "legs"
            targetMuscles = ["quadríceps", "isquiotibiais", "glúteos", "panturrilhas"]
            break
        }
      }
    }

    // Selecionar exercícios para o treino
    let selectedExercises: Exercise[] = []

    // Embaralhar exercícios para obter uma seleção aleatória
    const shuffledExercises = [...filteredExercises].sort(() => Math.random() - 0.5)

    // Selecionar número de exercícios com base no tipo de treino e se é semana de deload
    let numExercises = isDeloadWeek ? 3 : 5

    // Para ganho de massa, aumentar o número de exercícios na área de foco
    if (profile.fitnessGoals === "muscleGain" && !isDeloadWeek) {
      numExercises += 2 // Adicionar mais exercícios para hipertrofia
    }

    if (workoutType === "fullBody") {
      numExercises = isDeloadWeek ? 4 : 6
    }

    // Selecionar exercícios
    selectedExercises = shuffledExercises.slice(0, numExercises)

    // Ajustar séries e repetições com base no foco da semana e objetivos
    selectedExercises.forEach((exercise, index) => {
      // Clonar o exercício para não modificar o original
      const exerciseCopy = { ...exercise }

      if (isDeloadWeek) {
        // Reduzir volume e intensidade para semana de deload
        exerciseCopy.sets = Math.max(exerciseCopy.sets - 1, 2)
        if (typeof exerciseCopy.reps === "number") {
          exerciseCopy.reps = Math.min(exerciseCopy.reps + 2, 15)
        }
        if (exerciseCopy.restBetweenSets) {
          exerciseCopy.restBetweenSets = Math.min(exerciseCopy.restBetweenSets + 30, 120)
        }
      } else {
        // Ajustar com base no foco da semana
        switch (weekFocus) {
          case "Volume":
            exerciseCopy.sets = Math.min(exerciseCopy.sets + 1, 5)
            if (typeof exerciseCopy.reps === "number") {
              exerciseCopy.reps = Math.min(exerciseCopy.reps + 2, 15)
            }
            break
          case "Intensidade":
            if (typeof exerciseCopy.reps === "number") {
              exerciseCopy.reps = Math.max(exerciseCopy.reps - 2, 6)
            }
            if (exerciseCopy.restBetweenSets) {
              exerciseCopy.restBetweenSets = Math.min(exerciseCopy.restBetweenSets + 30, 120)
            }
            break
          case "Técnica":
            // Manter séries e repetições, mas enfatizar o tempo/cadência
            exerciseCopy.tempo = exerciseCopy.tempo || "3-1-3-0" // Tempo mais lento para foco na técnica
            break
          case "Resistência Muscular":
            if (typeof exerciseCopy.reps === "number") {
              exerciseCopy.reps = Math.min(exerciseCopy.reps + 4, 20)
            }
            if (exerciseCopy.restBetweenSets) {
              exerciseCopy.restBetweenSets = Math.max(exerciseCopy.restBetweenSets - 15, 30)
            }
            break
        }

        // Ajustar com base nos objetivos
        if (profile.fitnessGoals === "strength") {
          if (typeof exerciseCopy.reps === "number") {
            exerciseCopy.reps = Math.max(exerciseCopy.reps - 2, 5)
          }
          exerciseCopy.sets = Math.min(exerciseCopy.sets + 1, 5)
          if (exerciseCopy.restBetweenSets) {
            exerciseCopy.restBetweenSets = Math.min(exerciseCopy.restBetweenSets + 30, 180)
          }
        } else if (profile.fitnessGoals === "endurance") {
          if (typeof exerciseCopy.reps === "number") {
            exerciseCopy.reps = Math.min(exerciseCopy.reps + 5, 20)
          }
          if (exerciseCopy.restBetweenSets) {
            exerciseCopy.restBetweenSets = Math.max(exerciseCopy.restBetweenSets - 15, 30)
          }
        } else if (profile.fitnessGoals === "muscleGain") {
          // Ajustes específicos para hipertrofia
          exerciseCopy.sets = Math.min(exerciseCopy.sets + 1, 5)
          if (typeof exerciseCopy.reps === "number") {
            // Faixa ideal para hipertrofia: 8-12 repetições
            if (exerciseCopy.reps < 8) exerciseCopy.reps = 8
            if (exerciseCopy.reps > 12) exerciseCopy.reps = 12
          }
          // Tempo sob tensão é importante para hipertrofia
          exerciseCopy.tempo = exerciseCopy.tempo || "2-1-2-0"
          // Descanso moderado para hipertrofia
          if (exerciseCopy.restBetweenSets) {
            exerciseCopy.restBetweenSets = 90
          } else {
            exerciseCopy.restBetweenSets = 90
          }

          // Para os primeiros exercícios (compostos), aumentar ainda mais o volume
          if (index < 2) {
            exerciseCopy.sets = Math.min(exerciseCopy.sets + 1, 6)
          }
        }
      }

      // Adicionar o exercício modificado
      selectedExercises[index] = exerciseCopy
    })

    // Criar o treino
    const workout: Workout = {
      name: getWorkoutName(workoutType, day, weekNumber),
      description: `Treino de ${getWorkoutTypeTranslation(workoutType)} - Semana ${weekNumber} (${weekFocus})`,
      type: profile.fitnessGoals === "endurance" ? "cardio" : "strength",
      targetMuscleGroups: targetMuscles,
      estimatedDuration: profile.timePerWorkout,
      intensity: isDeloadWeek
        ? "deload"
        : weekFocus === "Intensidade"
          ? "high"
          : weekFocus === "Volume"
            ? "moderate"
            : "light",
      warmup: [
        "5 minutos de cardio leve (corrida no lugar, polichinelos)",
        "Alongamento dinâmico para os principais grupos musculares",
        "Rotações articulares (ombros, pulsos, tornozelos)",
      ],
      exercises: selectedExercises,
      cooldown: [
        "Alongamento estático para os grupos musculares trabalhados",
        "Exercícios de respiração profunda",
        "5 minutos de caminhada leve",
      ],
      notes: isDeloadWeek
        ? "Semana de deload: foco em recuperação, use cargas mais leves e priorize a técnica."
        : `Foco da semana: ${weekFocus}. ${getWorkoutNotes(weekFocus, profile.fitnessGoals)}`,
    }

    workouts.push(workout)
  }

  return workouts
}

// Função para determinar o tipo de divisão de treino
function determineSplitType(daysPerWeek: number, focusArea: string): string {
  if (focusArea !== "fullBody" && daysPerWeek >= 3) {
    // Para áreas específicas, usar uma divisão que maximize o trabalho naquela área
    return focusArea
  } else if (daysPerWeek <= 3) {
    return "fullBody" // Treino de corpo inteiro para 1-3 dias por semana
  } else if (daysPerWeek === 4) {
    return "upperLower" // Divisão superior/inferior para 4 dias por semana
  } else {
    return "push-pull-legs" // Divisão PPL para 5-6 dias por semana
  }
}

// Função para selecionar atividades para dias de descanso
function selectRestDayActivities(profile: UserProfile, restDays: number, isDeloadWeek: boolean): RestDayActivity[] {
  if (restDays === 0) return []

  // Verificar se o usuário tem preferências de atividades de descanso
  const userPreferences = profile.restActivities || {}
  const selectedActivities: string[] = Object.keys(userPreferences).filter((key) => userPreferences[key].selected)

  // Se o usuário não selecionou nenhuma atividade, usar o comportamento padrão
  if (selectedActivities.length === 0) {
    // Embaralhar as atividades
    const shuffledActivities = [...restDayActivities].sort(() => Math.random() - 0.5)

    // Selecionar atividades com base no objetivo e nível de condicionamento
    let selectedActivitiesList: RestDayActivity[] = []

    // Durante a semana de deload, selecionar atividades mais leves
    if (isDeloadWeek) {
      selectedActivitiesList = shuffledActivities
        .filter((activity) => activity.intensity === "very_light")
        .slice(0, restDays)
    } else {
      // Para perda de peso, incluir mais atividades cardio leves
      if (profile.fitnessGoals === "weightLoss") {
        const cardioActivities = shuffledActivities.filter(
          (activity) => activity.intensity === "light" && activity.duration >= 30,
        )
        selectedActivitiesList = cardioActivities.slice(0, restDays)
      }
      // Para ganho de massa, focar em recuperação
      else if (profile.fitnessGoals === "muscleGain") {
        const recoveryActivities = shuffledActivities.filter(
          (activity) =>
            activity.intensity === "very_light" &&
            activity.benefits.some((b) => b.toLowerCase().includes("recuperação")),
        )
        selectedActivitiesList = recoveryActivities.slice(0, restDays)
      }
      // Para outros objetivos, misturar atividades
      else {
        selectedActivitiesList = shuffledActivities.slice(0, restDays)
      }
    }

    // Se não tivermos atividades suficientes, adicionar mais do pool geral
    if (selectedActivitiesList.length < restDays) {
      const remainingActivities = shuffledActivities.filter((activity) => !selectedActivitiesList.includes(activity))
      selectedActivitiesList = [
        ...selectedActivitiesList,
        ...remainingActivities.slice(0, restDays - selectedActivitiesList.length),
      ]
    }

    return selectedActivitiesList
  }

  // Se o usuário selecionou atividades, criar combinações interessantes
  const restDayActivitiesList: RestDayActivity[] = []

  // Mapear as opções de atividades para encontrar as correspondentes às preferências do usuário
  const activityOptionsMap = restActivityOptions.reduce(
    (map, option) => {
      map[option.id] = option
      return map
    },
    {} as Record<string, RestActivityOption>,
  )

  // Categorizar atividades selecionadas
  const cardioActivities = selectedActivities.filter((id) =>
    ["walking", "cycling", "swimming", "light_elliptical", "hiking"].includes(id),
  )

  const recoveryActivities = selectedActivities.filter((id) =>
    ["stretching", "yoga", "mobility", "foam_rolling", "meditation"].includes(id),
  )

  // Criar combinações para cada dia de descanso
  for (let i = 0; i < restDays; i++) {
    // Decidir se vamos criar uma combinação ou usar uma única atividade
    // Mais chance de combinação se o usuário selecionou várias atividades
    const shouldCreateCombination = selectedActivities.length >= 3 && Math.random() > 0.3
    let createdCombination = false

    if (shouldCreateCombination) {
      // Criar uma combinação baseada nas categorias disponíveis
      if (cardioActivities.length >= 2 && Math.random() > 0.5) {
        // Mini-triatlo ou combinação de cardio
        const shuffledCardio = [...cardioActivities].sort(() => Math.random() - 0.5)
        const selectedCardio = shuffledCardio.slice(0, Math.min(3, shuffledCardio.length))

        const cardioNames = selectedCardio.map((id) => activityOptionsMap[id].label)
        const cardioDescription =
          selectedCardio.length >= 3
            ? "Mini-triatlo leve: combinação de atividades cardio de baixa intensidade"
            : "Combinação de atividades cardio leves"

        // Calcular duração total dividida entre as atividades
        const totalDuration = Math.min(60, 20 * selectedCardio.length)
        const durationPerActivity = Math.floor(totalDuration / selectedCardio.length)

        restDayActivitiesList.push({
          name: selectedCardio.length >= 3 ? "Mini-Triatlo Leve" : `Combo: ${cardioNames.join(" + ")}`,
          description: `${cardioDescription}. Faça ${durationPerActivity} minutos de cada atividade em sequência.`,
          duration: totalDuration,
          intensity: "light",
          benefits: [
            "Recuperação ativa variada",
            "Trabalho cardiovascular leve",
            "Estímulo de diferentes grupos musculares",
            "Redução da monotonia",
          ],
          notes: `Mantenha a intensidade baixa em todas as atividades. Este é um dia de recuperação, não de treino. Sugestão: ${cardioNames.join(" → ")}.`,
        })
        createdCombination = true
      } else if (recoveryActivities.length >= 2) {
        // Sessão de recuperação completa
        const shuffledRecovery = [...recoveryActivities].sort(() => Math.random() - 0.5)
        const selectedRecovery = shuffledRecovery.slice(0, Math.min(3, shuffledRecovery.length))

        const recoveryNames = selectedRecovery.map((id) => activityOptionsMap[id].label)

        // Calcular duração total dividida entre as atividades
        const totalDuration = Math.min(45, 15 * selectedRecovery.length)
        const durationPerActivity = Math.floor(totalDuration / selectedRecovery.length)

        restDayActivitiesList.push({
          name: `Sessão de Recuperação Completa`,
          description: `Combinação de atividades de recuperação e mobilidade. Dedique ${durationPerActivity} minutos para cada atividade.`,
          duration: totalDuration,
          intensity: "very_light",
          benefits: [
            "Recuperação muscular profunda",
            "Melhora da flexibilidade",
            "Redução do estresse",
            "Preparação para próximos treinos",
          ],
          notes: `Foque na qualidade de cada movimento e na respiração profunda. Sugestão de sequência: ${recoveryNames.join(" → ")}.`,
        })
        createdCombination = true
      } else if (cardioActivities.length >= 1 && recoveryActivities.length >= 1) {
        // Combinação cardio + recuperação
        const randomCardio = cardioActivities[Math.floor(Math.random() * cardioActivities.length)]
        const randomRecovery = recoveryActivities[Math.floor(Math.random() * recoveryActivities.length)]

        const cardioName = activityOptionsMap[randomCardio].label
        const recoveryName = activityOptionsMap[randomRecovery].label

        restDayActivitiesList.push({
          name: `${cardioName} + ${recoveryName}`,
          description: `Combinação de cardio leve seguido de recuperação ativa.`,
          duration: 40,
          intensity: "light",
          benefits: [
            "Recuperação ativa",
            "Melhora da circulação",
            "Redução da tensão muscular",
            "Equilíbrio entre atividade e recuperação",
          ],
          notes: `Comece com 20-25 minutos de ${cardioName} em intensidade leve, seguido de 15-20 minutos de ${recoveryName}. Ideal para recuperação completa.`,
        })
        createdCombination = true
      }
    }

    if (!createdCombination) {
      // Usar uma única atividade, alternando entre as selecionadas
      const activityIndex = i % selectedActivities.length
      const activityId = selectedActivities[activityIndex]
      const preference = userPreferences[activityId]
      const activityOption = activityOptionsMap[activityId]

      if (activityOption) {
        // Determinar duração e distância com base nas preferências do usuário
        const duration =
          preference.minDuration !== undefined && preference.maxDuration !== undefined
            ? Math.floor(Math.random() * (preference.maxDuration - preference.minDuration + 1)) + preference.minDuration
            : activityOption.defaultMinDuration !== undefined && activityOption.defaultMaxDuration !== undefined
              ? Math.floor(
                  Math.random() * (activityOption.defaultMaxDuration - activityOption.defaultMinDuration + 1),
                ) + activityOption.defaultMinDuration
              : 30

        let distanceText = ""
        if (
          activityOption.hasDistance &&
          preference.minDistance !== undefined &&
          preference.maxDistance !== undefined
        ) {
          const distance = Number(
            (Math.random() * (preference.maxDistance - preference.minDistance) + preference.minDistance).toFixed(1),
          )
          distanceText = ` (${distance} ${activityOption.unit})`
        }

        // Criar a atividade personalizada
        const customActivity: RestDayActivity = {
          name: activityOption.label,
          description: `${activityOption.description}${distanceText}`,
          duration,
          intensity: activityOption.intensityRange.toLowerCase().includes("muito leve") ? "very_light" : "light",
          benefits: activityOption.benefits,
          notes: `Mantenha a intensidade ${activityOption.intensityRange.toLowerCase()} para garantir a recuperação adequada. Esta atividade foi personalizada com base nas suas preferências.`,
        }

        restDayActivitiesList.push(customActivity)
      }
    }
  }

  return restDayActivitiesList
}

// Função para gerar recomendações de suplementos
function generateSupplementRecommendations(profile: UserProfile): SupplementRecommendation[] {
  const goalSpecificSupplements = supplementRecommendations[profile.fitnessGoals] || []

  // Filtrar suplementos que o usuário já está tomando
  const userSupplements = profile.supplements || []
  const filteredSupplements = [...goalSpecificSupplements, ...generalSupplements].filter(
    (supplement) => !userSupplements.includes(supplement.name),
  )

  // Ordenar por prioridade
  const priorityOrder = { essential: 0, recommended: 1, optional: 2 }
  filteredSupplements.sort(
    (a, b) =>
      priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder],
  )

  return filteredSupplements
}

// Função para gerar recomendações de sono
function generateSleepRecommendations(profile: UserProfile): string[] {
  const recommendations: string[] = []

  // Verificar se o usuário dorme o suficiente durante a semana
  if (profile.sleepWeekday < 7) {
    recommendations.push(
      "Você está dormindo menos de 7 horas durante a semana, o que pode comprometer sua recuperação e resultados. Tente aumentar seu tempo de sono para 7-9 horas por noite.",
    )
  }

  // Verificar se o usuário dorme o suficiente no fim de semana
  if (profile.sleepWeekend < 7) {
    recommendations.push(
      "Mesmo nos fins de semana, você está dormindo menos do que o recomendado. O sono é crucial para recuperação muscular e hormônios anabólicos.",
    )
  }

  // Verificar se há grande diferença entre semana e fim de semana
  if (Math.abs(profile.sleepWeekend - profile.sleepWeekday) > 2) {
    recommendations.push(
      "Há uma grande diferença entre seu sono durante a semana e no fim de semana. Tente manter um padrão mais consistente para melhorar a qualidade do sono e recuperação.",
    )
  }

  // Recomendações baseadas no objetivo
  if (profile.fitnessGoals === "muscleGain") {
    recommendations.push(
      "Para maximizar o ganho de massa muscular, priorize 8-9 horas de sono por noite. O hormônio do crescimento é liberado principalmente durante o sono profundo.",
    )
  } else if (profile.fitnessGoals === "weightLoss") {
    recommendations.push(
      "Dormir bem é essencial para perda de peso. A privação de sono pode aumentar a fome e reduzir o metabolismo.",
    )
  }

  // Recomendações gerais
  recommendations.push(
    "Estabeleça uma rotina de sono consistente, indo para a cama e acordando nos mesmos horários todos os dias.",
    "Evite cafeína e álcool nas 4-6 horas antes de dormir.",
    "Crie um ambiente escuro, silencioso e fresco para dormir.",
    "Evite telas (celular, TV, computador) pelo menos 30 minutos antes de dormir.",
  )

  return recommendations
}

// Função para obter o nome do treino
function getWorkoutName(workoutType: string, day: number, weekNumber: number): string {
  const typeTranslation = getWorkoutTypeTranslation(workoutType)
  return `Treino de ${typeTranslation} ${day} - Semana ${weekNumber}`
}

// Função para traduzir o tipo de treino
function getWorkoutTypeTranslation(workoutType: string): string {
  const translations: Record<string, string> = {
    fullBody: "Corpo Inteiro",
    upperBody: "Parte Superior",
    lowerBody: "Parte Inferior",
    push: "Empurrar (Peito/Ombros/Tríceps)",
    pull: "Puxar (Costas/Bíceps)",
    legs: "Pernas",
    core: "Core/Abdômen",
    glutes: "Glúteos",
    chest_shoulders: "Peito e Ombros",
    back_arms: "Costas e Braços",
    quads_calves: "Quadríceps e Panturrilhas",
    hamstrings_glutes: "Posteriores e Glúteos",
  }
  return translations[workoutType] || workoutType
}

// Função para obter notas específicas do foco da semana
function getWorkoutNotes(weekFocus: string, fitnessGoal: string): string {
  let baseNote = ""

  switch (weekFocus) {
    case "Volume":
      baseNote = "Concentre-se em completar todas as séries e repetições com boa forma."
      break
    case "Intensidade":
      baseNote = "Use cargas mais pesadas, mantendo a técnica adequada."
      break
    case "Técnica":
      baseNote = "Foco na execução perfeita e no controle do tempo de cada repetição."
      break
    case "Resistência Muscular":
      baseNote = "Minimize os tempos de descanso e mantenha um ritmo constante."
      break
    default:
      return ""
  }

  // Adicionar notas específicas para o objetivo
  if (fitnessGoal === "muscleGain") {
    return `${baseNote} Para hipertrofia, foque na contração muscular e no tempo sob tensão.`
  } else if (fitnessGoal === "strength") {
    return `${baseNote} Para força, concentre-se em movimentos explosivos na fase concêntrica.`
  } else if (fitnessGoal === "endurance") {
    return `${baseNote} Para resistência, mantenha os intervalos curtos e o ritmo constante.`
  }

  return baseNote
}
