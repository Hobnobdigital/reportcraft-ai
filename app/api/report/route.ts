import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { parseClaudeJSON } from "@/lib/parseJSON";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const REPORT_SYSTEM_PROMPT = `You are a senior executive report writer creating a Vancity-style annual report for marketing data. Write compelling, data-driven executive narratives.

Given dashboard data (KPIs, charts, insights), generate a complete report structure.

Respond with JSON (no markdown, no code blocks, just raw JSON):
{
  "title": "Report Title",
  "subtitle": "One-line subtitle",
  "date": "Month Year",
  "executiveSummary": {
    "overview": "High-level paragraph about what the data shows",
    "keyFindings": "Specific patterns, numbers, and trends",
    "recommendations": "2-3 actionable next steps"
  },
  "chartCaptions": ["2-3 sentence caption for chart 1", "caption for chart 2", "caption for chart 3"],
  "imagePrompts": [
    "Write a vivid, specific prompt for a photorealistic lifestyle image that contextualizes the data story. Be specific about scene, lighting, mood. Examples of good prompts: 'Overhead shot of a marketing team gathered around a conference table covered in printed charts and laptops, warm afternoon light from large windows, candid moment of collaboration, shallow depth of field, editorial photography style' or 'Close-up of hands holding a tablet showing growth charts in a modern glass office, bokeh city lights in background, warm golden hour tones, 4K professional photography'",
    "Write a DIFFERENT vivid prompt for a second lifestyle image. Could be environmental (city, nature), workspace, or abstract. Examples: 'Aerial drone shot of Vancouver waterfront at sunrise, glass towers reflecting pink and gold light, boats dotting the harbour, cinematic wide angle, 4K' or 'Isometric 3D miniature diorama of a modern analytics office with tiny people at desks, glowing screens showing colorful dashboards, tilt-shift photography'"
  ],
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"]
}`;

export async function POST(req: Request) {
  const accessCode = req.headers.get("x-access-code")?.trim();
  if (!accessCode || accessCode !== process.env.ACCESS_CODE?.trim()) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  try {
    const { kpis, charts, insights, columns, templateName } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: REPORT_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Generate an executive report for this marketing dashboard:

Template/Context: ${templateName || "Marketing Analytics"}
Columns: ${columns?.join(", ") || "N/A"}
KPIs: ${JSON.stringify(kpis)}
Charts: ${JSON.stringify(charts?.map((c: { type: string; title: string }) => ({ type: c.type, title: c.title })))}
Insights: ${JSON.stringify(insights)}`,
      }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No response");

    const report = parseClaudeJSON(textBlock.text);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Report generation failed" }, { status: 500 });
  }
}
