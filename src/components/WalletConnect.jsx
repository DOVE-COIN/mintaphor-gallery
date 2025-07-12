import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const [connected, setConnected] = useState(false);

  const ensureMonadNetwork = async () => {
    const monadChainId = '0x278f'; // 10143 in hex

    if (window.ethereum.networkVersion !== '10143') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: monadChainId }],
        });
      } catch (switchError) {
        // If Monad Testnet is not added to MetaMask, add it
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
          }
        } else {
          console.error('Failed to switch network:', switchError);
        }
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        await ensureMonadNetwork(); // 🟣 Prompt to switch if not on Monad

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setConnected(true);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

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
