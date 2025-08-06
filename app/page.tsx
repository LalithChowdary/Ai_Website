'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [phrase, setPhrase] = useState('');
  const router = useRouter();

  const handleNavigate = () => {
    if (phrase) {
      router.push(`/${encodeURIComponent(phrase)}`);
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen">
      <main className="flex flex-col gap-8 items-center p-8">
        <h1 className="text-4xl font-bold text-center">Generate a Page with AI</h1>
        <p className="text-lg text-center text-gray-600">
          Enter a word or phrase, and we'll generate a webpage for you.
        </p>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
            className="rounded-md border border-gray-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 'dashboard' or 'a blog about cats'"
          />
          <button
            onClick={handleNavigate}
            className="rounded-md bg-blue-600 text-white px-6 py-2 text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate
          </button>
        </div>
      </main>
    </div>
  );
}
