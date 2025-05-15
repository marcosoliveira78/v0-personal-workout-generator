import type { RestDayActivity } from "@/types/Workout"

export const restDayActivities: RestDayActivity[] = [
  {
    name: "Caminhada Leve",
    description: "Caminhada em ritmo tranquilo para promover recuperação ativa e circulação sanguínea.",
    duration: 30,
    intensity: "light",
    benefits: ["Recuperação ativa", "Melhora da circulação", "Baixo impacto nas articulações", "Queima calórica leve"],
    notes: "Mantenha um ritmo confortável onde você consegue conversar facilmente. Ideal para fazer ao ar livre.",
  },
  {
    name: "Alongamento Completo",
    description: "Sessão de alongamento para todos os principais grupos musculares.",
    duration: 20,
    intensity: "very_light",
    benefits: [
      "Melhora da flexibilidade",
      "Redução da tensão muscular",
      "Prevenção de lesões",
      "Melhora da amplitude de movimento",
    ],
    notes: "Mantenha cada alongamento por 20-30 segundos. Respire profundamente e relaxe durante os alongamentos.",
  },
  {
    name: "Yoga Restaurativo",
    description: "Prática de yoga suave focada em posturas de recuperação e relaxamento.",
    duration: 30,
    intensity: "very_light",
    benefits: ["Redução do estresse", "Melhora da flexibilidade", "Recuperação muscular", "Equilíbrio mente-corpo"],
    notes: "Foque na respiração profunda e na manutenção das posturas. Ideal para fazer antes de dormir.",
  },
  {
    name: "Natação Leve",
    description: "Natação em ritmo tranquilo para recuperação ativa sem impacto.",
    duration: 30,
    intensity: "light",
    benefits: [
      "Zero impacto nas articulações",
      "Trabalho de corpo inteiro",
      "Melhora da circulação",
      "Relaxamento muscular",
    ],
    notes:
      "Mantenha um ritmo constante e confortável. Alterne entre diferentes estilos para variar os músculos trabalhados.",
  },
  {
    name: "Ciclismo Leve",
    description: "Pedalada em ritmo tranquilo para recuperação ativa.",
    duration: 30,
    intensity: "light",
    benefits: [
      "Baixo impacto nas articulações",
      "Melhora da circulação nas pernas",
      "Recuperação ativa",
      "Resistência cardiovascular",
    ],
    notes: "Mantenha uma cadência alta com resistência baixa. Evite subidas íngremes ou sprints.",
  },
  {
    name: "Mobilidade Articular",
    description: "Exercícios específicos para melhorar a mobilidade das principais articulações.",
    duration: 20,
    intensity: "very_light",
    benefits: [
      "Melhora da amplitude de movimento",
      "Prevenção de lesões",
      "Melhora da função articular",
      "Preparação para treinos futuros",
    ],
    notes: "Realize movimentos circulares e controlados em cada articulação. Foque nas áreas mais rígidas.",
  },
  {
    name: "Meditação e Respiração",
    description: "Prática de meditação e exercícios de respiração para redução do estresse.",
    duration: 15,
    intensity: "very_light",
    benefits: [
      "Redução do estresse",
      "Melhora da qualidade do sono",
      "Recuperação mental",
      "Equilíbrio do sistema nervoso",
    ],
    notes: "Encontre um local tranquilo e confortável. Foque na respiração profunda e na liberação de tensão.",
  },
  {
    name: "Caminhada na Natureza",
    description: "Caminhada em ambiente natural como parque, floresta ou praia.",
    duration: 45,
    intensity: "light",
    benefits: ["Redução do estresse", "Exposição à luz natural", "Recuperação ativa", "Conexão com a natureza"],
    notes: "Aproveite o ambiente natural e respire profundamente. Mantenha um ritmo confortável e observe a natureza.",
  },
  {
    name: "Foam Rolling",
    description: "Auto-massagem com rolo de espuma para liberar tensão muscular e fáscia.",
    duration: 15,
    intensity: "very_light",
    benefits: [
      "Liberação miofascial",
      "Redução de nódulos musculares",
      "Melhora da circulação",
      "Aceleração da recuperação",
    ],
    notes:
      "Passe o rolo lentamente sobre cada grupo muscular, pausando em áreas tensas. Respire profundamente durante o processo.",
  },
  {
    name: "Hidroterapia",
    description: "Alternância entre água quente e fria para recuperação muscular.",
    duration: 15,
    intensity: "very_light",
    benefits: ["Redução da inflamação", "Aceleração da recuperação", "Melhora da circulação", "Relaxamento muscular"],
    notes:
      "Alterne entre 3-4 minutos de água quente e 1 minuto de água fria. Termine com água fria para reduzir inflamação.",
  },
]
