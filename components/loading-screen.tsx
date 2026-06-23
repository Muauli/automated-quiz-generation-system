import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
      <p className="text-base font-medium text-foreground" role="status">
        Generating your quiz with AI...
      </p>
      <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  )
}
