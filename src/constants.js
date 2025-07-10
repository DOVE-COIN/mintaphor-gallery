export const MINTAPHOR_ADDRESS = "0x70dc308d54aC1103BfcB02DFF5EB12f6EB55Ba80";

export const MINTAPHOR_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "quote",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "author",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
