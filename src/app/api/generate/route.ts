import { createWorkersAI } from "workers-ai-provider"
import { StreamingTextResponse } from "ai/streaming"
import { promptFormSchema } from "@/lib/validations"
import { NextResponse } from "next/server"

const workersai = createWorkersAI({
  binding: process.env.AI,
})

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = promptFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 })
    }

    const { category, description, details, length } = result.data

    const prompt = `
      Generate a ${length} length ${category} prompt about: ${description}.
      ${details ? `Additional details: ${details}` : ""}
      
      The response should be well-structured and professional.
      If this is a code prompt, include best practices and common pitfalls.
      If this is an image prompt, include specific style details and composition guidelines.
    `.trim()

    const response = await workersai.generateText({
      model: "@cf/meta/llama-2-7b-chat-int8",
      prompt,
      stream: true,
    })

    return new StreamingTextResponse(response)
  } catch (error) {
    console.error("Generation error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

