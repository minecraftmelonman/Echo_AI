"use client"

import React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ModelId = 
  | "openai/gpt-4o"
  | "openai/gpt-4o-mini"
  | "openai/gpt-5"
  | "anthropic/claude-sonnet-4-20250514"
  | "anthropic/claude-opus-4-20250514"
  | "google/gemini-2.0-flash"
  | "google/gemini-2.5-pro"
  | "xai/grok-3"
  | "xai/grok-3-fast"

interface ModelInfo {
  id: ModelId
  name: string
  provider: string
}

const models: Record<string, ModelInfo[]> = {
  OpenAI: [
    { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
    { id: "openai/gpt-5", name: "GPT-5", provider: "OpenAI" },
  ],
  Anthropic: [
    { id: "anthropic/claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "Anthropic" },
    { id: "anthropic/claude-opus-4-20250514", name: "Claude Opus 4", provider: "Anthropic" },
  ],
  Google: [
    { id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google" },
    { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google" },
  ],
  xAI: [
    { id: "xai/grok-3", name: "Grok 3", provider: "xAI" },
    { id: "xai/grok-3-fast", name: "Grok 3 Fast", provider: "xAI" },
  ],
}

const providerIcons: Record<string, React.ReactNode> = {
  OpenAI: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  ),
  Anthropic: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M17.304 3.541h-3.672l6.696 16.918h3.672l-6.696-16.918zm-10.608 0L0 20.459h3.744l1.368-3.553h6.912l1.368 3.553h3.744L10.44 3.541H6.696zm.144 10.536l2.28-5.91 2.28 5.91H6.84z" />
    </svg>
  ),
  Google: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  ),
  xAI: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M8.055 6.668l7.942 10.665h-3.06L4.994 6.668h3.06zm7.89 10.665L8.001 6.668h3.061l7.943 10.665h-3.06zm-4.891.001l-3.06-4.113-1.53 2.056L4.94 17.334h3.059l1.524-2.056 1.53 2.056zm4.891-10.667l1.53 2.056 1.53-2.056h3.06l-3.06 4.113 1.53 2.056-3.06 4.114-1.53-2.056-1.53 2.056h-3.06l3.06-4.113-1.53-2.057 3.06-4.113z" />
    </svg>
  ),
}

interface ModelSelectorProps {
  value: ModelId
  onValueChange: (value: ModelId) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const getModelDisplayName = (modelId: ModelId) => {
    for (const provider of Object.values(models)) {
      const model = provider.find((m) => m.id === modelId)
      if (model) return model.name
    }
    return modelId
  }

  const getProviderFromModel = (modelId: ModelId) => {
    for (const [provider, providerModels] of Object.entries(models)) {
      if (providerModels.find((m) => m.id === modelId)) {
        return provider
      }
    }
    return "OpenAI"
  }

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as ModelId)}>
      <SelectTrigger className="w-full sm:w-[220px] bg-secondary border-border text-foreground h-11">
        <div className="flex items-center gap-2">
          {providerIcons[getProviderFromModel(value)]}
          <SelectValue>{getModelDisplayName(value)}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {Object.entries(models).map(([provider, providerModels]) => (
          <SelectGroup key={provider}>
            <SelectLabel className="flex items-center gap-2 text-muted-foreground">
              {providerIcons[provider]}
              {provider}
            </SelectLabel>
            {providerModels.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className="text-foreground focus:bg-accent focus:text-accent-foreground"
              >
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
