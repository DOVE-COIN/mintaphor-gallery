import { useState } from 'react';
import { ethers } from 'ethers';

export default function WalletConnect({ setProvider, setSigner, setAddress }) {
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setProvider(provider);
    setSigner(signer);
    setAddress(address);
    setConnected(true);
  };

  return (
    <div>
      {!connected ? (
        <button onClick={connect}>🔗 Connect Wallet</button>
      ) : (
        <p>✅ Wallet connected</p>
      )}
    </div>
  );
}
