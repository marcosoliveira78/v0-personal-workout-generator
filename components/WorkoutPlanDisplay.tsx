"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { WorkoutPlan, Workout, Exercise, RestDayActivity } from "@/types/Workout"
import type { SupplementRecommendation } from "@/types/UserProfile"

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan
}

export default function WorkoutPlanDisplay({ workoutPlan }: WorkoutPlanDisplayProps) {
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState("day1")
  const [activeTab, setActiveTab] = useState("workout")

  // Obter a semana atual
  const currentWeek = workoutPlan.weeks.find((week) => week.weekNumber === activeWeek) || workoutPlan.weeks[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Seu Plano de Treino Personalizado</h2>
        <p className="text-muted-foreground">
          Com base no seu perfil, criamos um plano de treino de {workoutPlan.totalWeeks} semanas com foco em{" "}
          {workoutPlan.focusArea}.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workout">Treinos</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Plano</CardTitle>
              <CardDescription>Progresso do plano de {workoutPlan.totalWeeks} semanas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span>
                    Semana atual: {activeWeek} de {workoutPlan.totalWeeks}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((activeWeek / workoutPlan.totalWeeks) * 100)}% completo
                  </span>
                </div>
                <Progress value={(activeWeek / workoutPlan.totalWeeks) * 100} className="h-2" />

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mt-4">
                  {workoutPlan.weeks.map((week) => (
                    <Button
                      key={week.weekNumber}
                      variant={activeWeek === week.weekNumber ? "default" : "outline"}
                      className={`${week.isDeloadWeek ? "border-orange-500 border-2" : ""}`}
                      onClick={() => setActiveWeek(week.weekNumber)}
                    >
                      {week.weekNumber}
                      {week.isDeloadWeek && <span className="ml-1 text-xs">D</span>}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>
                    Semana {currentWeek.weekNumber}: {currentWeek.focus}
                  </CardTitle>
                  <CardDescription>{currentWeek.description}</CardDescription>
                </div>
                <Badge variant={currentWeek.isDeloadWeek ? "outline" : "default"} className="self-start md:self-auto">
                  {currentWeek.isDeloadWeek ? "Semana de Deload" : `Semana Regular`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeDay} onValueChange={setActiveDay}>
                <TabsList className="grid grid-cols-7 mb-4">
                  {currentWeek.workouts.map((workout, index) => (
                    <TabsTrigger key={`day${index + 1}`} value={`day${index + 1}`}>
                      Dia {index + 1}
                    </TabsTrigger>
                  ))}
                  {Array.from({ length: currentWeek.restDays }).map((_, index) => (
                    <TabsTrigger key={`rest${index + 1}`} value={`rest${index + 1}`}>
                      Descanso
                    </TabsTrigger>
                  ))}
                </TabsList>

                {currentWeek.workouts.map((workout, index) => (
                  <TabsContent key={`day${index + 1}`} value={`day${index + 1}`}>
                    <WorkoutDayCard workout={workout} day={index + 1} />
                  </TabsContent>
                ))}

                {Array.from({ length: currentWeek.restDays }).map((_, index) => (
                  <TabsContent key={`rest${index + 1}`} value={`rest${index + 1}`}>
                    {currentWeek.restDayActivities[index] ? (
                      <RestDayCard
                        activity={currentWeek.restDayActivities[index]}
                        day={currentWeek.workouts.length + index + 1}
                      />
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>Dia {currentWeek.workouts.length + index + 1}: Descanso</CardTitle>
                          <CardDescription>Dia de recuperação completa</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>
                            Hoje é um dia de descanso completo. Foque em dormir bem, manter-se hidratado e permitir que
                            seu corpo se recupere dos treinos anteriores.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {workoutPlan.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas do Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{workoutPlan.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics">
          {workoutPlan.bodyMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Suas Métricas Corporais</CardTitle>
                <CardDescription>Informações calculadas com base no seu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">IMC</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{workoutPlan.bodyMetrics.imc}</span>
                      <Badge>{workoutPlan.bodyMetrics.imcCategory}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Taxa Metabólica Basal</h3>
                    <p className="text-2xl font-bold">{workoutPlan.bodyMetrics.basalMetabolicRate} kcal</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Necessidade Calórica Diária</h3>
                    <p className="text-2xl font-bold">{workoutPlan.bodyMetrics.dailyCalorieNeeds} kcal</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Estimativa de Gordura Corporal</h3>
                  <p className="text-2xl font-bold">{workoutPlan.bodyMetrics.bodyFatPercentageEstimate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Esta é uma estimativa aproximada baseada no IMC e idade. Para medições mais precisas, considere
                    métodos como bioimpedância ou dobras cutâneas.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {workoutPlan.sleepRecommendations && workoutPlan.sleepRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Sono</CardTitle>
                <CardDescription>Otimize seu sono para melhorar recuperação e resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {workoutPlan.sleepRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {workoutPlan.supplementRecommendations && workoutPlan.supplementRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Suplementos</CardTitle>
                <CardDescription>
                  Suplementos que podem ajudar a alcançar seus objetivos de{" "}
                  {fitnessGoalsTranslation(workoutPlan.fitnessLevel)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workoutPlan.supplementRecommendations.map((supplement, index) => (
                    <SupplementCard key={index} supplement={supplement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Treino</CardTitle>
              <CardDescription>Visão geral do seu plano de 9 semanas</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted">Semana</th>
                      <th className="border p-2 bg-muted">Segunda</th>
                      <th className="border p-2 bg-muted">Terça</th>
                      <th className="border p-2 bg-muted">Quarta</th>
                      <th className="border p-2 bg-muted">Quinta</th>
                      <th className="border p-2 bg-muted">Sexta</th>
                      <th className="border p-2 bg-muted">Sábado</th>
                      <th className="border p-2 bg-muted">Domingo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutPlan.weeks.map((week) => (
                      <tr key={week.weekNumber}>
                        <td className="border p-2 font-medium">
                          Semana {week.weekNumber}
                          {week.isDeloadWeek ? " (Deload)" : ""}
                        </td>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          // Determinar se este dia tem um treino ou é um dia de descanso
                          const isWorkoutDay = dayIndex < week.workouts.length
                          const isRestDay = !isWorkoutDay

                          // Obter o treino ou atividade de descanso para este dia
                          const workout = isWorkoutDay ? week.workouts[dayIndex] : null
                          const restActivity = isRestDay
                            ? week.restDayActivities[dayIndex - week.workouts.length]
                            : null

                          // Determinar a classe CSS com base no tipo de dia
                          let bgClass = ""
                          if (isWorkoutDay) {
                            bgClass = week.isDeloadWeek ? "bg-amber-50" : "bg-blue-50"
                          } else {
                            bgClass = "bg-green-50"
                          }

                          return (
                            <td key={dayIndex} className={`border p-2 ${bgClass}`}>
                              {isWorkoutDay ? (
                                <div>
                                  <div className="font-medium">{workout?.name.split(" - ")[0]}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {workout?.targetMuscleGroups.join(", ")}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-medium">
                                    {restActivity ? restActivity.name : "Descanso Total"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {restActivity ? `${restActivity.duration} min` : "Recuperação"}
                                  </div>
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm">
                <p className="font-medium">Legenda:</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-50 border mr-2"></div>
                    <span>Dia de Treino</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-50 border mr-2"></div>
                    <span>Treino de Deload</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-50 border mr-2"></div>
                    <span>Dia de Descanso/Recuperação</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkoutDayCard({ workout, day }: { workout: Workout; day: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              Dia {day}: {workout.name}
            </CardTitle>
            <CardDescription>{workout.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{translateWorkoutType(workout.type)}</Badge>
            {workout.intensity && (
              <Badge variant={getIntensityVariant(workout.intensity)}>{translateIntensity(workout.intensity)}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="font-medium">Músculos alvo: {workout.targetMuscleGroups.join(", ")}</p>
          <p className="text-sm text-muted-foreground">Duração: {workout.estimatedDuration} minutos</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Aquecimento (5-10 minutos)</h3>
            <ul className="list-disc pl-5 space-y-1">
              {workout.warmup.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Treino Principal</h3>
            <Accordion type="single" collapsible className="w-full">
              {workout.exercises.map((exercise, index) => (
                <ExerciseItem key={index} exercise={exercise} index={index} />
              ))}
            </Accordion>
          </div>

          <div>
            <h3 className="font-medium mb-2">Volta à Calma (5-10 minutos)</h3>
            <ul className="list-disc pl-5 space-y-1">
              {workout.cooldown.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {workout.notes && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">Notas:</h3>
              <p className="text-sm">{workout.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function RestDayCard({ activity, day }: { activity: RestDayActivity; day: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              Dia {day}: {activity.name}
            </CardTitle>
            <CardDescription>Atividade de recuperação ativa</CardDescription>
          </div>
          <Badge variant="outline">{translateIntensity(activity.intensity)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{activity.description}</p>

          <div>
            <p className="font-medium">Duração recomendada: {activity.duration} minutos</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Benefícios</h3>
            <ul className="list-disc pl-5 space-y-1">
              {activity.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {activity.notes && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">Dicas:</h3>
              <p className="text-sm">{activity.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">{supplement.name}</h3>
        <Badge variant={getPriorityVariant(supplement.priority)}>{translatePriority(supplement.priority)}</Badge>
      </div>
      <p className="mt-2">{supplement.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm font-medium">Dosagem Recomendada</p>
          <p>{supplement.dosage}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Melhor Momento</p>
          <p>{supplement.timing}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium">Benefícios</p>
        <ul className="list-disc pl-5 mt-1">
          {supplement.benefits.map((benefit, index) => (
            <li key={index} className="text-sm">
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <AccordionItem value={`exercise-${index}`}>
      <AccordionTrigger>
        <div className="flex items-center">
          <span className="font-medium">{exercise.name}</span>
          <span className="ml-2 text-sm text-muted-foreground">
            {exercise.sets} séries × {exercise.reps} repetições
            {exercise.tempo && <span className="ml-1">(tempo: {exercise.tempo})</span>}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <p>{exercise.description}</p>
          {exercise.tips && (
            <div>
              <p className="font-medium text-sm">Dicas:</p>
              <ul className="list-disc pl-5 text-sm">
                {exercise.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
            <Badge variant="outline">{translateDifficulty(exercise.difficulty)}</Badge>
            {exercise.equipment && <Badge variant="outline">{exercise.equipment}</Badge>}
            {exercise.restBetweenSets && <Badge variant="outline">Descanso: {exercise.restBetweenSets}s</Badge>}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function translateWorkoutType(type: string): string {
  const translations: Record<string, string> = {
    strength: "Força",
    cardio: "Cardio",
    hiit: "HIIT",
    flexibility: "Flexibilidade",
    recovery: "Recuperação",
  }
  return translations[type] || type
}

function translateDifficulty(difficulty: string): string {
  const translations: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  }
  return translations[difficulty] || difficulty
}

function translateIntensity(intensity: string): string {
  const translations: Record<string, string> = {
    light: "Leve",
    moderate: "Moderada",
    high: "Alta",
    deload: "Reduzida",
    very_light: "Muito Leve",
  }
  return translations[intensity] || intensity
}

function translatePriority(priority: string): string {
  const translations: Record<string, string> = {
    essential: "Essencial",
    recommended: "Recomendado",
    optional: "Opcional",
  }
  return translations[priority] || priority
}

function fitnessGoalsTranslation(goal: string): string {
  const translations: Record<string, string> = {
    weightLoss: "Perda de Peso",
    muscleGain: "Ganho de Massa",
    endurance: "Resistência",
    strength: "Força",
    toning: "Definição",
  }
  return translations[goal] || goal
}

function getIntensityVariant(intensity: string): "default" | "secondary" | "destructive" | "outline" {
  switch (intensity) {
    case "light":
    case "very_light":
      return "outline"
    case "moderate":
      return "secondary"
    case "high":
      return "destructive"
    case "deload":
      return "outline"
    default:
      return "default"
  }
}

function getPriorityVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "essential":
      return "destructive"
    case "recommended":
      return "default"
    case "optional":
      return "secondary"
    default:
      return "outline"
  }
}
