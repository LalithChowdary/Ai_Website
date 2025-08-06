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

    // --- Refined Prompt for a Beautiful & Minimal Website ---
    const prompt = `
      Generate the HTML for a beautiful and minimal webpage about: "${phrase}".

      **Design Goals:**
      - **Aesthetic:** The design must be clean, elegant, and professional. Focus on great typography and generous white space.
      - **Theme:** Use a dark mode theme.
      - **Layout:** Keep it simple, clean, and easy to read.

      **Crucial Technical Rules:**
      1.  The entire response MUST be a single \`<div>\` element.
      2.  Use ONLY Tailwind CSS classes for all styling.
      3.  You MUST NOT include \`<html>\`, \`<body>\`, \`<head>\`, \`<script>\` tags, or markdown formatting like \`\`\`html.
    `;

    console.log('Generating content with Gemini (using refined minimal prompt)...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Successfully generated content.');

    // Clean the response to remove potential markdown fences that the model might still add
    const cleanedText = text.replace(/^```html\n?/, '').replace(/```$/, '').trim();

    return NextResponse.json({ code: cleanedText });
  } catch (error) {
    console.error('--- ERROR IN API ROUTE ---');
    console.error(error);
    console.error('--- END ERROR ---');
    return NextResponse.json({ error: 'Failed to generate page' }, { status: 500 });
  }
}
