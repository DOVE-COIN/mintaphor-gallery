import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const MONAD_TESTNET = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://node.testnet.monad.xyz'],
  blockExplorerUrls: ['https://explorer.testnet.monad.xyz'],
};

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const switchToMonadTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Chain not added
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } catch (addError) {
          console.error('Failed to add Monad Testnet:', addError);
        }
      } else {
        console.error('Error switching chain:', switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = accounts[0];

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setWalletAddress(address);
      setConnected(true);

      await switchToMonadTestnet();
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet(); // auto-connect and switch
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      {connected ? (
        <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
          ✅ Connected as {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button onClick={connectWallet} style={{
          padding: '0.8rem 1.6rem',
          fontSize: '1rem',
          background: '#8A2BE2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          🔌 Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
