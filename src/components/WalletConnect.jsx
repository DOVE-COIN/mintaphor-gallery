import { useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const MONAD_TESTNET = {
    chainId: '0x279F', // 10143 in hex
    chainName: 'Monad Testnet',
    rpcUrls: ['https://node.testnet.monad.xyz'],
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18
    },
    blockExplorerUrls: ['https://explorer.testnet.monad.xyz']
  };

  const switchToMonad = async () => {
    if (!window.ethereum) return alert('MetaMask is not installed');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainId }]
      });
    } catch (switchError) {
      // If the chain has not been added, request to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET]
          });
        } catch (addError) {
          console.error('Add chain error:', addError);
        }
      } else {
        console.error('Switch error:', switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    await switchToMonad();

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    // Handle chain/network/account changes
    window.ethereum.on('accountsChanged', () => connectWallet());
    window.ethereum.on('chainChanged', () => connectWallet());

    return () => {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
      <button
        onClick={connectWallet}
        style={{
          padding: '0.8rem 1.6rem',
          backgroundColor: '#8A2BE2',
          color: '#fff',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;
