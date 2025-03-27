import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt ist erforderlich" },
        { status: 400 }
      );
    }

    if (!process.env.FAL_API_KEY) {
      return NextResponse.json(
        { error: "FAL API Key nicht konfiguriert" },
        { status: 500 }
      );
    }

    console.log("Sende Anfrage an FAL.ai mit Prompt:", prompt);

    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt,
        image_size: "square_hd",
        num_images: 4
      },
    });

    console.log("Queue Update:", JSON.stringify(result, null, 2));

    if (!result || !result.data) {
      throw new Error("Keine Daten in der Antwort");
    }

    // Extrahiere die URLs aus den Bildobjekten
    const imageUrls = result.data.images.map((image: any) => image.url);

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("Keine gültigen Bild-URLs gefunden");
    }

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error("Fehler bei der Bildgenerierung:", error);
    return NextResponse.json(
      { error: "Fehler bei der Bildgenerierung" },
      { status: 500 }
    );
  }
} 