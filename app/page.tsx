"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserProfileForm from "@/components/UserProfileForm"
import WorkoutPlanDisplay from "@/components/WorkoutPlanDisplay"
import type { UserProfile } from "@/types/UserProfile"
import type { WorkoutPlan } from "@/types/Workout"
import { generateWorkoutPlan } from "@/core/engine/WorkoutPlanGenerator"

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsGenerating(true)
    setUserProfile(profile)

    // Simular um pequeno atraso para mostrar o estado de carregamento
    // Em uma aplicação real, isso seria o tempo de processamento do servidor
    setTimeout(() => {
      const plan = generateWorkoutPlan(profile)
      setWorkoutPlan(plan)
      setActiveTab("workout")
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gerador Pessoal de Treinos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="workout" disabled={!workoutPlan || isGenerating}>
            Plano de Treino
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6">
              <UserProfileForm onSubmit={handleProfileSubmit} initialData={userProfile} isSubmitting={isGenerating} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout">
          {workoutPlan && (
            <Card>
              <CardContent className="pt-6">
                <WorkoutPlanDisplay workoutPlan={workoutPlan} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setActiveTab("profile")}>
                    Editar Perfil do Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
