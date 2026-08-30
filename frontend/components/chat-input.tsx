"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Mic, Square } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  onResponseReceived?: (userText: string, aiText: string) => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, onResponseReceived, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMicRecording, setIsMicRecording] = useState(false)
  
  const listeningRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

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

    if (onSubmit) {
      onSubmit()
      return
    }

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
        // 1. Wait for backend TTS audio to completely finish playing
        let aiIsSpeaking = true
        while (aiIsSpeaking && listeningRef.current) {
          try {
            const statusRes = await fetch("http://localhost:8000/status")
            const statusData = await statusRes.json()
            aiIsSpeaking = statusData.is_speaking
          } catch {
            aiIsSpeaking = false
          }

          if (aiIsSpeaking) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }

        if (!listeningRef.current) break

        // 2. Turn on red dot only when mic is actively listening
        setIsProcessing(true)
        setIsMicRecording(true)

        // Attach AbortController signal to terminate fetch on demand
        abortControllerRef.current = new AbortController()

        const res = await fetch("http://localhost:8000/listen", {
          signal: abortControllerRef.current.signal,
        })
        const data = await res.json()

        // 3. Turn off red dot immediately when speech capture completes
        setIsMicRecording(false)

        if (!listeningRef.current || data.status === "cancelled") break

        if (data.user_spoken && data.echo_response) {
          onChange(data.user_spoken)
          if (onResponseReceived) {
            onResponseReceived(data.user_spoken, data.echo_response)
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Mic stream manually aborted.")
        } else {
          console.error("Voice loop error:", err)
        }
        setIsMicRecording(false)
        break
      } finally {
        setIsProcessing(false)
      }
    }
    setIsMicRecording(false)
  }

  const toggleVoiceInput = async () => {
    if (isListening) {
      // Instantly shut down local recording state
      setIsListening(false)
      setIsMicRecording(false)
      listeningRef.current = false

      // Abort active HTTP connection immediately
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      // Tell FastAPI backend to stop reading audio buffers
      try {
        await fetch("http://localhost:8000/stop-listen", { method: "POST" })
      } catch (err) {
        console.error("Failed to stop backend listener:", err)
      }
    } else {
      setIsListening(true)
      listeningRef.current = true
      runVoiceLoop()
    }
  }

  return (
    <div className="relative flex items-center gap-2 p-3 bg-secondary rounded-2xl border border-border">
      {/* Red Dot Indicator */}
      {isMicRecording && (
        <span className="relative flex h-2.5 w-2.5 shrink-0 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isMicRecording ? "Listening..." : isListening ? "AI speaking..." : "Message..."}
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
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
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