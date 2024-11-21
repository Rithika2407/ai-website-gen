import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async () => {
    const userPrompt = document.getElementById('promptInput').value;

    if (!userPrompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generateDesign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate design from SambaNova.');
      }

      const data = await response.json();
      const { htmlCssCode, alternativeSuggestions } = data;

      if (!htmlCssCode && !alternativeSuggestions) {
        throw new Error('No data received from API.');
      }

      // Debug: Log data before redirection
      console.log('Redirecting with data:', { htmlCssCode, alternativeSuggestions });

      // Redirect to result page with query params
      router.push({
        pathname: '/result',
        query: {
          html: encodeURIComponent(htmlCssCode),
          description: encodeURIComponent(alternativeSuggestions),
        },
      });
    } catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while generating the design. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.hero}>
        <h1 className={styles.title}>Build websites with a click.</h1>

        <div className={styles.promptCard}>
          <h2 className={styles.promptTitle}>Enter prompt below</h2>
          <input
            type="text"
            id="promptInput"
            className={styles.promptInput}
            placeholder="Type your prompt here..."
          />
          <button onClick={handleGenerate} className={styles.generateBtn} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Website'}
          </button>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </main>
    </div>
  );
}
