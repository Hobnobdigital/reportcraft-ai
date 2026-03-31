import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QUERY_SYSTEM_PROMPT = `You are a data visualization expert. Given a user's natural language question about a dataset, generate a chart configuration that answers their question.

You will receive the dataset columns, sample data, and the user's question.

Respond ONLY with valid JSON matching this schema:
{
  "type": "bar" | "line" | "area" | "pie" | "composed",
  "title": "descriptive chart title answering the question",
  "xKey": "column for x-axis",
  "yKeys": ["column(s) for y-axis"],
  "colors": ["hex colors from: #635BFF, #00D4AA, #0073E6, #FFBB00, #DF1B41, #8B5CF6"],
  "data": [the relevant data rows],
  "insight": "1-2 sentence insight answering the user's question with specific numbers"
}

Choose the chart type that best answers the question. Aggregate or filter the data as needed.
Do not include any text outside the JSON. Do not wrap in markdown code blocks.`;

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
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No response from Claude");
    }

    const chart = JSON.parse(textBlock.text);
    return NextResponse.json(chart);
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
