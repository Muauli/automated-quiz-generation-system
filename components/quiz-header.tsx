import { GraduationCap } from "lucide-react"

export function QuizHeader() {
  return (
    <header className="flex flex-col items-center gap-2 text-center">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          TAP Quiz Builder
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">by theAsianparent</p>
    </header>
  )
}
