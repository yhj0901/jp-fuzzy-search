import { useState } from 'react';
import * as wanakana from 'wanakana';

export default function WanakanaComponent() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // 히라가나로 변환
  const convertHiragana = (inputString: string): string => {
    const converted = wanakana.toHiragana(inputString);
    return converted;
  };

  // 로마자로 변환
  const convertRomaji = (inputString: string): string => {
    const converted = wanakana.toRomaji(inputString);
    return converted;
  };

  const convert = () => {
    const converted = convertHiragana(inputText);
    console.log('converted : ', converted);
    const convertedRomaji = convertRomaji(converted);
    console.log('convertedRomaji : ', convertedRomaji);
    setOutputText(convertedRomaji);
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
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3">변환 결과:</h2>
          <p>{outputText || '변환 결과가 없습니다.'}</p>
        </div>
      </div>
    </div>
  );
}
