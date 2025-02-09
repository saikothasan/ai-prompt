import { createWorkersAI } from "workers-ai-provider"
import { streamText } from "ai"
import { promptFormSchema } from "@/lib/validations"
import { NextResponse } from "next/server"

type Env = {
  AI: any // Replace 'any' with the correct type if available
}

export const runtime = "edge"

export async function POST(req: Request, { env }: { env: Env }) {
  try {
    const body = await req.json()
    const result = promptFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 })
    }

    const { category, description, details, length } = result.data

    const workersai = createWorkersAI({ binding: env.AI })

    const prompt = `
      Generate a ${length} length ${category} prompt about: ${description}.
      ${details ? `Additional details: ${details}` : ""}
      
      The response should be well-structured and professional.
      If this is a code prompt, include best practices and common pitfalls.
      If this is an image prompt, include specific style details and composition guidelines.
    `.trim()

    const response = streamText({
      model: workersai("@cf/meta/llama-2-7b-chat-int8"),
      prompt,
    })

    return response.toTextStreamResponse({
      headers: {
        "Content-Type": "text/x-unknown",
        "content-encoding": "identity",
        "transfer-encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Generation error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

