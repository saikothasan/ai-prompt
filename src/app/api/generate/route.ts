import { createWorkersAI } from "workers-ai-provider"
import { streamText } from "ai"
import { promptFormSchema } from "@/lib/validations"
import { generateSystemPrompt, generateUserPrompt } from "@/lib/prompts"
import type { AIPromptRequest, AIPromptResponse, CloudflareAIResponse } from "@/lib/types"
import { NextResponse } from "next/server"

export const runtime = "edge"
export const maxDuration = 40 // Maximum runtime in seconds

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const MODEL = "@cf/meta/llama-2-7b-chat-int8"

if (!API_TOKEN || !ACCOUNT_ID) {
  throw new Error("Missing required environment variables")
}

async function generateAIResponse(request: AIPromptRequest): Promise<CloudflareAIResponse> {
  const workersai = createWorkersAI({ binding: process.env.AI })

  const systemPrompt = generateSystemPrompt(request.category)
  const userPrompt = generateUserPrompt(request)

  const response = await workersai.generateText({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    stream: true,
  })

  return response
}

export async function POST(req: Request) {
  try {
    // Input validation
    const body = await req.json()
    const result = promptFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Invalid request parameters",
            details: result.error.issues,
          },
        } as AIPromptResponse,
        { status: 400 },
      )
    }

    const request = result.data as AIPromptRequest

    // Rate limiting headers
    const headers = new Headers({
      "X-RateLimit-Limit": "10",
      "X-RateLimit-Remaining": "9", // You would normally calculate this
      "Cache-Control": "no-store, private",
    })

    try {
      const response = await generateAIResponse(request)

      // Stream the response
      const stream = streamText(response)

      return new Response(stream, {
        headers: {
          ...Object.fromEntries(headers.entries()),
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        },
      })
    } catch (error) {
      console.error("AI Generation Error:", error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AI_GENERATION_ERROR",
            message: "Failed to generate AI response",
            details: error instanceof Error ? error.message : "Unknown error occurred",
          },
        } as AIPromptResponse,
        {
          status: 500,
          headers,
        },
      )
    }
  } catch (error) {
    console.error("Request Processing Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error occurred",
        },
      } as AIPromptResponse,
      { status: 500 },
    )
  }
}

