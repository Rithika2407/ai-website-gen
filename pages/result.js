import { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Result.module.css';

const Result = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const html = queryParams.get('html');
      const desc = queryParams.get('description');

      // Debug: Log received query params
      console.log('Received query params:', { html, description: desc });

      if (html && desc) {
        setHtmlCode(decodeURIComponent(html));
        setDescription(decodeURIComponent(desc));
      } else {
        setError('Failed to load the generated content. Missing query parameters.');
      }
    } catch (err) {
      console.error('Error parsing query parameters:', err);
      setError('An error occurred while loading the content.');
    }
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.hero}>
        <h1 className={styles.title}>Generated Website</h1>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Generated HTML/CSS Code</h2>
          <pre className={styles.codeBlock}>{htmlCode}</pre>

          <h2 className={styles.resultTitle}>Description</h2>
          <p>{description}</p>
        </div>
      </main>
    </div>
  );
};

export default Result;
