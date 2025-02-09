import * as z from "zod"

export const promptFormSchema = z.object({
  category: z.enum(["all", "text", "image", "video", "code"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  details: z.string().max(1000).optional(),
  length: z.enum(["short", "medium", "long"]),
})

export type PromptFormData = z.infer<typeof promptFormSchema>

