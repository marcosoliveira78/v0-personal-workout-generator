export interface RestActivityOption {
  id: string
  label: string
  description: string
  hasDuration: boolean
  hasDistance: boolean
  defaultMinDuration?: number
  defaultMaxDuration?: number
  defaultMinDistance?: number
  defaultMaxDistance?: number
  unit?: string
  intensityRange: string
  benefits: string[]
}

export const restActivityOptions: RestActivityOption[] = [
  {
    id: "walking",
    label: "Caminhada",
    description: "Caminhada em ritmo leve a moderado",
    hasDuration: true,
    hasDistance: true,
    defaultMinDuration: 20,
    defaultMaxDuration: 60,
    defaultMinDistance: 2,
    defaultMaxDistance: 6,
    unit: "km",
    intensityRange: "Leve a Moderada",
    benefits: ["Recuperação ativa", "Queima calórica", "Baixo impacto", "Melhora cardiovascular"],
  },
  {
    id: "cycling",
    label: "Ciclismo",
    description: "Ciclismo em terreno plano com intensidade leve",
    hasDuration: true,
    hasDistance: true,
    defaultMinDuration: 20,
    defaultMaxDuration: 60,
    defaultMinDistance: 5,
    defaultMaxDistance: 20,
    unit: "km",
    intensityRange: "Leve a Moderada",
    benefits: ["Recuperação ativa", "Fortalecimento de pernas", "Baixo impacto", "Melhora cardiovascular"],
  },
  {
    id: "swimming",
    label: "Natação",
    description: "Natação em ritmo leve",
    hasDuration: true,
    hasDistance: true,
    defaultMinDuration: 15,
    defaultMaxDuration: 45,
    defaultMinDistance: 0.5,
    defaultMaxDistance: 2,
    unit: "km",
    intensityRange: "Leve a Moderada",
    benefits: ["Recuperação ativa", "Trabalho de corpo inteiro", "Zero impacto", "Melhora cardiovascular"],
  },
  {
    id: "yoga",
    label: "Yoga",
    description: "Prática de yoga com foco em alongamento e relaxamento",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 15,
    defaultMaxDuration: 60,
    intensityRange: "Muito Leve a Leve",
    benefits: ["Flexibilidade", "Redução do estresse", "Equilíbrio", "Recuperação mental"],
  },
  {
    id: "stretching",
    label: "Alongamento",
    description: "Sessão de alongamento para todos os principais grupos musculares",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 10,
    defaultMaxDuration: 30,
    intensityRange: "Muito Leve",
    benefits: ["Flexibilidade", "Prevenção de lesões", "Recuperação muscular", "Redução da tensão"],
  },
  {
    id: "mobility",
    label: "Mobilidade Articular",
    description: "Exercícios de mobilidade para melhorar a amplitude de movimento das articulações",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 10,
    defaultMaxDuration: 30,
    intensityRange: "Muito Leve",
    benefits: ["Amplitude de movimento", "Prevenção de lesões", "Melhora da função articular", "Recuperação"],
  },
  {
    id: "hiking",
    label: "Caminhada na Natureza",
    description: "Caminhada em trilhas ou parques com contato com a natureza",
    hasDuration: true,
    hasDistance: true,
    defaultMinDuration: 30,
    defaultMaxDuration: 120,
    defaultMinDistance: 2,
    defaultMaxDistance: 10,
    unit: "km",
    intensityRange: "Leve a Moderada",
    benefits: ["Recuperação ativa", "Redução do estresse", "Conexão com a natureza", "Melhora cardiovascular"],
  },
  {
    id: "foam_rolling",
    label: "Foam Rolling",
    description: "Auto-massagem com rolo de espuma para liberar tensão muscular",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 10,
    defaultMaxDuration: 20,
    intensityRange: "Muito Leve",
    benefits: ["Liberação miofascial", "Redução de nódulos", "Melhora da circulação", "Recuperação muscular"],
  },
  {
    id: "meditation",
    label: "Meditação",
    description: "Prática de meditação e exercícios de respiração",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 10,
    defaultMaxDuration: 30,
    intensityRange: "Muito Leve",
    benefits: ["Redução do estresse", "Recuperação mental", "Melhora do sono", "Equilíbrio emocional"],
  },
  {
    id: "light_elliptical",
    label: "Elíptico Leve",
    description: "Exercício em elíptico com resistência baixa",
    hasDuration: true,
    hasDistance: false,
    defaultMinDuration: 15,
    defaultMaxDuration: 45,
    intensityRange: "Leve",
    benefits: ["Recuperação ativa", "Zero impacto", "Melhora cardiovascular", "Trabalho de corpo inteiro"],
  },
]
