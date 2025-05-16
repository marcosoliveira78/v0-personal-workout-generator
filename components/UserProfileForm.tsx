"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { restActivityOptions } from "@/data/restActivityOptions"
import type { UserProfile, RestActivityPreference } from "@/types/UserProfile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Esquema completo para o formulário
const formSchema = z.object({
  age: z.coerce.number().min(16, "Idade mínima é 16 anos").max(100, "Idade máxima é 100 anos"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Por favor selecione um gênero",
  }),
  height: z.coerce.number().min(100, "Altura mínima é 100 cm").max(250, "Altura máxima é 250 cm"),
  weight: z.coerce.number().min(30, "Peso mínimo é 30 kg").max(250, "Peso máxima é 250 kg"),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Por favor selecione um nível de condicionamento",
  }),
  fitnessGoals: z.enum(["weightLoss", "muscleGain", "endurance", "strength", "toning"], {
    required_error: "Por favor selecione um objetivo",
  }),
  workoutsPerWeek: z.coerce.number().min(1).max(7),
  timePerWorkout: z.coerce.number().min(15).max(120),
  exercisesPerWorkout: z.coerce.number().min(3).max(12).optional(),
  focusAreas: z.enum(["fullBody", "upperBody", "lowerBody", "core", "glutes"], {
    required_error: "Por favor selecione uma área de foco",
  }),
  healthConditions: z.string().optional(),
  trainingExperience: z.coerce.number().min(0).max(50).optional(),
  sleepWeekday: z.coerce.number().min(4).max(12),
  sleepWeekend: z.coerce.number().min(4).max(12),
  supplements: z.array(z.string()).default([]),
  restActivityIds: z.array(z.string()).default([]),

  // Medidas corporais adicionais
  waistCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(40).max(200),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  hipCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(40).max(200),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  chestCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(40).max(200),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  armCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(15).max(60),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  thighCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(30).max(100),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  calfCircumference: z
    .union([
      z.string().refine((val) => val === "", { message: "Deve ser um número válido ou vazio" }),
      z.coerce.number().min(20).max(60),
    ])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
})

const supplementOptions = [
  { id: "protein", label: "Proteína (Whey, Caseína, etc.)" },
  { id: "creatine", label: "Creatina" },
  { id: "bcaa", label: "BCAA" },
  { id: "preworkout", label: "Pré-treino" },
  { id: "multivitamin", label: "Multivitamínico" },
  { id: "omega3", label: "Ômega 3" },
  { id: "vitaminD", label: "Vitamina D" },
  { id: "zma", label: "ZMA" },
  { id: "glutamine", label: "Glutamina" },
  { id: "fatBurner", label: "Termogênico" },
  { id: "betaAlanine", label: "Beta-Alanina" },
  { id: "citrullineMalate", label: "Citrulina Malato" },
  { id: "caffeine", label: "Cafeína Anidra" },
  { id: "carboPowder", label: "Carboidratos em Pó" },
]

interface UserProfileFormProps {
  onSubmit: (data: UserProfile) => void
  initialData?: UserProfile | null
  isSubmitting?: boolean
}

