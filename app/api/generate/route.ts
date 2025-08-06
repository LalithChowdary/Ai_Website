import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  console.log('--- API Route Hit ---');

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in .env.local');
    return NextResponse.json({ error: 'Server configuration error: API key not found.' }, { status: 500 });
  }
  console.log('GEMINI_API_KEY is present.');

  try {
    const { phrase } = await req.json();
    console.log(`Received phrase: "${phrase}"`);

    if (!phrase) {
      console.error('Validation Error: Phrase is required');
      return NextResponse.json({ error: 'Phrase is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Corrected Prompt: Ask for pure HTML, not TSX.
    const prompt = `
      You are an expert web developer assistant who specializes in Tailwind CSS.
      Generate the HTML code for a webpage about "${phrase}".
      The entire response must be a single self-contained div element.
      Use Tailwind CSS classes for all styling.
      Do NOT include any TSX, JSX, or JSX-style comments like {/* ... */}.
      Provide only the raw HTML code.

      For example, for the phrase "dashboard", you must return valid HTML like this:
      "<div class='p-8 bg-gray-100'><h1 class='text-3xl font-bold mb-4'>Dashboard</h1><p class='text-gray-700'>Welcome to your dashboard.</p></div>"
    `;

    console.log('Generating content with Gemini (using model gemini-1.5-flash)...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Successfully generated content.');

    return NextResponse.json({ code: text });
  } catch (error) {
    console.error('--- ERROR IN API ROUTE ---');
    console.error(error);
    console.error('--- END ERROR ---');
    return NextResponse.json({ error: 'Failed to generate page' }, { status: 500 });
  }
}
