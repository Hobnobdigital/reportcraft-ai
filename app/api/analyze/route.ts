import { NextResponse } from "next/server";
import { analyzeData } from "@/lib/claude";

export async function POST(req: Request) {
  const accessCode = req.headers.get("x-access-code")?.trim();
  if (!accessCode || accessCode !== process.env.ACCESS_CODE?.trim()) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data, columns, template } = body;

    if (!data || !columns || !Array.isArray(data) || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected data array and columns array." },
        { status: 400 }
      );
    }

    const result = await analyzeData(data, columns, template);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
