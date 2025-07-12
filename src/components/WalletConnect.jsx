import { useState } from 'react';
import { ethers } from 'ethers';

export default function WalletConnect({ setProvider, setSigner, setAddress }) {
  const [connected, setConnected] = useState(false);

  const MONAD_TESTNET_PARAMS = {
    chainId: '0x279F', // 10143
    chainName: 'Monad Testnet',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18,
    },
    rpcUrls: ['https://node.testnet.monad.xyz'],
    blockExplorerUrls: ['https://explorer.testnet.monad.xyz'],
  };

  const switchToMonad = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_PARAMS.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET_PARAMS],
          });
        } catch (addError) {
          console.error('Failed to add Monad Testnet:', addError);
        }
      } else {
        console.error('Failed to switch to Monad Testnet:', switchError);
      }
    }
  };

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

    await switchToMonad(); // 🚀 Switch to Monad after connecting
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
