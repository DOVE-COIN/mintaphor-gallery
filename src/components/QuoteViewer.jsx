import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { MINTAPHOR_ADDRESS, MINTAPHOR_ABI } from '../constants';

const QuoteViewer = ({ provider }) => {
  const { id } = useParams();
  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const contract = new ethers.Contract(MINTAPHOR_ADDRESS, MINTAPHOR_ABI, provider);
        const uri = await contract.tokenURI(id);
        const json = atob(uri.split(',')[1]);
        const metadata = JSON.parse(json);
        setQuoteData(metadata);
      } catch (err) {
        console.error("❌ Failed to fetch NFT:", err);
      }
    };

    if (provider) fetchQuote();
  }, [provider, id]);

  if (!quoteData) return <p>Loading quote...</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{quoteData.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: atob(quoteData.image.split(',')[1]) }} />
      <p>{quoteData.description}</p>
    </div>
  );
};

export default QuoteViewer;
