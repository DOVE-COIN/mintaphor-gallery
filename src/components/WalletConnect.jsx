import { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const [connected, setConnected] = useState(false);

  const ensureMonadNetwork = async () => {
    const monadChainId = '0x278f'; // 10143 in hex

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== monadChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: monadChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: monadChainId,
                chainName: 'Monad Testnet',
                rpcUrls: ['https://node.testnet.monad.xyz'],
                nativeCurrency: {
                  name: 'Monad',
                  symbol: 'MON',
                  decimals: 18
                },
                blockExplorerUrls: ['https://explorer.testnet.monad.xyz']
              }]
            });
          } catch (addError) {
            console.error('Failed to add Monad Testnet:', addError);
            throw addError;
          }
        } else {
          console.error('Failed to switch to Monad Testnet:', switchError);
          throw switchError;
        }
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await ensureMonadNetwork();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setConnected(true);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      {!connected && (
        <button
          onClick={connectWallet}
          style={{
            padding: '0.8rem 1.5rem',
            background: '#8A2BE2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          🔌 Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
