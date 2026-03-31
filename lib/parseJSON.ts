/**
 * Parse JSON from Claude responses that may be wrapped in markdown code blocks.
 */
export function parseClaudeJSON<T = unknown>(text: string): T {
  // Strip markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    // Remove opening ```json or ``` line
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
    // Remove closing ```
    cleaned = cleaned.replace(/\n?```\s*$/, "");
  }
  return JSON.parse(cleaned.trim()) as T;
}
