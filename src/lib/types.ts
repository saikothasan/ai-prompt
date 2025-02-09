export interface AIPromptRequest {
  category: "all" | "text" | "image" | "video" | "code"
  description: string
  details?: string
  length: "short" | "medium" | "long"
}

export interface AIPromptResponse {
  success: boolean
  data?: {
    prompt: string
    category: string
    metadata: {
      length: string
      timestamp: string
      model: string
    }
  }
  error?: {
    code: string
    message: string
    details?: string
  }
}

export interface CloudflareAIResponse {
  result: {
    response: string
  }
  success: boolean
  errors: any[]
  messages: any[]
}

