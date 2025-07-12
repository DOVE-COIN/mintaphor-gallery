import { useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setProvider, setSigner, setAddress }) => {
  const MONAD_TESTNET_PARAMS = {
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

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected');
      return;
    }

    try {
      // Check for correct chain
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== MONAD_TESTNET_PARAMS.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Add network if not present
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MONAD_TESTNET_PARAMS],
            });
          } else {
            console.error('Switch chain error:', switchError);
            return;
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
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
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
      <button
        onClick={connectWallet}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#8A2BE2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;
