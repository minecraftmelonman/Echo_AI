import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 60

const modelDisplayNames: Record<string, { name: string; provider: string }> = {
  "openai/gpt-4o": { name: "GPT-4o", provider: "OpenAI" },
  "openai/gpt-4o-mini": { name: "GPT-4o Mini", provider: "OpenAI" },
  "openai/gpt-5": { name: "GPT-5", provider: "OpenAI" },
  "anthropic/claude-sonnet-4-20250514": { name: "Claude Sonnet 4", provider: "Anthropic" },
  "anthropic/claude-opus-4-20250514": { name: "Claude Opus 4", provider: "Anthropic" },
  "google/gemini-2.0-flash": { name: "Gemini 2.0 Flash", provider: "Google" },
  "google/gemini-2.5-pro": { name: "Gemini 2.5 Pro", provider: "Google" },
  "xai/grok-3": { name: "Grok 3", provider: "xAI" },
  "xai/grok-3-fast": { name: "Grok 3 Fast", provider: "xAI" },
}

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json()

  const selectedModel = model || "openai/gpt-4o"
  const modelInfo = modelDisplayNames[selectedModel] || { name: selectedModel, provider: "Unknown" }

  console.log("[v0] Using model:", selectedModel)

  const result = streamText({
    model: selectedModel,
    system: `You are ${modelInfo.name}, an AI assistant created by ${modelInfo.provider}. When asked about your identity or which model you are, always respond that you are ${modelInfo.name} from ${modelInfo.provider}. Respond in the same language the user writes to you.`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
