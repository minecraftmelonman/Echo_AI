"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Mic, Square } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onResponseReceived?: (userText: string, aiText: string) => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onResponseReceived, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const listeningRef = useRef(false)

  useEffect(() => {
    listeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleTextSubmit = async () => {
    if (!value.trim() || disabled || isProcessing) return

    const userPrompt = value
    onChange("")
    setIsProcessing(true)

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      })

      const data = await res.json()
      if (onResponseReceived) {
        onResponseReceived(data.user_prompt, data.echo_response)
      }
    } catch (err) {
      console.error("Backend connection error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }

  const runVoiceLoop = async () => {
    while (listeningRef.current) {
      try {
        setIsProcessing(true)
        const res = await fetch("http://localhost:8000/listen")
        const data = await res.json()

        if (!listeningRef.current) break

        if (data.user_spoken && data.echo_response) {
          onChange(data.user_spoken)
          if (onResponseReceived) {
            onResponseReceived(data.user_spoken, data.echo_response)
          }
        }
      } catch (err) {
        console.error("Voice loop error:", err)
        break
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      listeningRef.current = false
    } else {
      setIsListening(true)
      listeningRef.current = true
      runVoiceLoop()
    }
  }

  return (
    <div className="relative flex items-end gap-2 p-3 bg-secondary rounded-2xl border border-border">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening through mic..." : "Message..."}
        disabled={disabled || isListening}
        rows={1}
        className="flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[24px] max-h-[200px] py-1.5 px-1"
      />
      <Button
        onClick={toggleVoiceInput}
        disabled={disabled}
        size="icon"
        variant="ghost"
        className={`shrink-0 h-8 w-8 rounded-full transition-colors ${
          isListening 
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse" 
            : "text-muted-foreground hover:bg-secondary-foreground/10"
        }`}
        title={isListening ? "Stop continuous listening" : "Start continuous voice mode"}
      >
        {isListening ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
        <span className="sr-only">{isListening ? "Stop continuous listening" : "Start continuous voice mode"}</span>
      </Button>
      <Button
        onClick={handleTextSubmit}
        disabled={disabled || !value.trim() || isListening || isProcessing}
        size="icon"
        className="shrink-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
      >
        <ArrowUp className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}