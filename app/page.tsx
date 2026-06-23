"use client"

import { useState } from "react"
import { QuizHeader } from "@/components/quiz-header"
import { SetupScreen } from "@/components/setup-screen"
import { LoadingScreen } from "@/components/loading-screen"
import { QuizScreen } from "@/components/quiz-screen"
import { ResultsScreen } from "@/components/results-screen"
import { generateQuiz, type QuizConfig, type QuizQuestion } from "@/lib/quiz"

type Screen = "setup" | "loading" | "quiz" | "results"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(config: QuizConfig) {
    setError(null)
    setScreen("loading")
    try {
      const result = await generateQuiz(config)
      setQuestions(result)
      setScreen("quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setScreen("setup")
    }
  }

  function handleComplete(finalAnswers: string[]) {
    setAnswers(finalAnswers)
    setScreen("results")
  }

  function handleRestart() {
    setQuestions([])
    setAnswers([])
    setError(null)
    setScreen("setup")
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <QuizHeader />
        {screen === "setup" && <SetupScreen onGenerate={handleGenerate} error={error} />}
        {screen === "loading" && <LoadingScreen />}
        {screen === "quiz" && <QuizScreen questions={questions} onComplete={handleComplete} />}
        {screen === "results" && (
          <ResultsScreen questions={questions} answers={answers} onRestart={handleRestart} />
        )}
      </main>
    </div>
  )
}
