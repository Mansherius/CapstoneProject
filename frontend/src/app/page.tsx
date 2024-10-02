'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/hello')  // This will now be proxied to Flask
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error('Error fetching from Flask:', err);
        setMessage('Failed to load message');
        setError(err.toString());
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold">{message}</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
