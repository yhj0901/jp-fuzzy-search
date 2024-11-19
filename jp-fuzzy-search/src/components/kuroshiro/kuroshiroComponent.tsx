import { useState } from 'react';

export default function KuroshiroComponent() {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [error, setError] = useState(null);

  const convert = async () => {
    if (!inputText) return;

    try {
      setError(null);

      const response = await fetch(
        'https://jp-fuzzy-search.vercel.app/api/convert',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to convert text');
      }

      const data = await response.json();
      setConvertedText(data.modifiedRomaji);
    } catch (error) {
      console.error('Error initializing Kuroshiro:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">한자 로마자 변환기</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="한자를 입력하세요"
          className="border border-gray-300 p-2 rounded text-black"
        />
        <button
          onClick={convert}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          변환
        </button>
        {convertedText && (
          <div style={{ marginTop: '20px' }}>
            <h2>Converted Text:</h2>
            <p>{convertedText}</p>
          </div>
        )}
        {error && (
          <div style={{ marginTop: '20px', color: 'red' }}>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
