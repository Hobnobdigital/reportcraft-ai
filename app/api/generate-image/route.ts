import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const accessCode = req.headers.get("x-access-code")?.trim();
  if (!accessCode || accessCode !== process.env.ACCESS_CODE?.trim()) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  const replicateToken = process.env.REPLICATE_API_TOKEN;
  if (!replicateToken) {
    // If no Replicate key, return a placeholder image URL
    return NextResponse.json({
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      fallback: true,
    });
  }

  try {
    const { prompt } = await req.json();

    // Call Replicate's google/nano-banana-2 model
    const response = await fetch("https://api.replicate.com/v1/models/google/nano-banana-2/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${replicateToken}`,
        "Content-Type": "application/json",
        "Prefer": "wait",
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          aspect_ratio: "16:9",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Replicate error:", error);
      return NextResponse.json({
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        fallback: true,
      });
    }

    const prediction = await response.json();
    const imageUrl = typeof prediction.output === "string"
      ? prediction.output
      : Array.isArray(prediction.output) ? prediction.output[0] : null;

    if (!imageUrl) {
      return NextResponse.json({
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        fallback: true,
      });
    }

    return NextResponse.json({ url: imageUrl, fallback: false });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      fallback: true,
    });
  }
}
