"use client"

import { useState, type FormEvent } from "react"
import { Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuizConfig } from "@/lib/quiz"

interface SetupScreenProps {
  onGenerate: (config: QuizConfig) => void
  error: string | null
}

export function SetupScreen({ onGenerate, error }: SetupScreenProps) {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState<QuizConfig["difficulty"]>("Medium")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [touched, setTouched] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!topic.trim() || !apiKey.trim()) return
    onGenerate({ topic: topic.trim(), numQuestions, difficulty, apiKey: apiKey.trim() })
  }

  const labelClass = "block text-sm font-medium text-foreground"
  const fieldClass =
    "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-foreground">Create a new quiz</h2>
        <p className="text-sm text-muted-foreground">
          Generate an AI-powered parenting knowledge quiz in seconds.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className={labelClass}>
          Parenting Topic
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Child development milestones from 0-3 years"
          className={fieldClass}
        />
        {touched && !topic.trim() && (
          <p className="text-xs text-destructive">Please enter a topic.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="numQuestions" className={labelClass}>
            Number of questions
          </label>
          <select
            id="numQuestions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className={fieldClass}
          >
            <option value={5}>5 questions</option>
            <option value={10}>10 questions</option>
            <option value={15}>15 questions</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="difficulty" className={labelClass}>
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuizConfig["difficulty"])}
            className={fieldClass}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="apiKey" className={labelClass}>
          OpenAI API Key
        </label>
        <div className="relative">
          <input
            id="apiKey"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            autoComplete="off"
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowKey((s) => !s)}
            aria-label={showKey ? "Hide API key" : "Show API key"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {touched && !apiKey.trim() && (
          <p className="text-xs text-destructive">Please enter your API key.</p>
        )}
        <p className="text-xs text-muted-foreground">
          Your key is used only in your browser to call OpenAI and is never stored.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full gap-2">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Generate Quiz
      </Button>
    </form>
  )
}
