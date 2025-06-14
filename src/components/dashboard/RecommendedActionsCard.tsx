"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useState, useEffect } from "react"

interface ActionItem {
  id: string
  title: string
  description: string
  status: "active" | "upcoming" | "completed"
  primaryAction?: string
  secondaryAction?: string
}

interface RecommendedActionsCardProps {
  title?: string
  actions: ActionItem[]
  onPrimaryAction?: (actionId: string) => void
  onSecondaryAction?: (actionId: string) => void
  onStepChange?: (step: number) => void
}

export function RecommendedActionsCard({
  title = "Recommended Actions",
  actions,
  onPrimaryAction,
  onSecondaryAction,
  onStepChange,
}: RecommendedActionsCardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [actionStates, setActionStates] = useState(actions)

  // Update action states based on current step
  useEffect(() => {
    const updatedActions = actions.map((action, index) => {
      if (index < currentStep) {
        return { ...action, status: "completed" as const }
      } else if (index === currentStep) {
        return { ...action, status: "active" as const }
      } else {
        return { ...action, status: "upcoming" as const }
      }
    })
    setActionStates(updatedActions)
  }, [currentStep, actions])

  const handleSkip = () => {
    if (currentStep < actions.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const handlePrimaryAction = (actionId: string) => {
    onPrimaryAction?.(actionId)
    handleSkip()
  }
  const renderIcon = (status: ActionItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-4 h-4 rounded-full bg-indigo-400 border border-indigo-400 flex items-center justify-center transition-all duration-300 ease-in-out">
            <Check className="w-3 h-3 text-white animate-in fade-in duration-200" />
          </div>
        )
      case "active":
        return (
          <div className="w-4 h-4 rounded-full bg-white border border-gray-200 transition-all duration-300 ease-in-out"></div>
        )
      case "upcoming":
        return (
          <div className="w-4 h-4 rounded-full border border-dashed border-gray-400 transition-all duration-300 ease-in-out" style={{ strokeDasharray: "2.5 2.5" }}></div>
        )
      default:
        return null
    }
  }

  const getTextStyles = (status: ActionItem["status"]) => {
    switch (status) {
      case "completed":
        return {
          title: "text-base leading-6 font-medium text-gray-800",
          description: "text-sm leading-5 font-normal text-gray-500",
        }
      case "active":
        return {
          title: "text-base leading-6 font-medium text-gray-800",
          description: "text-sm leading-5 font-normal text-gray-500",
        }
      case "upcoming":
        return {
          title: "text-base leading-6 font-medium text-gray-400",
          description: "text-sm leading-5 font-normal text-gray-400",
        }
      default:
        return {
          title: "text-base leading-6 font-medium text-gray-800",
          description: "text-sm leading-5 font-normal text-gray-500",
        }
    }
  }

  return (
    <Card className="bg-gray-50 border border-gray-100 shadow-none h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base text-gray-600 leading-6 font-normal">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {actionStates.map((action, index) => {
          const textStyles = getTextStyles(action.status)
          const isActive = action.status === "active"
          
          return (
            <div key={action.id} className="flex items-start gap-4 transition-all duration-300 ease-in-out">
              <div className="flex-shrink-0 mt-0.5">
                {renderIcon(action.status)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className={`${textStyles.title} transition-colors duration-300`}>
                    {action.title}
                  </h3>
                  <p className={`${textStyles.description} transition-colors duration-300`}>
                    {action.description}
                  </p>
                </div>
                
                {isActive && (action.primaryAction || action.secondaryAction) && (
                  <div className="flex items-center gap-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {action.primaryAction && (
                      <Button
                        onClick={() => handlePrimaryAction(action.id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2"
                      >
                        {action.primaryAction}
                      </Button>
                    )}
                    {action.secondaryAction && (
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                      >
                        {action.secondaryAction}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {isActive && index === currentStep && (
                <div className="flex-shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-500 text-xs font-medium text-white">
                    New
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}