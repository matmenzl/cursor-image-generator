import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

if (!process.env.FAL_KEY) {
  throw new Error("FAL_KEY ist nicht konfiguriert");
}

// Konfiguriere den FAL Client mit dem Proxy
fal.config({
  proxyUrl: "/api/fal/proxy"
});

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  if (!prompt) {
    return NextResponse.json({ error: "Prompt ist erforderlich" }, { status: 400 });
  }

  try {
    console.log("Starte Bildgenerierung mit FAL.ai...");
    console.log("Verwendeter Prompt:", prompt);
    
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt: prompt,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: "2",
        output_format: "jpeg",
        aspect_ratio: "1:1",
        raw: false
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Fortschritt:", update.logs.map((log) => log.message).join(", "));
        }
      },
    });

    console.log("API Antwort:", result);

    if (!result.data.images?.[0]?.url) {
      console.error("Keine Bilder in der Antwort:", result.data);
      throw new Error("Keine Bilder in der Antwort");
    }

    return NextResponse.json({ imageUrl: result.data.images[0].url });
  } catch (error: any) {
    console.error("Fehler bei der Bildgenerierung:", error);

    // Detaillierte Fehlerbehandlung
    if (error.message?.includes("authentication") || error.message?.includes("credentials")) {
      return NextResponse.json(
        { error: "Ungültiger API-Schlüssel. Bitte überprüfen Sie Ihre Konfiguration." },
        { status: 401 }
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return NextResponse.json(
        { error: "API-Limit erreicht. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Bildgenerierung fehlgeschlagen: ${error.message}` },
      { status: 500 }
    );
  }
} 