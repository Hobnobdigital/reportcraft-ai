import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { parseClaudeJSON } from "@/lib/parseJSON";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUERY_SYSTEM_PROMPT = `You are a data analyst expert. Given a user's natural language question about a dataset, you must:

1. ANSWER the question directly in plain English with specific numbers from the data
2. Generate a chart configuration that visualizes the answer

Respond with JSON matching this schema (no markdown, no code blocks, just raw JSON):
{
  "insight": "2-3 sentence direct answer to the user's question with specific numbers and percentages. Be authoritative and precise.",
  "type": "bar" | "line" | "area" | "pie" | "composed",
  "title": "descriptive chart title",
  "xKey": "column for x-axis",
  "yKeys": ["column(s) for y-axis"],
  "colors": ["hex colors from: #635BFF, #00D4AA, #0073E6, #FFBB00, #DF1B41, #8B5CF6"],
  "data": [the relevant data rows, aggregated/filtered as needed to answer the question]
}

Choose the chart type that best visualizes the answer. Always aggregate or filter data as needed.
The "insight" field is CRITICAL — it must directly and specifically answer the user's question with real numbers.`;

export async function POST(req: Request) {
  const accessCode = req.headers.get("x-access-code")?.trim();
  if (!accessCode || accessCode !== process.env.ACCESS_CODE?.trim()) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  try {
    const { query, data, columns } = await req.json();
    if (!query || !data || !columns) {
      return NextResponse.json({ error: "Missing query, data, or columns" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: QUERY_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `User question: "${query}"

Columns: ${columns.join(", ")}
Data (${data.length} rows, showing first ${Math.min(data.length, 50)}):
${JSON.stringify(data.slice(0, 50))}`,
      }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No response");

    const result = parseClaudeJSON(textBlock.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Query failed" }, { status: 500 });
  }
}
