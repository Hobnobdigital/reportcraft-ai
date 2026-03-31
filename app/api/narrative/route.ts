import { NextResponse } from "next/server";
import { generateNarrative } from "@/lib/claude";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kpis, charts, insights, columns } = body;

    if (!kpis || !charts || !insights || !columns) {
      return NextResponse.json(
        { error: "Invalid request body. Expected kpis, charts, insights, and columns." },
        { status: 400 }
      );
    }

    const narrative = await generateNarrative(kpis, charts, insights, columns);
    return NextResponse.json({ narrative });
  } catch (error) {
    console.error("Narrative generation error:", error);
    const message = error instanceof Error ? error.message : "Narrative generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
