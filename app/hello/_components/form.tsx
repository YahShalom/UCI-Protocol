'use client';

import { useState } from 'react';

export function Form() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const a = Number(formData.get('a'));
    const b = Number(formData.get('b'));

    const response = await fetch('/api/uci/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_id: crypto.randomUUID(),
        capability_id: 'uci:local:math.add',
        parameters: { a, b },
      }),
    });

    const data = await response.json();

    if (response.ok && data.outcome?.status === 'SUCCESS') {
      setResult(JSON.stringify(data.outcome.result, null, 2));
      setError(null);
    } else {
      setResult(null);
      setError(data.error ?? data.outcome?.error ?? 'Unknown error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <input type="number" name="a" defaultValue="2" className="border p-2 rounded w-24" />
        <span>+</span>
        <input type="number" name="b" defaultValue="2" className="border p-2 rounded w-24" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          =
        </button>
      </div>
      {result && (
        <div>
          <h2 className="text-xl font-bold">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded">{result}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-xl font-bold text-red-500">Error:</h2>
          <pre className="bg-red-100 p-4 rounded">{error}</pre>
        </div>
      )}
    </form>
  );
}
