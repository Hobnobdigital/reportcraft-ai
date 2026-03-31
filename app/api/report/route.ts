import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const REPORT_SYSTEM_PROMPT = `You are a senior executive report writer creating a Vancity-style annual report for marketing data. Write compelling, data-driven executive narratives.

Given dashboard data (KPIs, charts, insights), generate a complete report structure:

1. COVER: A compelling report title and subtitle based on the data context
2. EXECUTIVE SUMMARY: 3 paragraphs (Overview, Key Findings, Recommendations) — 300 words total, executive tone, specific numbers
3. SECTION NARRATIVES: For each chart, write a 2-3 sentence analytical caption explaining what the chart shows and why it matters
4. IMAGE PROMPTS: For 2 lifestyle/contextual images that would enhance the data storytelling. These should be photorealistic scenes related to the business context (e.g., marketing team in a modern office, data analytics on screens, business meeting). Each prompt should be detailed, specifying lighting, composition, and mood.
5. KEY TAKEAWAYS: 3-4 bullet points summarizing the most important findings

Respond with valid JSON:
{
  "title": "Report Title",
  "subtitle": "One-line subtitle",
  "date": "Month Year",
  "executiveSummary": {
    "overview": "paragraph 1",
    "keyFindings": "paragraph 2",
    "recommendations": "paragraph 3"
  },
  "chartCaptions": ["caption for chart 1", "caption for chart 2", "caption for chart 3"],
  "imagePrompts": [
    "Detailed photorealistic image prompt 1 for lifestyle/contextual image",
    "Detailed photorealistic image prompt 2 for lifestyle/contextual image"
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

    const report = JSON.parse(textBlock.text);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
