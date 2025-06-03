"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Download, Loader2 } from "lucide-react"
import { exportWorkoutPlanToPDF } from "@/utils/pdfExport"
import type { WorkoutPlan } from "@/types/Workout"
import { toast } from "sonner"

interface PDFPreviewModalProps {
    workoutPlan: WorkoutPlan
    className?: string
}

export default function PDFPreviewModal({ workoutPlan, className }: PDFPreviewModalProps) {
    const [isExporting, setIsExporting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDownload = async () => {
        try {
            setIsExporting(true)
            await exportWorkoutPlanToPDF(workoutPlan)
            toast.success("PDF exportado com sucesso!")
        } catch (error) {
            console.error("Erro ao exportar PDF:", error)
            toast.error("Erro ao exportar o PDF. Por favor, tente novamente.")
        } finally {
            setIsExporting(false)
        }
    }

    // Obter a semana atual
    const currentWeek =
        workoutPlan.weeks.find((week) => week.weekNumber === workoutPlan.currentWeek) || workoutPlan.weeks[0]

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className={className}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar Plano
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Visualização do Plano de Treino</DialogTitle>
                    <DialogDescription>Visualize seu plano de treino antes de baixá-lo como PDF.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6 print:p-0">
                    {/* Cabeçalho do plano */}
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-blue-600">{workoutPlan.name}</h1>
                        <p className="mt-2">{workoutPlan.description}</p>
                    </div>

                    {/* Informações gerais */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Informações Gerais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                            <div>
                                <p>
                                    <strong>Área de Foco:</strong> {workoutPlan.focusArea}
                                </p>
                                <p>
                                    <strong>Nível:</strong> {workoutPlan.fitnessLevel}
                                </p>
                                <p>
                                    <strong>Treinos por Semana:</strong> {workoutPlan.daysPerWeek}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Dias de Descanso:</strong> {workoutPlan.restDays}
                                </p>
                                <p>
                                    <strong>Total de Semanas:</strong> {workoutPlan.totalWeeks}
                                </p>
                                <p>
                                    <strong>Semana Atual:</strong> {workoutPlan.currentWeek}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Métricas corporais se disponíveis */}
                    {workoutPlan.bodyMetrics && (
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Métricas Corporais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                                <div>
                                    <p>
                                        <strong>IMC:</strong> {workoutPlan.bodyMetrics.imc} ({workoutPlan.bodyMetrics.imcCategory})
                                    </p>
                                    <p>
                                        <strong>Taxa Metabólica Basal:</strong> {workoutPlan.bodyMetrics.basalMetabolicRate} kcal
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Necessidade Calórica Diária:</strong> {workoutPlan.bodyMetrics.dailyCalorieNeeds} kcal
                                    </p>
                                    <p>
                                        <strong>Estimativa de Gordura Corporal:</strong> {workoutPlan.bodyMetrics.bodyFatPercentageEstimate}
                                        %
                                    </p>
                                    {workoutPlan.bodyMetrics.waistToHipRatio && (
                                        <p>
                                            <strong>Relação Cintura-Quadril:</strong> {workoutPlan.bodyMetrics.waistToHipRatio.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Semana atual */}
                    <div>
                        <h2 className="text-xl font-semibold mb-1">
                            Semana {currentWeek.weekNumber}: {currentWeek.focus}
                        </h2>
                        <p className="mb-4">{currentWeek.description}</p>

                        {/* Treinos da semana */}
                        <h3 className="text-lg font-medium mb-3">Treinos desta semana:</h3>
                        <div className="space-y-6">
                            {currentWeek.workouts.map((workout, index) => (
                                <div key={workout.id} className="border p-4 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-semibold">
                                            Treino {index + 1}: {workout.name}
                                        </h4>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {workout.targetMuscleGroups.join(", ")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
                                    <p className="text-sm mt-2">
                                        <strong>Duração:</strong> {workout.estimatedDuration} minutos
                                    </p>

                                    {/* Tabela de exercícios */}
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Exercício</th>
                                                    <th className="px-4 py-2 text-left">Séries x Reps</th>
                                                    <th className="px-4 py-2 text-left">Músculos</th>
                                                    <th className="px-4 py-2 text-left">Dificuldade</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {workout.exercises.map((exercise, i) => (
                                                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                        <td className="px-4 py-2">{exercise.name}</td>
                                                        <td className="px-4 py-2">
                                                            {exercise.sets} x {exercise.reps}
                                                        </td>
                                                        <td className="px-4 py-2">{exercise.targetMuscles.join(", ")}</td>
                                                        <td className="px-4 py-2">{exercise.difficulty}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atividades para dias de descanso */}
                    {currentWeek.restDayActivities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Atividades para Dias de Descanso:</h3>
                            <div className="space-y-4">
                                {currentWeek.restDayActivities.map((activity, index) => (
                                    <div key={index} className="border p-4 rounded-md bg-green-50">
                                        <h4 className="font-medium">{activity.name}</h4>
                                        <p className="text-sm mt-1">{activity.description}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                            <p>
                                                <strong>Duração:</strong> {activity.duration} minutos
                                            </p>
                                            <p>
                                                <strong>Intensidade:</strong> {activity.intensity}
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium">Benefícios:</p>
                                            <ul className="list-disc list-inside text-sm">
                                                {activity.benefits.map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recomendações de suplementos */}
                    {workoutPlan.supplementRecommendations && workoutPlan.supplementRecommendations.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Recomendações de Suplementos:</h3>
                            <div className="space-y-4">
                                {workoutPlan.supplementRecommendations.map((supplement, index) => (
                                    <div key={index} className="border p-4 rounded-md">
                                        <h4 className="font-medium">{supplement.name}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                                            <p>
                                                <strong>Dosagem:</strong> {supplement.dosage}
                                            </p>
                                            <p>
                                                <strong>Momento:</strong> {supplement.timing}
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium">Benefícios:</p>
                                            <ul className="list-disc list-inside text-sm">
                                                {supplement.benefits.map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recomendações de sono */}
                    {workoutPlan.sleepRecommendations && workoutPlan.sleepRecommendations.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Recomendações de Sono:</h3>
                            <ul className="list-disc list-inside space-y-1 bg-blue-50 p-4 rounded-md">
                                {workoutPlan.sleepRecommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Notas */}
                    {workoutPlan.notes && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Notas:</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm">{workoutPlan.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Rodapé */}
                    <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
                        <p>Gerado em: {new Date().toLocaleDateString("pt-BR")}</p>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button onClick={handleDownload} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exportando...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar PDF
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
