import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

if (!process.env.FAL_API_KEY) {
  throw new Error("FAL_API_KEY ist nicht in den Umgebungsvariablen definiert");
}

fal.config({
  credentials: process.env.FAL_API_KEY
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt,
        num_images: 4,
        enable_safety_checker: true,
        safety_tolerance: "2",
        output_format: "jpeg",
        aspect_ratio: "1:1",
        raw: false
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fehler bei der Bildgenerierung:", error);
    return NextResponse.json(
      { error: "Fehler bei der Bildgenerierung" },
      { status: 500 }
    );
  }
} 