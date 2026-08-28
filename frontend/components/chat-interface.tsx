"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ModelSelector, type ModelId } from "@/components/model-selector"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"

export function ChatInterface() {
  const [input, setInput] = useState("")
  const [model, setModel] = useState<ModelId>("openai/gpt-4o")
  const scrollRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  )

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  })

  const isStreaming = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return
    sendMessage({ text: input }, { body: { model } })
    setInput("")
  }

  const handleModelChange = (newModel: ModelId) => {
    setModel(newModel)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex flex-col gap-3 px-4 py-3 border-b border-border bg-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-foreground sm:text-lg">AI Chat</h1>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full hidden sm:inline">
              Multi-Model
            </span>
          </div>
        </div>
        <ModelSelector value={model} onValueChange={handleModelChange} />
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-6"
      >
        <div className="max-w-3xl mx-auto">
          <MessageList messages={messages} isStreaming={isStreaming} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isStreaming}
          />
          <p className="text-center text-xs text-muted-foreground mt-3">
            Currently using <span className="text-foreground font-medium">{model.split("/")[1]}</span> from {model.split("/")[0]}
          </p>
        </div>
      </div>
    </div>
  )
}
