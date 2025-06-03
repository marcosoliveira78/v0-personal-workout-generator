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
import PDFPreviewModal from "./PDFPreviewModal"
import PDFExportButton from "./PDFExportButton"

interface WorkoutPlanDisplayProps {
  workoutPlan: WorkoutPlan
}

export default function WorkoutPlanDisplay({ workoutPlan }: WorkoutPlanDisplayProps) {
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState("day1")
  const [activeTab, setActiveTab] = useState("workout")

  // Obter a semana atual
  const currentWeek = workoutPlan.weeks.find((week) => week.weekNumber === activeWeek) || workoutPlan.weeks[0]

  // Criar um array com todos os dias da semana (treinos e descansos)
  const allDays = createWeekSchedule(currentWeek.workouts, currentWeek.restDayActivities)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Seu Plano de Treino Personalizado</h2>
        <p className="text-muted-foreground">
          Com base no seu perfil, criamos um plano de treino de {workoutPlan.totalWeeks} semanas com foco em{" "}
          {workoutPlan.focusArea}.
        </p>
      </div>
      <div className="flex gap-2">
          <PDFPreviewModal workoutPlan={workoutPlan} />
          <PDFExportButton workoutPlan={workoutPlan} />
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
                  {allDays.map((day, index) => (
                    <TabsTrigger key={`day${index + 1}`} value={`day${index + 1}`}>
                      Dia {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {allDays.map((day, index) => (
                  <TabsContent key={`day${index + 1}`} value={`day${index + 1}`}>
                    {day.type === "workout" ? (
                      <WorkoutDayCard workout={day.workout} dayNumber={index + 1} />
                    ) : (
                      <RestDayCard activity={day.activity} dayNumber={index + 1} />
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

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Estimativa de Gordura Corporal</h3>
                    <p className="text-2xl font-bold">{workoutPlan.bodyMetrics.bodyFatPercentageEstimate}%</p>
                    <p className="text-sm text-muted-foreground">
                      Esta é uma estimativa aproximada baseada no IMC e idade. Para medições mais precisas, considere
                      métodos como bioimpedância ou dobras cutâneas.
                    </p>
                  </div>

                  {workoutPlan.bodyMetrics.waistToHipRatio && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Relação Cintura-Quadril</h3>
                      <p className="text-2xl font-bold">{workoutPlan.bodyMetrics.waistToHipRatio.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        Indicador importante para avaliar riscos à saúde relacionados à distribuição de gordura
                        corporal.
                      </p>
                    </div>
                  )}
                </div>

                {(workoutPlan.bodyMetrics.waistCircumference ||
                  workoutPlan.bodyMetrics.hipCircumference ||
                  workoutPlan.bodyMetrics.chestCircumference ||
                  workoutPlan.bodyMetrics.armCircumference ||
                  workoutPlan.bodyMetrics.thighCircumference ||
                  workoutPlan.bodyMetrics.calfCircumference) && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Medidas Corporais</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {workoutPlan.bodyMetrics.waistCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Cintura</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.waistCircumference} cm</p>
                        </div>
                      )}
                      {workoutPlan.bodyMetrics.hipCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Quadril</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.hipCircumference} cm</p>
                        </div>
                      )}
                      {workoutPlan.bodyMetrics.chestCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Tórax</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.chestCircumference} cm</p>
                        </div>
                      )}
                      {workoutPlan.bodyMetrics.armCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Braços</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.armCircumference} cm</p>
                        </div>
                      )}
                      {workoutPlan.bodyMetrics.thighCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Coxas</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.thighCircumference} cm</p>
                        </div>
                      )}
                      {workoutPlan.bodyMetrics.calfCircumference && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Panturrilhas</p>
                          <p className="text-xl">{workoutPlan.bodyMetrics.calfCircumference} cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted">Sem</th>
                      <th className="border p-2 bg-muted">Seg</th>
                      <th className="border p-2 bg-muted">Ter</th>
                      <th className="border p-2 bg-muted">Qua</th>
                      <th className="border p-2 bg-muted">Qui</th>
                      <th className="border p-2 bg-muted">Sex</th>
                      <th className="border p-2 bg-muted">Sáb</th>
                      <th className="border p-2 bg-muted">Dom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutPlan.weeks.map((week) => (
                      <tr key={week.weekNumber}>
                        <td className="border p-1 font-medium text-center">
                          {week.weekNumber}
                          {week.isDeloadWeek ? "D" : ""}
                        </td>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          // Encontrar o treino para este dia da semana
                          const workout = week.workouts.find((w) => w.dayOfWeek === dayIndex)
                          const isWorkoutDay = !!workout

                          // Se não for dia de treino, verificar se é dia de descanso
                          const restDayIndex =
                            week.workouts.length > 0
                              ? week.workouts.filter((w) => w.dayOfWeek < dayIndex).length
                              : dayIndex
                          const restActivity =
                            !isWorkoutDay && restDayIndex < week.restDayActivities.length
                              ? week.restDayActivities[restDayIndex]
                              : null

                          // Determinar a classe CSS com base no tipo de dia
                          let bgClass = ""
                          if (isWorkoutDay) {
                            bgClass = week.isDeloadWeek ? "bg-amber-50" : "bg-blue-50"
                          } else {
                            bgClass = "bg-green-50"
                          }

                          return (
                            <td key={dayIndex} className={`border p-1 ${bgClass} text-xs`}>
                              {isWorkoutDay ? (
                                <div>
                                  <div className="font-medium text-xs">{workout.targetMuscleGroups.join(", ")}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {workout.exercises
                                      .slice(0, 2)
                                      .map((ex) => ex.name)
                                      .join(", ")}
                                    {workout.exercises.length > 2 ? "..." : ""}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-medium text-xs">
                                    {restActivity ? restActivity.name : "Descanso"}
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

// Função para criar um cronograma semanal com treinos e descansos intercalados
function createWeekSchedule(workouts: Workout[], restActivities: RestDayActivity[]) {
  // Criar um array para todos os 7 dias da semana
  const weekSchedule = Array(7)
    .fill(null)
    .map((_, i) => ({
      dayIndex: i,
      type: "rest" as "workout" | "rest",
      workout: null as Workout | null,
      activity: null as RestDayActivity | null,
    }))

  // Preencher os dias de treino
  workouts.forEach((workout) => {
    if (workout.dayOfWeek !== undefined && workout.dayOfWeek >= 0 && workout.dayOfWeek < 7) {
      weekSchedule[workout.dayOfWeek] = {
        dayIndex: workout.dayOfWeek,
        type: "workout",
        workout: workout,
        activity: null,
      }
    }
  })

  // Preencher os dias de descanso
  let restIndex = 0
  weekSchedule.forEach((day, index) => {
    if (day.type === "rest" && restIndex < restActivities.length) {
      weekSchedule[index] = {
        dayIndex: index,
        type: "rest",
        workout: null,
        activity: restActivities[restIndex],
      }
      restIndex++
    }
  })

  return weekSchedule
}

function WorkoutDayCard({ workout, dayNumber }: { workout: Workout; dayNumber: number }) {
  // Obter o nome do dia da semana
  const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
  const dayName = workout.dayOfWeek !== undefined ? dayNames[workout.dayOfWeek] : ""

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex flex-col">
              <span>Dia {dayNumber}</span>
              <span className="text-base font-normal text-muted-foreground">{dayName}</span>
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
          <p className="text-sm text-muted-foreground">
            Duração: {workout.estimatedDuration} minutos
            {workout.timePerExercise && ` (aprox. ${workout.timePerExercise} min por exercício)`}
          </p>
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

function RestDayCard({ activity, dayNumber }: { activity: RestDayActivity | null; dayNumber: number }) {
  // Obter o nome do dia da semana
  const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
  const dayName = dayNames[(dayNumber - 1) % 7]

  if (!activity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col">
            <span>Dia {dayNumber}</span>
            <span className="text-base font-normal text-muted-foreground">{dayName}</span>
          </CardTitle>
          <CardDescription>Dia de descanso completo</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Hoje é um dia de descanso completo. Foque em dormir bem, manter-se hidratado e permitir que seu corpo se
            recupere dos treinos anteriores.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Verificar se a atividade é uma combinação
  const isCombination =
    activity.name.includes("+") || activity.name.includes("Combo") || activity.name.includes("Sessão")

  // Extrair as atividades individuais da descrição
  let individualActivities: string[] = []
  if (isCombination) {
    // Tentar extrair atividades da descrição ou notas
    const activitiesMatch =
      activity.notes?.match(/Sugestão(?:\s+de\s+sequência)?:\s+(.*?)\./) ||
      activity.description.match(/Faça.*?cada\s+atividade/) ||
      activity.name.match(/Combo:\s+(.*)/)

    if (activitiesMatch && activitiesMatch[1]) {
      individualActivities = activitiesMatch[1].split(/[→+]/).map((a) => a.trim())
    } else if (activity.name.includes("+")) {
      individualActivities = activity.name.split("+").map((a) => a.trim())
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex flex-col">
              <span>Dia {dayNumber}</span>
              <span className="text-base font-normal text-muted-foreground">{dayName}</span>
            </CardTitle>
            <CardDescription>Atividade de recuperação ativa</CardDescription>
          </div>
          <Badge variant="outline">{translateIntensity(activity.intensity)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{activity.name}</h3>
            <p className="mt-2">{activity.description}</p>
          </div>

          <div>
            <p className="font-medium">Duração recomendada: {activity.duration} minutos</p>
          </div>

          {isCombination && individualActivities.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Detalhamento das Atividades</h3>
              <div className="space-y-4">
                {individualActivities.map((activityName, idx) => (
                  <div key={idx} className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">{activityName}</h4>
                    <p className="mt-1 text-sm">{getActivityDescription(activityName)}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Dicas: </span>
                      {getActivityTips(activityName)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

// Função para obter descrição detalhada de uma atividade
function getActivityDescription(activityName: string): string {
  const activityDescriptions: Record<string, string> = {
    Caminhada:
      "Caminhada em ritmo moderado que ajuda na recuperação ativa, melhora a circulação sanguínea e promove o relaxamento mental. Mantenha um ritmo onde você consiga conversar confortavelmente.",
    "Caminhada na Natureza":
      "Caminhada em ambiente natural como parque, floresta ou praia. Além dos benefícios físicos, proporciona conexão com a natureza e redução do estresse.",
    Ciclismo:
      "Pedalada em ritmo leve que trabalha os membros inferiores sem impacto nas articulações. Mantenha uma cadência alta com resistência baixa.",
    Natação:
      "Atividade de baixíssimo impacto que trabalha todo o corpo enquanto relaxa os músculos. Alterne entre diferentes estilos em ritmo tranquilo.",
    Yoga: "Prática que combina posturas físicas, técnicas de respiração e meditação. Foque em posturas restaurativas que promovem flexibilidade e relaxamento.",
    Alongamento:
      "Série de exercícios que aumentam a flexibilidade muscular e amplitude de movimento. Mantenha cada alongamento por 20-30 segundos, respirando profundamente.",
    "Mobilidade Articular":
      "Exercícios específicos para melhorar a função e amplitude de movimento das articulações. Realize movimentos circulares e controlados em cada articulação.",
    "Foam Rolling":
      "Auto-massagem com rolo de espuma para liberar tensão muscular e fáscia. Passe o rolo lentamente sobre cada grupo muscular, pausando em áreas tensas.",
    Meditação:
      "Prática de atenção plena que reduz o estresse e promove o equilíbrio mental. Foque na respiração e na liberação de tensões.",
    "Elíptico Leve":
      "Exercício cardiovascular de baixo impacto que simula caminhada ou corrida sem estresse nas articulações. Mantenha resistência baixa e ritmo confortável.",
  }

  // Buscar correspondência parcial se não encontrar exata
  const exactMatch = activityDescriptions[activityName]
  if (exactMatch) return exactMatch

  for (const [key, description] of Object.entries(activityDescriptions)) {
    if (activityName.includes(key)) {
      return description
    }
  }

  return "Atividade de recuperação que ajuda a melhorar a circulação sanguínea e promover o relaxamento muscular."
}

// Função para obter dicas específicas para uma atividade
function getActivityTips(activityName: string): string {
  const activityTips: Record<string, string> = {
    Caminhada:
      "Use calçados confortáveis, mantenha boa postura e hidrate-se adequadamente. Respire profundamente e aproveite o momento.",
    "Caminhada na Natureza":
      "Escolha trilhas adequadas ao seu nível, leve água, use protetor solar e observe a natureza ao seu redor para maximizar os benefícios mentais.",
    Ciclismo:
      "Ajuste corretamente a altura do selim, mantenha os joelhos levemente flexionados no ponto mais baixo do pedal e evite subidas íngremes.",
    Natação:
      "Foque na técnica e não na velocidade. Respire de forma rítmica e use equipamentos como pranchas se necessário para facilitar o movimento.",
    Yoga: "Não force além do seu limite, respeite as limitações do seu corpo e foque na respiração durante as posturas. Use props como blocos se necessário.",
    Alongamento:
      "Nunca force até sentir dor, apenas um leve desconforto. Respire profundamente durante os alongamentos e evite movimentos bruscos.",
    "Mobilidade Articular":
      "Realize os movimentos de forma lenta e controlada, aumentando gradualmente a amplitude. Preste atenção a qualquer desconforto anormal.",
    "Foam Rolling":
      "Aplique pressão moderada, evitando áreas ósseas e articulações. Passe 30-60 segundos em cada grupo muscular, respirando profundamente.",
    Meditação:
      "Encontre um local tranquilo, mantenha uma postura confortável e foque na respiração. Se a mente divagar, gentilmente traga o foco de volta.",
    "Elíptico Leve":
      "Mantenha postura ereta, segure levemente nos apoios e distribua o peso igualmente entre os pés. Ajuste a resistência para manter um ritmo confortável.",
  }

  // Buscar correspondência parcial se não encontrar exata
  const exactMatch = activityTips[activityName]
  if (exactMatch) return exactMatch

  for (const [key, tips] of Object.entries(activityTips)) {
    if (activityName.includes(key)) {
      return tips
    }
  }

  return "Mantenha a intensidade baixa, foque na qualidade do movimento e na respiração controlada. Esta é uma atividade de recuperação, não um treino intenso."
}

function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  // Determinar o objetivo principal do suplemento
  const mainPurpose = getSupplementMainPurpose(supplement)

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg">{supplement.name}</h3>
        <div className="flex gap-2">
          <Badge variant={getPriorityVariant(supplement.priority)}>{translatePriority(supplement.priority)}</Badge>
          {mainPurpose && <Badge variant="secondary">{mainPurpose}</Badge>}
        </div>
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

// Função para determinar o objetivo principal de um suplemento
function getSupplementMainPurpose(supplement: SupplementRecommendation): string {
  // Palavras-chave para categorizar suplementos
  const keywords: Record<string, string[]> = {
    Recuperação: ["recuperação", "recuperação muscular", "reparação", "regeneração"],
    Energia: ["energia", "desempenho", "resistência", "fadiga"],
    Força: ["força", "potência", "explosão"],
    "Massa Muscular": ["massa muscular", "hipertrofia", "síntese proteica", "anabólico"],
    "Saúde Geral": ["saúde", "imunidade", "bem-estar", "antioxidante"],
    "Queima de Gordura": ["gordura", "metabolismo", "termogênico", "oxidação"],
    "Foco Mental": ["foco", "concentração", "mental", "cognitivo"],
    Hormonal: ["hormônio", "testosterona", "hormonal"],
    "Anti-inflamatório": ["inflamação", "anti-inflamatório", "articulações"],
  }

  // Verificar o nome e descrição do suplemento
  const nameAndDesc = (supplement.name + " " + supplement.description).toLowerCase()

  // Verificar os benefícios
  const allBenefits = supplement.benefits.join(" ").toLowerCase()

  // Pontuação para cada categoria
  const scores: Record<string, number> = {}

  // Inicializar pontuações
  Object.keys(keywords).forEach((category) => {
    scores[category] = 0
  })

  // Calcular pontuações
  Object.entries(keywords).forEach(([category, words]) => {
    words.forEach((word) => {
      if (nameAndDesc.includes(word.toLowerCase())) {
        scores[category] += 2
      }
      if (allBenefits.includes(word.toLowerCase())) {
        scores[category] += 1
      }
    })
  })

  // Casos especiais baseados no nome
  if (supplement.name.toLowerCase().includes("proteína") || supplement.name.toLowerCase().includes("whey")) {
    scores["Massa Muscular"] += 5
    scores["Recuperação"] += 3
  }
  if (supplement.name.toLowerCase().includes("creatina")) {
    scores["Força"] += 5
    scores["Massa Muscular"] += 3
  }
  if (supplement.name.toLowerCase().includes("cafeína")) {
    scores["Energia"] += 5
    scores["Foco Mental"] += 3
  }
  if (supplement.name.toLowerCase().includes("ômega") || supplement.name.toLowerCase().includes("omega")) {
    scores["Anti-inflamatório"] += 5
    scores["Saúde Geral"] += 3
  }
  if (supplement.name.toLowerCase().includes("vitamina") || supplement.name.toLowerCase().includes("mineral")) {
    scores["Saúde Geral"] += 5
  }

  // Encontrar a categoria com maior pontuação
  let maxScore = 0
  let mainPurpose = ""

  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score
      mainPurpose = category
    }
  })

  return mainPurpose || "Suplementação"
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
