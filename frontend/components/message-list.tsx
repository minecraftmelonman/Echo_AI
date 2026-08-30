"use client"

import { useEffect, useRef } from "react"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface MessageListProps {
  messages: Message[]
  isStreaming?: boolean
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          How can I help you today?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Start chatting below or press the mic button to talk in real time to Echo AI.
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      {messages.map((message) => {
        const isUser = message.role === "user"

        return (
          <div
            key={message.id}
            className={cn(
              "flex w-full items-end gap-3",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {!isUser && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary text-secondary-foreground">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm overflow-hidden",
                isUser
                  ? "rounded-tr-xs bg-primary text-primary-foreground"
                  : "rounded-tl-xs border border-border/40 bg-secondary text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                {message.content}
              </p>
            </div>

            {isUser && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        )
      })}

      {isStreaming && (
        <div className="flex w-full items-end justify-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary text-secondary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div className="rounded-2xl rounded-tl-xs border border-border/40 bg-secondary px-4 py-3 text-sm text-foreground">
            <span className="inline-flex h-4 items-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/60" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/60 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/60 [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}