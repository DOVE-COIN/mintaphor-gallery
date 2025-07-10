import { useEffect, useState } from 'react';
import { MINTAPHOR_ABI, MINTAPHOR_ADDRESS } from '../constants';
import { ethers } from 'ethers';

const Gallery = ({ provider, userAddress, darkMode }) => {
  const [nfts, setNfts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const contract = new ethers.Contract(MINTAPHOR_ADDRESS, MINTAPHOR_ABI, provider);

  const loadNFTs = async () => {
    const tokens = [];
    let tokenId = 0;

    while (true) {
      try {
        const uri = await contract.tokenURI(tokenId);
        const json = atob(uri.split(',')[1]);
        const metadata = JSON.parse(json);

        if (showMineOnly) {
          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() !== userAddress.toLowerCase()) {
            tokenId++;
            continue;
          }
        }

        tokens.push({ tokenId, ...metadata });
        tokenId++;
      } catch (err) {
        break;
      }
    }

    setNfts(tokens.reverse());
    filterTokens(tokens, searchText);
  };

  const filterTokens = (tokens, text) => {
    const filtered = tokens.filter((nft) =>
      nft.description.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filtered);
  };

  const downloadSVG = (base64URI, id) => {
    const link = document.createElement('a');
    link.href = base64URI;
    link.download = `Mintaphor_${id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (provider) loadNFTs();
  }, [provider, showMineOnly]);

  useEffect(() => {
    filterTokens(nfts, searchText);
  }, [searchText, nfts]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🖼️ Minted Quotes</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={showMineOnly}
          onChange={() => setShowMineOnly(!showMineOnly)}
          style={{ marginRight: '0.5rem' }}
        />
        Show only my quotes
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search quotes or author"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#f5f0ff' : '#000',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((nft) => (
            <div
              key={nft.tokenId}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                background: darkMode ? '#2b2b2b' : '#fff',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: atob(nft.image.split(',')[1]) }}
                style={{ fontFamily: '"Caveat", cursive', marginBottom: '0.5rem' }}
              />
              <p style={{ margin: '0.4rem 0', fontWeight: 'bold' }}>#{nft.tokenId}</p>
              <p>{nft.description}</p>
              <button
                onClick={() => downloadSVG(nft.image, nft.tokenId)}
                style={{
                  marginTop: '0.6rem',
                  padding: '0.3rem 0.8rem',
                  background: '#8A2BE2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ⬇️ Download SVG
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
