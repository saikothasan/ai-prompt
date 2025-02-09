import type { AIPromptRequest } from "./types"

export function generateSystemPrompt(category: AIPromptRequest["category"]): string {
  const prompts = {
    all: "You are an expert prompt engineer skilled in creating clear, detailed, and effective prompts for any purpose.",
    text: "You are an expert writer and prompt engineer specializing in creating detailed text prompts that generate high-quality written content.",
    image:
      "You are an expert visual artist and prompt engineer specializing in creating detailed image prompts that generate stunning visuals.",
    video:
      "You are an expert videographer and prompt engineer specializing in creating detailed video prompts that generate engaging content.",
    code: "You are an expert software developer and prompt engineer specializing in creating detailed coding prompts that follow best practices.",
  }

  return prompts[category] || prompts.all
}

export function generateUserPrompt(request: AIPromptRequest): string {
  const lengthGuide = {
    short: "concise and focused (50-100 words)",
    medium: "detailed and comprehensive (100-200 words)",
    long: "extensive and thorough (200-300 words)",
  }

  const categorySpecificInstructions = {
    all: "",
    text: "Include tone, style, and structural elements.",
    image: "Include composition, lighting, style, color palette, and technical details.",
    video: "Include shot types, transitions, pacing, and technical specifications.",
    code: "Include architecture considerations, patterns, and potential pitfalls.",
  }

  return `
Generate a ${lengthGuide[request.length]} prompt about: ${request.description}

${request.details ? `Additional context and requirements: ${request.details}` : ""}

${categorySpecificInstructions[request.category]}

Format the prompt professionally, ensuring it is:
1. Clear and unambiguous
2. Properly structured with logical flow
3. Specific and actionable
4. Includes all necessary technical details
5. Maintains consistent tone and style

Response should be direct and ready to use, without meta-commentary or explanations.
`.trim()
}

