import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    let data = { url };
    if (shortcode) data.shortcode = shortcode;
    if (validity) data.validity = Number(validity);

    try {
      const response = await fetch('http://localhost:4000/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resJson = await response.json();

      if (response.ok) {
        setResult(resJson);
      } else {
        setError(resJson.message || 'Failed to shorten URL');
      }
    } catch {
      setError('Server not reachable');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Long URL:<br />
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <br /><br />
        <label>
          Custom Shortcode (optional):<br />
          <input type="text" value={shortcode} onChange={e => setShortcode(e.target.value)} />
        </label>
        <br /><br />
        <label>
          Validity (minutes, optional):<br />
          <input type="number" min="1" value={validity} onChange={e => setValidity(e.target.value)} />
        </label>
        <br /><br />
        <button type="submit">Shorten</button>
      </form>
      {result && (
        <div style={{ marginTop: '1rem', color: 'green' }}>
          <b>Short URL:</b> <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">{result.shortUrl}</a>
          <br />
          <b>Expiry:</b> {result.expiry}
        </div>
      )}
      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>
          <b>Error: </b>{error}
        </div>
      )}
    </div>
  );
}

export default App;
