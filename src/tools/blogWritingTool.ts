import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import OpenAI from 'openai';

const apiKey = process.env.NEBIUS_API_KEY;
const client = new OpenAI({
    baseURL: "https://api.studio.nebius.ai/v1/",
    apiKey: apiKey,
});

export const blogWritingTool = createTool({
  id: "Write a Blog Article",
  inputSchema: z.object({
    topic: z.string().describe("The topic to write a blog post about"),
  }),
  description: `Generates a well-crafted blog post about the specified topic`,
  execute: async ({ context: { topic } }) => {
    const response = await client.chat.completions.create({
      model: "Qwen/Qwen3-235B-A22B",
      temperature: 0.7,
      top_p: 0.95,
      messages: [
        {
          role: "system",
          content: "You are a professional blog writer. Create a beautifully crafted blog post that is engaging, informative, and well-structured. Focus solely on the given topic and provide valuable insights."
        },
        {
          role: "user",
          content: `Write a comprehensive blog post about: ${topic}`
        }
      ]
    });

    return { 
      blogContent: response.choices[0].message.content
    };
  },
});