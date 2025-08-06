'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DynamicPage() {
  const params = useParams();
  const phrase = params.phrase as string;
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phrase) {
      const generatePage = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phrase: decodeURIComponent(phrase) }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate page content.');
          }

          const data = await response.json();
          setContent(data.code);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };

      generatePage();
    }
  }, [phrase]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
