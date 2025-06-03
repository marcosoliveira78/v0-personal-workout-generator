"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { exportWorkoutPlanToPDF } from "@/utils/pdfExport"
import type { WorkoutPlan } from "@/types/Workout"
import { toast } from "sonner"

interface PDFExportButtonProps {
    workoutPlan: WorkoutPlan
    className?: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export default function PDFExportButton({ workoutPlan, className, variant = "default" }: PDFExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
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

    return (
        <Button onClick={handleExport} disabled={isExporting} className={className} variant={variant}>
            {isExporting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar PDF
                </>
            )}
        </Button>
    )
}
