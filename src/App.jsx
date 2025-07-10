import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import MintForm from './components/MintForm';
import Gallery from './components/Gallery';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      padding: '2rem',
      fontFamily: "'Libre Baskerville', sans-serif"
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
        background: 'var(--card)',
        borderRadius: '16px',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ color: '#8A2BE2', textAlign: 'center' }}>🟣 Mintaphor Gallery</h1>
        <WalletConnect setProvider={setProvider} setSigner={setSigner} setAddress={setAddress} />
        {signer && <MintForm signer={signer} />}
        {provider && <Gallery provider={provider} userAddress={address} />}

        <p style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: 'gray',
          fontSize: '0.9rem'
        }}>
          🔮 Mintaphor by Gentledove.eth · Built on Monad · © 2025
        </p>
      </div>
    </div>
  );
}

export default App;
