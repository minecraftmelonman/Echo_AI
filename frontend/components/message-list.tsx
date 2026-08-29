"use client"

import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface MessageListProps {
  messages: UIMessage[]
  isStreaming: boolean
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2 text-balance">
          How can I help you today?
        </h2>
        <p className="text-muted-foreground max-w-md text-pretty">
          Start chatting below or press the mic button to talk in real time to Echo AI.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      {messages.map((message, index) => {
        const isUser = message.role === "user"
        const text = getMessageText(message)
        const isLastMessage = index === messages.length - 1
        const showCursor = isStreaming && isLastMessage && !isUser

        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 px-4",
              isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isUser ? "bg-primary" : "bg-secondary"
              )}
            >
              {isUser ? (
                <User className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
                {text}
                {showCursor && (
                  <span className="inline-block w-2 h-4 bg-foreground/50 animate-pulse ml-0.5" />
                )}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
