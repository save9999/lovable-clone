import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, UPDATE_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, isUpdate } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY manquante dans .env.local" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 8192,
            system: isUpdate ? UPDATE_PROMPT : SYSTEM_PROMPT,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          });

          for await (const chunk of response) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const error = err as Error;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
