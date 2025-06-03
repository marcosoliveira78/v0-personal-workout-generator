import type { WorkoutPlan } from "@/types/Workout"

export async function exportWorkoutPlanToPDF(workoutPlan: WorkoutPlan): Promise<void> {
    try {
        // Importar dinamicamente jsPDF
        const jsPDFModule = await import("jspdf")
        const jsPDF = jsPDFModule.default

        // Importar e configurar jspdf-autotable
        const autoTableModule = await import("jspdf-autotable")
        const autoTable = autoTableModule.default

        // Criar um novo documento PDF
        const doc = new jsPDF()

        // Configurar propriedades do documento
        doc.setProperties({
            title: workoutPlan.name,
            subject: "Plano de Treino",
            author: "Gerador de Treinos Personalizado",
            keywords: "treino, fitness, plano, academia",
            creator: "Gerador de Treinos Personalizado",
        })

        // Adicionar título
        doc.setFontSize(20)
        doc.text(workoutPlan.name, 14, 22)

        // Adicionar descrição
        doc.setFontSize(12)
        const descriptionLines = doc.splitTextToSize(workoutPlan.description, 180)
        doc.text(descriptionLines, 14, 32)

        // Adicionar informações gerais
        doc.setFontSize(16)
        doc.text("Informações Gerais", 14, 45)

        const generalInfo = [
            ["Área de Foco", workoutPlan.focusArea],
            ["Nível", translateFitnessLevel(workoutPlan.fitnessLevel)],
            ["Treinos por Semana", workoutPlan.daysPerWeek.toString()],
            ["Dias de Descanso", workoutPlan.restDays.toString()],
            ["Total de Semanas", workoutPlan.totalWeeks.toString()],
            ["Semana Atual", workoutPlan.currentWeek.toString()],
        ]

        // Usar autoTable através do módulo importado
        autoTable(doc, {
            startY: 50,
            head: [["Parâmetro", "Valor"]],
            body: generalInfo,
            theme: "striped",
            headStyles: { fillColor: [66, 66, 66] },
            styles: { fontSize: 10 },
        })

        // Definir uma posição Y inicial segura
        let yPosition = 120 // Posição estimada após a tabela de informações gerais

        // Adicionar métricas corporais se disponíveis
        if (workoutPlan.bodyMetrics) {
            doc.setFontSize(16)
            doc.text("Métricas Corporais", 14, yPosition)

            const metricsData = [
                ["IMC", `${workoutPlan.bodyMetrics.imc} (${workoutPlan.bodyMetrics.imcCategory})`],
                ["Taxa Metabólica Basal", `${workoutPlan.bodyMetrics.basalMetabolicRate} kcal`],
                ["Necessidade Calórica Diária", `${workoutPlan.bodyMetrics.dailyCalorieNeeds} kcal`],
                ["Estimativa de Gordura Corporal", `${workoutPlan.bodyMetrics.bodyFatPercentageEstimate}%`],
            ]

            // Adicionar métricas adicionais se disponíveis
            if (workoutPlan.bodyMetrics.waistToHipRatio) {
                metricsData.push(["Relação Cintura-Quadril", workoutPlan.bodyMetrics.waistToHipRatio.toFixed(2)])
            }

            autoTable(doc, {
                startY: yPosition + 5,
                head: [["Métrica", "Valor"]],
                body: metricsData,
                theme: "striped",
                headStyles: { fillColor: [66, 66, 66] },
                styles: { fontSize: 10 },
                didDrawPage: (data) => {
                    // Atualizar a posição Y após desenhar a tabela
                    if (data.cursor) {
                        if (data.cursor) {
                            if (data.cursor) {
                                if (data.cursor) {
                                    if (data.cursor && data.cursor.y != null) {
                                        if (data.cursor && data.cursor.y != null) {
                                            if (data.cursor && data.cursor.y != null) {
                                                if (data.cursor && data.cursor.y != null) {
                                                    yPosition = data.cursor.y + 15
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            })
        } else {
            // Se não houver métricas corporais, avançar a posição Y
            yPosition += 10
        }

        // Obter a semana atual
        const currentWeek =
            workoutPlan.weeks.find((week) => week.weekNumber === workoutPlan.currentWeek) || workoutPlan.weeks[0]

        // Verificar se precisamos de uma nova página
        if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
        }

        doc.setFontSize(16)
        doc.text(`Semana ${currentWeek.weekNumber}: ${currentWeek.focus}`, 14, yPosition)
        doc.setFontSize(12)
        const weekDescriptionLines = doc.splitTextToSize(currentWeek.description, 180)
        doc.text(weekDescriptionLines, 14, yPosition + 10)

        // Atualizar a posição Y após o texto da descrição da semana
        yPosition += 10 + weekDescriptionLines.length * 5

        // Adicionar cada treino da semana atual
        currentWeek.workouts.forEach((workout, index) => {
            // Verificar se precisamos de uma nova página
            if (yPosition > 250) {
                doc.addPage()
                yPosition = 20
            }

            doc.setFontSize(14)
            doc.text(`Treino ${index + 1}: ${workout.name}`, 14, yPosition)

            doc.setFontSize(10)
            doc.text(`Músculos: ${workout.targetMuscleGroups.join(", ")}`, 14, yPosition + 8)
            doc.text(`Duração: ${workout.estimatedDuration} minutos`, 14, yPosition + 14)

            // Adicionar exercícios
            const exercisesData = workout.exercises.map((exercise) => [
                exercise.name,
                `${exercise.sets} x ${exercise.reps}`,
                exercise.targetMuscles.join(", "),
                translateDifficulty(exercise.difficulty),
                exercise.restBetweenSets ? `${exercise.restBetweenSets}s` : "-",
            ])

            autoTable(doc, {
                startY: yPosition + 20,
                head: [["Exercício", "Séries x Reps", "Músculos", "Dificuldade", "Descanso"]],
                body: exercisesData,
                theme: "striped",
                headStyles: { fillColor: [66, 66, 66] },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 40 },
                    2: { cellWidth: 50 },
                },
                didDrawPage: (data) => {
                    // Atualizar a posição Y após desenhar a tabela
                    if (data.cursor) {
                        yPosition = data.cursor.y + 15
                    }
                },
            })
        })

        // Adicionar atividades para dias de descanso
        if (currentWeek.restDayActivities.length > 0) {
            // Verificar se precisamos de uma nova página
            if (yPosition > 220) {
                doc.addPage()
                yPosition = 20
            }

            doc.setFontSize(16)
            doc.text("Atividades para Dias de Descanso", 14, yPosition)

            const restActivitiesData = currentWeek.restDayActivities.map((activity) => [
                activity.name,
                activity.duration + " min",
                translateIntensity(activity.intensity),
                activity.benefits[0],
            ])

            autoTable(doc, {
                startY: yPosition + 10,
                head: [["Atividade", "Duração", "Intensidade", "Benefício Principal"]],
                body: restActivitiesData,
                theme: "striped",
                headStyles: { fillColor: [66, 66, 66] },
                styles: { fontSize: 10 },
                didDrawPage: (data) => {
                    // Atualizar a posição Y após desenhar a tabela
                    if (data.cursor) {
                        yPosition = data.cursor.y + 15
                    }
                },
            })
        }

        // Adicionar recomendações de suplementos se disponíveis
        if (workoutPlan.supplementRecommendations && workoutPlan.supplementRecommendations.length > 0) {
            // Verificar se precisamos de uma nova página
            if (yPosition > 220) {
                doc.addPage()
                yPosition = 20
            } else {
                yPosition += 10
            }

            doc.setFontSize(16)
            doc.text("Recomendações de Suplementos", 14, yPosition)

            const supplementsData = workoutPlan.supplementRecommendations.map((supplement) => [
                supplement.name,
                supplement.dosage,
                supplement.timing,
                supplement.benefits.join(", "),
            ])

            autoTable(doc, {
                startY: yPosition + 10,
                head: [["Suplemento", "Dosagem", "Momento", "Benefícios"]],
                body: supplementsData,
                theme: "striped",
                headStyles: { fillColor: [66, 66, 66] },
                styles: { fontSize: 9 },
                didDrawPage: (data) => {
                    // Atualizar a posição Y após desenhar a tabela
                    if (data.cursor && data.cursor.y != null) {
                        yPosition = data.cursor.y + 15
                    }
                },
            })
        }

        // Adicionar recomendações de sono se disponíveis
        if (workoutPlan.sleepRecommendations && workoutPlan.sleepRecommendations.length > 0) {
            // Verificar se precisamos de uma nova página
            if (yPosition > 220) {
                doc.addPage()
                yPosition = 20
            }

            doc.setFontSize(16)
            doc.text("Recomendações de Sono", 14, yPosition)

            const sleepData = workoutPlan.sleepRecommendations.map((rec) => [rec])

            autoTable(doc, {
                startY: yPosition + 10,
                body: sleepData,
                theme: "plain",
                styles: { fontSize: 10 },
                didDrawPage: (data) => {
                    // Atualizar a posição Y após desenhar a tabela
                    if (data.cursor) {
                        yPosition = data.cursor.y + 15
                    }
                },            })
        }

        // Adicionar notas se disponíveis
        if (workoutPlan.notes) {
            // Verificar se precisamos de uma nova página
            if (yPosition > 220) {
                doc.addPage()
                yPosition = 20
            }

            doc.setFontSize(16)
            doc.text("Notas", 14, yPosition)

            doc.setFontSize(10)

            // Dividir notas em várias linhas se necessário
            const splitNotes = doc.splitTextToSize(workoutPlan.notes, 180)
            doc.text(splitNotes, 14, yPosition + 10)
        }

        // Adicionar rodapé com data
        const today = new Date()
        const dateStr = today.toLocaleDateString("pt-BR")
        doc.setFontSize(8)
        doc.text(`Gerado em: ${dateStr}`, 14, 285)

        // Salvar o PDF
        const fileName = `plano-treino-${workoutPlan.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
        doc.save(fileName)

        return Promise.resolve()
    } catch (error) {
        console.error("Erro ao exportar PDF:", error)
        return Promise.reject(error)
    }
}

// Funções auxiliares para tradução
function translateFitnessLevel(level: string): string {
    const translations: Record<string, string> = {
        beginner: "Iniciante",
        intermediate: "Intermediário",
        advanced: "Avançado",
    }
    return translations[level] || level
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
        very_light: "Muito Leve",
    }
    return translations[intensity] || intensity
}
