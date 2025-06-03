"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { WorkoutPlan } from "@/types/Workout"

interface PrintButtonProps {
    workoutPlan: WorkoutPlan
    className?: string
}

export default function PrintButton({ workoutPlan, className }: PrintButtonProps) {
    const handlePrint = () => {
        // Abrir uma nova janela para impressão
        const printWindow = window.open("", "_blank")

        if (!printWindow) {
            alert("Por favor, permita pop-ups para imprimir o plano de treino.")
            return
        }

        // Obter a semana atual
        const currentWeek =
            workoutPlan.weeks.find((week) => week.weekNumber === workoutPlan.currentWeek) || workoutPlan.weeks[0]

        // Criar o conteúdo HTML para impressão
        const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${workoutPlan.name}</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
        }
        h2 {
            color: #1f2937;
            margin-top: 20px;
        }
        h3 {
            color: #4b5563;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 8px;
            border: 1px solid #e5e7eb;
        }
        td {
            padding: 8px;
            border: 1px solid #e5e7eb;
        }
        .workout {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
        }
        .exercise {
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        @media print {
            body {
            padding: 0;
            }
            button {
            display: none;
            }
        }
        </style>
    </head>
    <body>
        <h1>${workoutPlan.name}</h1>
        <p>${workoutPlan.description}</p>
        
        <h2>Informações Gerais</h2>
        <table>
        <tr>
            <th>Área de Foco</th>
            <td>${workoutPlan.focusArea}</td>
        </tr>
        <tr>
            <th>Nível</th>
            <td>${workoutPlan.fitnessLevel}</td>
        </tr>
        <tr>
            <th>Treinos por Semana</th>
            <td>${workoutPlan.daysPerWeek}</td>
        </tr>
        <tr>
            <th>Dias de Descanso</th>
            <td>${workoutPlan.restDays}</td>
        </tr>
        <tr>
            <th>Total de Semanas</th>
            <td>${workoutPlan.totalWeeks}</td>
        </tr>
        </table>
        
        <h2>Semana ${currentWeek.weekNumber}: ${currentWeek.focus}</h2>
        <p>${currentWeek.description}</p>
        
        <h3>Treinos desta semana:</h3>
        ${currentWeek.workouts
                .map(
                    (workout, index) => `
        <div class="workout">
            <h3>Treino ${index + 1}: ${workout.name}</h3>
            <p>${workout.description}</p>
            <p><strong>Músculos:</strong> ${workout.targetMuscleGroups.join(", ")}</p>
            <p><strong>Duração:</strong> ${workout.estimatedDuration} minutos</p>
            
            <h4>Exercícios:</h4>
            <table>
            <tr>
                <th>Exercício</th>
                <th>Séries x Reps</th>
                <th>Músculos</th>
                <th>Dificuldade</th>
            </tr>
            ${workout.exercises
                            .map(
                                (exercise) => `
                <tr>
                    <td>${exercise.name}</td>
                    <td>${exercise.sets} x ${exercise.reps}</td>
                    <td>${exercise.targetMuscles.join(", ")}</td>
                    <td>${exercise.difficulty}</td>
                </tr>
            `,
                            )
                            .join("")}
            </table>
        </div>
        `,
                )
                .join("")}
        
        <div class="footer">
        <p>Gerado em: ${new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        
        <script>
          // Imprimir automaticamente quando a página carregar
        window.onload = function() {
            window.print();
        }
        </script>
    </body>
    </html>
    `

        // Escrever o conteúdo na nova janela
        printWindow.document.open()
        printWindow.document.write(printContent)
        printWindow.document.close()
    }

    return (
        <Button onClick={handlePrint} className={className} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
        </Button>
    )
}
