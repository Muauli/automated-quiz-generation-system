"use client"

import { Check, X, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRatingMessage, type QuizQuestion } from "@/lib/quiz"

interface ResultsScreenProps {
  questions: QuizQuestion[]
  answers: string[]
  onRestart: () => void
}

export function ResultsScreen({ questions, answers, onRestart }: ResultsScreenProps) {
  const total = questions.length
  const score = questions.reduce(
    (acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc),
    0,
  )
  const percent = Math.round((score / total) * 100)
  const rating = getRatingMessage(percent)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Trophy className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Your Score
          </p>
          <p className="text-3xl font-bold text-foreground">
            You got {score} out of {total} correct
          </p>
          <p className="text-lg font-semibold text-primary">{percent}%</p>
        </div>
        <p className="text-base text-pretty text-foreground">{rating}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Review your answers</h2>
        <ul className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct
            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    correct
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  {!correct && (
                    <p className="text-xs text-muted-foreground">
                      Correct answer:{" "}
                      <span className="font-semibold text-foreground">{q.correct}</span>
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <Button onClick={onRestart} size="lg" className="w-full gap-2">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Start New Quiz
      </Button>
    </div>
  )
}
