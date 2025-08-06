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

    // --- Advanced, Adaptive Prompt for Websites & Games ---
    const prompt = `
      ROLE: You are an expert front-end developer specializing in creating fully interactive, self-contained web applications and games using HTML, Tailwind CSS, and vanilla JavaScript.

      TASK: Your goal is to generate the complete, functional code for a web experience based on the user's request: "${phrase}".

      **PRIMARY DIRECTIVE: ANALYZE AND EXECUTE**
      First, analyze the user's request.
      - If it asks for a simple informational page (e.g., "a portfolio"), create a beautiful, minimal site with NO JAVASCRIPT.
      - If it asks for a game or an interactive application (e.g., "a playable tic-tac-toe game", "a todo list app"), you MUST build a COMPLETE AND FULLY FUNCTIONAL application.

      ---
      **REQUIREMENTS FOR INTERACTIVE APPLICATIONS & GAMES (HIGHEST PRIORITY):**
      ---
      When building an interactive experience, it is not enough for it to just look correct. It MUST work.
      - **Functionality is Paramount:** The application MUST be fully playable or usable from start to finish. All buttons, inputs, and game mechanics MUST work as expected. DO NOT omit any logic.
      - **Complete JavaScript Logic:** You MUST write all necessary vanilla JavaScript inside a single \`<script>\` tag. This includes:
          - **State Management:** Tracking scores, player turns, game state (e.g., 'gameover'), list items, etc.
          - **Event Handling:** Proper event listeners for all user actions (clicks, form submissions, etc.).
          - **Win/Loss/Draw Conditions:** Clear logic to determine the outcome of a game and display it to the user.
      - **User Feedback:** The UI must provide clear feedback, such as "Player X's Turn," "You Win!," or updating lists and counters in real-time.
      - **Self-Contained:** The code must not require any external files besides Tailwind CSS.

      **--- CRUCIAL TECHNICAL RULES FOR ALL OUTPUTS ---**
      1.  The entire response MUST be a single, self-contained \`<div>\` element.
      2.  You MUST use ONLY Tailwind CSS classes for all styling.
      3.  You MUST NOT include \`<html>\`, \`<body>\`, \`<head>\`, or markdown formatting like \`\`\`html.

      **FINAL CHECK:** Before outputting, ask yourself: "Can a user copy this code, open it in a browser, and immediately play the game or use the application without any errors or missing features?" The answer must be YES.
    `;

    console.log('Generating content with Gemini (using advanced adaptive prompt)...');
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
