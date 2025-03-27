"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [url, setUrl] = useState('');
  const router = useRouter();

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Bitte geben Sie einen Text ein");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus("Sende Anfrage...");

    try {
      const response = await fetch("/api/fal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten');
      }

      if (!data.images || !Array.isArray(data.images)) {
        throw new Error("Ungültiges Antwortformat vom Server");
      }

      // Filtere ungültige URLs heraus
      const validImages = data.images.filter((url: string) => url && typeof url === 'string' && url.length > 0);
      
      if (validImages.length === 0) {
        throw new Error("Keine gültigen Bilder erhalten");
      }

      setImages(validImages);
      setStatus(null);
    } catch (err) {
      console.error("Fehler:", err);
      setError(err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten");
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Verarbeitung der URL');
      }

      const data = await response.json();
      router.push(`/quiz/${data.quizId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <Button 
            onClick={generateImage} 
            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Generieren..." : "Bild erstellen"}
          </Button>
          {status && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg">
              {status}
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
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))
          ) : images.length > 0 ? (
            images.map((url, i) => (
              <div key={i} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Generiertes Bild ${i + 1}`}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={i < 2}
                  unoptimized
                />
              </div>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
