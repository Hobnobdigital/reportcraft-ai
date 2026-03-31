import { NextResponse } from "next/server";

const REPLICATE_URL = "https://api.replicate.com/v1/models/google/nano-banana-2/predictions";

// Curated fallback images for different contexts — high quality Unsplash photos
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&q=80", // data dashboard
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop&q=80", // analytics office
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=900&fit=crop&q=80", // team collaboration
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&h=900&fit=crop&q=80", // modern workspace
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop&q=80", // city skyline
];

async function tryGenerate(token: string, prompt: string, retries = 3): Promise<string | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(REPLICATE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "wait",
        },
        body: JSON.stringify({
          input: { prompt, aspect_ratio: "16:9" },
        }),
      });

      if (res.status === 429 || res.status === 503) {
        // Rate limited — wait and retry
        const delay = (attempt + 1) * 5000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) return null;

      const data = await res.json();
      if (data.status === "failed") {
        if (data.error?.includes("high demand") && attempt < retries - 1) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
          continue;
        }
        return null;
      }

      const url = typeof data.output === "string" ? data.output : Array.isArray(data.output) ? data.output[0] : null;
      return url;
    } catch {
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  const token = process.env.REPLICATE_API_TOKEN;

  try {
    const { prompt, index = 0 } = await req.json();

    if (token && prompt) {
      const imageUrl = await tryGenerate(token, prompt);
      if (imageUrl) {
        return NextResponse.json({ url: imageUrl, fallback: false });
      }
    }

    // Fallback to curated Unsplash images
    const fallbackUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    return NextResponse.json({ url: fallbackUrl, fallback: true });
  } catch {
    const fallbackUrl = FALLBACK_IMAGES[0];
    return NextResponse.json({ url: fallbackUrl, fallback: true });
  }
}
