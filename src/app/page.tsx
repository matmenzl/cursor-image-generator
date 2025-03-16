"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);
    setProgress("Starte Bildgenerierung...");

    try {
      const response = await fetch("/api/fal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Fehler bei der API-Anfrage");
      }

      const result = await response.json();
      console.log("API Antwort:", result);

      if (!result.data?.images) {
        console.error("Keine Bilder in der Antwort gefunden:", JSON.stringify(result, null, 2));
        throw new Error("Keine Bilder in der Antwort gefunden");
      }

      const newImages = result.data.images.map((img: any) => img.url);
      console.log("Generierte Bild-URLs:", newImages);
      setImages(newImages);
      setProgress("");

    } catch (error: any) {
      console.error("Bildgenerierung fehlgeschlagen:", error);
      setError(error.message || "Ein unerwarteter Fehler ist aufgetreten");
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Text Area and Button */}
        <Card className="p-4">
          <textarea
            className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Beschreibe das Bild, das du generieren möchtest"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button 
            onClick={generateImage} 
            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white"
            disabled={loading}
          >
            {loading ? "Generieren..." : "Bild erstellen"}
          </Button>
          {progress && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg">
              {progress}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </Card>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {Array(4).fill(null).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {images[index] ? (
                  <Image
                    src={images[index]}
                    alt={`Generiertes Bild ${index + 1}`}
                    width={512}
                    height={512}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Bild {index + 1}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
