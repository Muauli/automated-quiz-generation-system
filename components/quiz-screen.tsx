"use client"

import { useState } from "react"
import { Check, X, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuizQuestion } from "@/lib/quiz"

interface QuizScreenProps {
  questions: QuizQuestion[]
  onComplete: (answers: string[]) => void
}

const LETTERS = ["A", "B", "C", "D"]

export function QuizScreen({ questions, onComplete }: QuizScreenProps) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])

  const question = questions[current]
  const total = questions.length
  const isLast = current === total - 1
  const answered = selected !== null
  const progress = ((current + (answered ? 1 : 0)) / total) * 100

  function handleSelect(letter: string) {
    if (answered) return
    setSelected(letter)
  }

  function handleNext() {
    if (!selected) return
    const updated = [...answers, selected]
    setAnswers(updated)
    if (isLast) {
      onComplete(updated)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
  }

  function optionState(letter: string) {
    if (!answered) {
      return "border-border bg-card hover:border-primary/60 hover:bg-accent/40"
    }
    if (letter === question.correct) {
      return "border-success bg-success/10 text-foreground"
    }
    if (letter === selected) {
      return "border-destructive bg-destructive/10 text-foreground"
    }
    return "border-border bg-card opacity-60"
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Question {current + 1} of {total}
        </p>
      </div>

      <h2 className="text-xl font-semibold leading-snug text-balance text-foreground sm:text-2xl">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => {
          const letter = LETTERS[index]
          const showCorrect = answered && letter === question.correct
          const showWrong = answered && letter === selected && letter !== question.correct
          return (
            <button
              key={letter}
              type="button"
              onClick={() => handleSelect(letter)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition ${optionState(letter)}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                {letter}
              </span>
              <span className="flex-1">{option.replace(/^[A-D]\.\s*/, "")}</span>
              {showCorrect && <Check className="h-5 w-5 text-success" aria-label="Correct answer" />}
              {showWrong && <X className="h-5 w-5 text-destructive" aria-label="Your answer" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-secondary/60 p-4 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="leading-relaxed text-pretty">{question.explanation}</p>
        </div>
      )}

      <Button onClick={handleNext} size="lg" disabled={!answered} className="w-full gap-2">
        {isLast ? "See Results" : "Next Question"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