export default function UserProfileForm({ onSubmit, initialData, isSubmitting = false }: UserProfileFormProps) {
  // Extrair IDs de atividades selecionadas do initialData
  const initialRestActivityIds = initialData?.restActivities
    ? Object.keys(initialData.restActivities).filter((key) => initialData.restActivities[key].selected)
    : []

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: initialData?.age || 30,
      gender: initialData?.gender || "male",
      height: initialData?.height || 170,
      weight: initialData?.weight || 70,
      fitnessLevel: initialData?.fitnessLevel || "intermediate",
      fitnessGoals: initialData?.fitnessGoals || "strength",
      workoutsPerWeek: initialData?.workoutsPerWeek || 3,
      timePerWorkout: initialData?.timePerWorkout || 45,
      exercisesPerWorkout: initialData?.exercisesPerWorkout || 5,
      focusAreas: initialData?.focusAreas || "fullBody",
      healthConditions: initialData?.healthConditions || "",
      trainingExperience: initialData?.trainingExperience || 0,
      sleepWeekday: initialData?.sleepWeekday || 7,
      sleepWeekend: initialData?.sleepWeekend || 8,
      supplements: initialData?.supplements || [],
      restActivityIds: initialRestActivityIds,

      // Medidas corporais adicionais
      waistCircumference: initialData?.waistCircumference,
      hipCircumference: initialData?.hipCircumference,
      chestCircumference: initialData?.chestCircumference,
      armCircumference: initialData?.armCircumference,
      thighCircumference: initialData?.thighCircumference,
      calfCircumference: initialData?.calfCircumference,
    },
  })

  const workoutsPerWeek = watch("workoutsPerWeek")
  const timePerWorkout = watch("timePerWorkout")
  const exercisesPerWorkout = watch("exercisesPerWorkout") || 5
  const trainingExperience = watch("trainingExperience")
  const sleepWeekday = watch("sleepWeekday")
  const sleepWeekend = watch("sleepWeekend")
  const supplements = watch("supplements")
  const restActivityIds = watch("restActivityIds")

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Converter os dados do formulário para o formato UserProfile
    const restActivities: Record<string, RestActivityPreference> = {}

    // Inicializar todas as atividades como não selecionadas
    restActivityOptions.forEach((option) => {
      restActivities[option.id] = {
        type: option.id,
        selected: false,
        minDuration: option.defaultMinDuration,
        maxDuration: option.defaultMaxDuration,
        minDistance: option.defaultMinDistance,
        maxDistance: option.defaultMaxDistance,
      }
    })

    // Marcar as atividades selecionadas
    values.restActivityIds.forEach((id) => {
      if (restActivities[id]) {
        restActivities[id].selected = true
      }
    })

    const profileData: UserProfile = {
      ...values,
      restActivities,
    } as UserProfile

    onSubmit(profileData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="training">Treino</TabsTrigger>
          <TabsTrigger value="measurements">Medidas</TabsTrigger>
          <TabsTrigger value="supplements">Suplementos</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium">
                Idade
              </label>
              <Input id="age" type="number" {...register("age")} />
              {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gênero
              </label>
              <Select
                defaultValue={getValues("gender")}
                onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Altura (cm)
              </label>
              <Input id="height" type="number" {...register("height")} />
              {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Peso (kg)
              </label>
              <Input id="weight" type="number" {...register("weight")} />
              {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sono e Recuperação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sleepWeekday" className="text-sm font-medium">
                  Horas de Sono (Dias de Semana): {sleepWeekday}
                </label>
                <Slider
                  id="sleepWeekday"
                  defaultValue={[sleepWeekday]}
                  min={4}
                  max={12}
                  step={0.5}
                  onValueChange={(vals) => setValue("sleepWeekday", vals[0])}
                />
                <p className="text-xs text-muted-foreground">Média de horas de sono por noite durante a semana</p>
                {errors.sleepWeekday && <p className="text-sm text-red-500">{errors.sleepWeekday.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="sleepWeekend" className="text-sm font-medium">
                  Horas de Sono (Fim de Semana): {sleepWeekend}
                </label>
                <Slider
                  id="sleepWeekend"
                  defaultValue={[sleepWeekend]}
                  min={4}
                  max={12}
                  step={0.5}
                  onValueChange={(vals) => setValue("sleepWeekend", vals[0])}
                />
                <p className="text-xs text-muted-foreground">Média de horas de sono por noite nos fins de semana</p>
                {errors.sleepWeekend && <p className="text-sm text-red-500">{errors.sleepWeekend.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="healthConditions" className="text-sm font-medium">
              Condições de Saúde (opcional)
            </label>
            <Input id="healthConditions" {...register("healthConditions")} />
            <p className="text-xs text-muted-foreground">
              Liste quaisquer condições de saúde que possam afetar seu treino
            </p>
            {errors.healthConditions && <p className="text-sm text-red-500">{errors.healthConditions.message}</p>}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fitnessLevel" className="text-sm font-medium">
                Nível de Condicionamento
              </label>
              <Select
                defaultValue={getValues("fitnessLevel")}
                onValueChange={(value) => setValue("fitnessLevel", value as "beginner" | "intermediate" | "advanced")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
              {errors.fitnessLevel && <p className="text-sm text-red-500">{errors.fitnessLevel.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="fitnessGoals" className="text-sm font-medium">
                Objetivos
              </label>
              <Select
                defaultValue={getValues("fitnessGoals")}
                onValueChange={(value) =>
                  setValue("fitnessGoals", value as "weightLoss" | "muscleGain" | "endurance" | "strength" | "toning")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Perda de Peso</SelectItem>
                  <SelectItem value="muscleGain">Ganho de Massa</SelectItem>
                  <SelectItem value="endurance">Resistência</SelectItem>
                  <SelectItem value="strength">Força</SelectItem>
                  <SelectItem value="toning">Definição</SelectItem>
                </SelectContent>
              </Select>
              {errors.fitnessGoals && <p className="text-sm text-red-500">{errors.fitnessGoals.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="workoutsPerWeek" className="text-sm font-medium">
                Treinos por Semana: {workoutsPerWeek}
              </label>
              <Slider
                id="workoutsPerWeek"
                defaultValue={[workoutsPerWeek]}
                min={1}
                max={7}
                step={1}
                onValueChange={(vals) => setValue("workoutsPerWeek", vals[0])}
              />
              {errors.workoutsPerWeek && <p className="text-sm text-red-500">{errors.workoutsPerWeek.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="timePerWorkout" className="text-sm font-medium">
                Minutos por Treino: {timePerWorkout}
              </label>
              <Slider
                id="timePerWorkout"
                defaultValue={[timePerWorkout]}
                min={15}
                max={120}
                step={5}
                onValueChange={(vals) => setValue("timePerWorkout", vals[0])}
              />
              {errors.timePerWorkout && <p className="text-sm text-red-500">{errors.timePerWorkout.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="exercisesPerWorkout" className="text-sm font-medium">
                Exercícios por Treino: {exercisesPerWorkout}
              </label>
              <Slider
                id="exercisesPerWorkout"
                defaultValue={[exercisesPerWorkout]}
                min={3}
                max={12}
                step={1}
                onValueChange={(vals) => setValue("exercisesPerWorkout", vals[0])}
              />
              <p className="text-xs text-muted-foreground">Quantidade de exercícios diferentes em cada treino</p>
              {errors.exercisesPerWorkout && (
                <p className="text-sm text-red-500">{errors.exercisesPerWorkout.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="focusAreas" className="text-sm font-medium">
                Áreas de Foco
              </label>
              <Select
                defaultValue={getValues("focusAreas")}
                onValueChange={(value) =>
                  setValue("focusAreas", value as "fullBody" | "upperBody" | "lowerBody" | "core" | "glutes")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área de foco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullBody">Corpo Inteiro</SelectItem>
                  <SelectItem value="upperBody">Parte Superior</SelectItem>
                  <SelectItem value="lowerBody">Parte Inferior</SelectItem>
                  <SelectItem value="core">Core/Abdômen</SelectItem>
                  <SelectItem value="glutes">Glúteos</SelectItem>
                </SelectContent>
              </Select>
              {errors.focusAreas && <p className="text-sm text-red-500">{errors.focusAreas.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="trainingExperience" className="text-sm font-medium">
                Anos de Experiência com Treinos: {trainingExperience}
              </label>
              <Slider
                id="trainingExperience"
                defaultValue={[trainingExperience || 0]}
                min={0}
                max={20}
                step={1}
                onValueChange={(vals) => setValue("trainingExperience", vals[0])}
              />
              {errors.trainingExperience && <p className="text-sm text-red-500">{errors.trainingExperience.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Atividades para Dias de Descanso</h3>
            <p className="text-sm text-muted-foreground">
              Selecione as atividades que você gostaria de realizar nos dias de descanso
            </p>

            <div className="space-y-4 border rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {restActivityOptions.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity-${activity.id}`}
                      checked={restActivityIds.includes(activity.id)}
                      onCheckedChange={(checked) => {
                        const currentValues = getValues("restActivityIds")
                        const newValues = checked
                          ? [...currentValues, activity.id]
                          : currentValues.filter((value) => value !== activity.id)
                        setValue("restActivityIds", newValues, { shouldValidate: true })
                      }}
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor={`activity-${activity.id}`} className="text-sm font-medium cursor-pointer">
                        {activity.label}
                      </label>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.restActivityIds && <p className="text-sm text-red-500">{errors.restActivityIds.message}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Medidas Corporais (opcional)</h3>
            <p className="text-sm text-muted-foreground">
              Forneça suas medidas corporais para cálculos mais precisos e acompanhamento de progresso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="waistCircumference" className="text-sm font-medium">
                Circunferência Abdominal (cm)
              </label>
              <Input id="waistCircumference" type="text" placeholder="Opcional" {...register("waistCircumference")} />
              {errors.waistCircumference && <p className="text-sm text-red-500">{errors.waistCircumference.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="hipCircumference" className="text-sm font-medium">
                Circunferência dos Quadris (cm)
              </label>
              <Input id="hipCircumference" type="text" placeholder="Opcional" {...register("hipCircumference")} />
              {errors.hipCircumference && <p className="text-sm text-red-500">{errors.hipCircumference.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="chestCircumference" className="text-sm font-medium">
                Circunferência do Peito/Tórax (cm)
              </label>
              <Input id="chestCircumference" type="text" placeholder="Opcional" {...register("chestCircumference")} />
              {errors.chestCircumference && <p className="text-sm text-red-500">{errors.chestCircumference.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="armCircumference" className="text-sm font-medium">
                Circunferência dos Braços (cm)
              </label>
              <Input id="armCircumference" type="text" placeholder="Opcional" {...register("armCircumference")} />
              {errors.armCircumference && <p className="text-sm text-red-500">{errors.armCircumference.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="thighCircumference" className="text-sm font-medium">
                Circunferência das Coxas (cm)
              </label>
              <Input id="thighCircumference" type="text" placeholder="Opcional" {...register("thighCircumference")} />
              {errors.thighCircumference && <p className="text-sm text-red-500">{errors.thighCircumference.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="calfCircumference" className="text-sm font-medium">
                Circunferência das Panturrilhas (cm)
              </label>
              <Input id="calfCircumference" type="text" placeholder="Opcional" {...register("calfCircumference")} />
              {errors.calfCircumference && <p className="text-sm text-red-500">{errors.calfCircumference.message}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-4 pt-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Suplementação</h3>
            <p className="text-base font-medium">Suplementos que você utiliza atualmente</p>
            <p className="text-sm text-muted-foreground">
              Selecione todos os suplementos que você utiliza regularmente
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
            {supplementOptions.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`supplement-${item.id}`}
                  checked={supplements.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const currentValues = getValues("supplements")
                    const newValues = checked
                      ? [...currentValues, item.id]
                      : currentValues.filter((value) => value !== item.id)
                    setValue("supplements", newValues, { shouldValidate: true })
                  }}
                />
                <label htmlFor={`supplement-${item.id}`} className="text-sm font-medium cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
            {errors.supplements && <p className="text-sm text-red-500">{errors.supplements.message}</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando Plano de Treino...
          </>
        ) : (
          "Gerar Plano de Treino"
        )}
      </Button>
    </form>
  )
}
