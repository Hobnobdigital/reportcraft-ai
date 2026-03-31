import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult } from "./types";
import { parseClaudeJSON } from "./parseJSON";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANALYZE_SYSTEM_PROMPT = `You are a senior marketing analytics expert. You analyze datasets and produce executive-ready dashboard configurations.

Given a dataset, you must:
1. Identify the data types of each column (numeric, categorical, date, percentage, currency)
2. Select the top 4 KPIs - the most important metrics. For each KPI, provide:
   - label: human-readable name
   - value: the computed value (sum, average, or latest depending on context)
   - format: "number", "currency", "percentage"
   - trend: "up" or "down"
   - trendValue: percentage change or comparison value
   - sparklineData: array of 6-8 values for a mini trend line
3. Recommend 3 charts. For each chart, provide:
   - type: "bar", "line", "area", "pie", "composed"
   - title: descriptive chart title
   - xKey: column to use for x-axis
   - yKeys: array of columns for y-axis (allows multi-series)
   - colors: array of hex colors to use (use these colors: #635BFF, #00D4AA, #0073E6, #FFBB00, #DF1B41, #8B5CF6)
   - data: the data subset for this chart
4. Identify 3-5 key insights as short bullet strings

Respond ONLY with valid JSON matching this exact schema:
{
  "kpis": [...],
  "charts": [...],
  "insights": [...]
}

Do not include any text outside the JSON. Do not wrap in markdown code blocks.`;

const NARRATIVE_SYSTEM_PROMPT = `You are a senior marketing strategist writing an executive dashboard summary for a CMO.

Given KPIs, chart configurations, and insights from a marketing dataset, write a 3-paragraph executive narrative:

Paragraph 1 - Overview: A high-level summary of what the data shows. Set the scene.
Paragraph 2 - Key Findings: The most important patterns, anomalies, and opportunities. Be specific with numbers.
Paragraph 3 - Recommendations: 2-3 actionable next steps based on the data.

Write in a confident, executive tone. Be concise. Use specific numbers from the KPIs.
Do not use bullet points. Write in flowing paragraphs.
Keep the total length under 250 words.

Return ONLY the narrative text, no JSON, no markdown headers.`;

export async function analyzeData(
  data: Record<string, unknown>[],
  columns: string[],
  template?: string
): Promise<AnalysisResult> {
  const dataStr = JSON.stringify(data.slice(0, 50));
  const userMessage = `Analyze this dataset and generate a dashboard configuration.

Columns: ${columns.join(", ")}
${template ? `Template context: ${template}` : ""}

Data (${data.length} rows total, showing first ${Math.min(data.length, 50)}):
${dataStr}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: ANALYZE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const parsed = parseClaudeJSON<AnalysisResult>(textBlock.text);
  return parsed;
}

export async function generateNarrative(
  kpis: AnalysisResult["kpis"],
  charts: AnalysisResult["charts"],
  insights: string[],
  columns: string[]
): Promise<string> {
  const userMessage = `Generate an executive narrative for this dashboard:

KPIs: ${JSON.stringify(kpis)}
Charts: ${JSON.stringify(charts.map((c) => ({ type: c.type, title: c.title })))}
Insights: ${JSON.stringify(insights)}
Data columns: ${columns.join(", ")}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: NARRATIVE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}
