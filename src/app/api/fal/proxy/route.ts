import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = req.headers.get('x-fal-target-url');
    const falKey = req.headers.get('x-fal-key');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL fehlt' }, { status: 400 });
    }

    if (!falKey) {
      return NextResponse.json({ error: 'API Key fehlt' }, { status: 400 });
    }

    console.log('POST Proxy-Anfrage an:', targetUrl);
    console.log('API-Key vorhanden:', !!falKey);
    console.log('API-Key Länge:', falKey.length);
    console.log('Request-Body:', JSON.stringify(body, null, 2));

    const headers = {
      'Authorization': `Key ${falKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    console.log('Request Headers:', headers);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const responseData = await response.json();

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('API Response Text:', JSON.stringify(responseData));
    console.log('API Response Data:', responseData);

    if (!response.ok) {
      console.log('API Error Response:', responseData);
      return NextResponse.json(responseData, { status: response.status });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    const falKey = req.headers.get('x-fal-key');

    if (!url) {
      return NextResponse.json({ error: 'URL Parameter fehlt' }, { status: 400 });
    }

    if (!falKey) {
      return NextResponse.json({ error: 'API Key fehlt' }, { status: 400 });
    }

    console.log('GET Proxy-Anfrage an:', url);
    console.log('API-Key vorhanden:', !!falKey);
    console.log('API-Key Länge:', falKey.length);

    const headers = {
      'Authorization': `Key ${falKey}`,
      'Accept': 'application/json'
    };

    console.log('Request Headers:', headers);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    const responseData = await response.json();

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('API Response Text:', JSON.stringify(responseData));
    console.log('API Response Data:', responseData);

    if (!response.ok) {
      console.log('API Error Response:', responseData);
      return NextResponse.json(responseData, { status: response.status });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
} 