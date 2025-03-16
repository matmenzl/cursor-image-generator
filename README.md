# AI Image Generator

Eine moderne Webanwendung zur KI-gestützten Bildgenerierung mit Next.js 14 und FAL.ai.

## Features

- Bildgenerierung mit FAL.ai's Flux Pro Modell
- Moderne UI mit Tailwind CSS
- Echtzeit-Statusupdates
- Responsive Design
- Sichere API-Key-Handhabung

## Installation

1. Repository klonen:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
   - Erstelle eine `.env.local` Datei im Root-Verzeichnis
   - Füge deinen FAL.ai API-Key hinzu:
```bash
FAL_API_KEY="dein-fal-api-key"
```

4. Development Server starten:
```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Umgebungsvariablen

Die folgenden Umgebungsvariablen müssen in `.env.local` gesetzt werden:

- `FAL_API_KEY`: Dein FAL.ai API-Key (erforderlich)

## Technologie-Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- FAL.ai API