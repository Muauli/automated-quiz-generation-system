export interface QuizQuestion {
  question: string
  options: string[]
  correct: string
  explanation: string
}

export interface QuizConfig {
  topic: string
  numQuestions: number
  difficulty: "Easy" | "Medium" | "Hard"
  apiKey: string
}

const SYSTEM_PROMPT =
  "You are an expert in parenting, child development, and family health. Generate educational quiz questions for employees of theAsianparent Indonesia, a parenting content platform. Questions must be accurate, factual, and relevant to Indonesian parents and families."

export async function generateQuiz(config: QuizConfig): Promise<QuizQuestion[]> {
  const userPrompt = `Generate ${config.numQuestions} ${config.difficulty} multiple-choice quiz questions about "${config.topic}". Respond ONLY with valid JSON in exactly this structure:
{
  "questions": [
    {
      "question": "question text here",
      "options": ["A. option", "B. option", "C. option", "D. option"],
      "correct": "A",
      "explanation": "brief explanation of why this is correct"
    }
  ]
}`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your OpenAI API key and try again.")
    }
    if (response.status === 429) {
      throw new Error("Rate limit or quota exceeded. Please check your OpenAI account and try again later.")
    }
    let detail = ""
    try {
      const errData = await response.json()
      detail = errData?.error?.message ? ` (${errData.error.message})` : ""
    } catch {
      // ignore parse errors
    }
    throw new Error(`Request failed with status ${response.status}.${detail}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("The AI returned an empty response. Please try again.")
  }

  let parsed: { questions?: QuizQuestion[] }
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error("Could not parse the quiz returned by the AI. Please try again.")
  }

  const questions = parsed.questions
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("The AI did not return any questions. Please try again.")
  }

  return questions
}

export function getRatingMessage(percent: number): string {
  if (percent >= 90) return "Outstanding! You're a parenting expert!"
  if (percent >= 70) return "Great job! Keep it up!"
  if (percent >= 50) return "Good effort! A little more studying to go."
  return "Keep learning! Every question is a lesson."
}
