"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { promptFormSchema, type PromptFormData } from "@/lib/validations"
import Link from "next/link"

interface GenerateResponse {
  generatedPrompt?: string
  error?: string
}

export function PromptGenerator() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [generatedText, setGeneratedText] = React.useState("")

  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      category: "all",
      description: "",
      details: "",
      length: "medium",
    },
  })

  const onSubmit = async (data: PromptFormData) => {
    setIsLoading(true)
    setGeneratedText("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const result = (await response.json()) as GenerateResponse

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.generatedPrompt) {
        setGeneratedText(result.generatedPrompt)
      } else {
        throw new Error("No prompt generated")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Prompt Generator</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Generate professional prompts for text, images, video, and code.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Generate prompt for...</FormLabel>
                <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
                  <TabsList className="h-9 w-full justify-start space-x-1 overflow-x-auto">
                    <TabsTrigger value="all" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="text" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                      Image
                    </TabsTrigger>
                    <TabsTrigger value="video" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                      Video
                    </TabsTrigger>
                    <TabsTrigger value="code" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                      Code
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">
                  Describe what you want to create with AI <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='E.g., "outline for quarterly presentation" or "new e-commerce logo"'
                    className="min-h-[100px] resize-none text-sm sm:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Additional details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., styles, platforms, resolutions, etc."
                    className="min-h-[100px] resize-none text-sm sm:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Output length</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="short" className="text-sm sm:text-base">
                      Short
                    </SelectItem>
                    <SelectItem value="medium" className="text-sm sm:text-base">
                      Medium
                    </SelectItem>
                    <SelectItem value="long" className="text-sm sm:text-base">
                      Long
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {generatedText && (
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-medium mb-2 text-sm sm:text-base">Generated Prompt:</h2>
              <p className="whitespace-pre-wrap text-xs sm:text-sm">{generatedText}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              By generating, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Generative AI Additional Terms of Use
              </Link>
              .
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Generating..." : "Generate prompt"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

