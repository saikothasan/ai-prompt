import { NextResponse } from "next/server"
import { promptFormSchema } from "@/lib/validations"

export const runtime = "edge"

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID

if (!API_TOKEN || !ACCOUNT_ID) {
  throw new Error("Missing Cloudflare API credentials")
}

async function run(model: string, input: any) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Cloudflare AI API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = promptFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 })
    }

    const { category, description, details, length } = result.data

    const systemPrompt = `You are a professional prompt generator for ${category}. 
    Create ${length} prompts that are well-structured and detailed.`

    const userPrompt = `Generate a ${length} ${category} prompt about: ${description}.
    ${details ? `Additional details: ${details}` : ""}
    If this is a code prompt, include best practices and common pitfalls.
    If this is an image prompt, include specific style details and composition guidelines.`

    const aiResponse = await run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })

    // Assuming the AI response has a 'result' field with the generated text
    if (aiResponse.result && aiResponse.result.response) {
      return NextResponse.json({ generatedPrompt: aiResponse.result.response })
    } else {
      throw new Error("Unexpected AI response format")
    }
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 })
  }
}

