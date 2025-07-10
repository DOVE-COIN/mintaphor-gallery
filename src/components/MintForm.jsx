import { useState } from 'react';
import { MINTAPHOR_ABI, MINTAPHOR_ADDRESS } from '../constants';
import { ethers } from 'ethers';

const MintForm = ({ signer }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    if (!quote.trim() || !author.trim()) {
      alert("Quote and author can't be empty.");
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(MINTAPHOR_ADDRESS, MINTAPHOR_ABI, signer);
      const tx = await contract.mint(quote, author);
      await tx.wait();
      alert("✅ Minted successfully!");
      setQuote('');
      setAuthor('');
    } catch (err) {
      console.error("Minting failed:", err);
      alert("❌ Minting failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const previewSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#8A2BE2" />
      <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="18" font-family="'Libre Baskerville', serif">${quote || '“Your quote here...”'}</text>
      <text x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" fill="#FDEFFF" font-size="14" font-family="'Libre Baskerville', serif">— ${author || 'Author'}</text>
    </svg>
  `;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>✍️ Mint a Quote</h2>

      <textarea
        placeholder="Your quote..."
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        style={{
          width: '100%',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontFamily: "'Libre Baskerville', serif"
        }}
        rows={4}
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{
          width: '100%',
          padding: '0.8rem',
          marginBottom: '1rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontFamily: "'Libre Baskerville', serif"
        }}
      />

      <div style={{
        border: '1px solid #ddd',
        padding: '1rem',
        marginBottom: '1rem',
        background: '#f8f6ff',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div dangerouslySetInnerHTML={{ __html: previewSVG }} />
        <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '0.5rem' }}>🖼️ Live Preview</p>
      </div>

      <button
        onClick={handleMint}
        disabled={loading}
        style={{
          backgroundColor: '#8A2BE2',
          color: '#fff',
          padding: '0.9rem 2rem',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Minting...' : '🚀 Mint'}
      </button>
    </div>
  );
};

export default MintForm;
