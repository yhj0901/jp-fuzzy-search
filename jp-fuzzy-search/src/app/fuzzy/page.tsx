// app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';

// 문서 타입 정의
interface Document {
  id: number;
  title: string;
  text: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Document[]>([]);
  const [isClient, setIsClient] = useState(false);

  // useEffect를 사용하여 클라이언트 사이드임을 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 검색 요청 함수
  const handleSearch = async () => {
    if (!query.trim()) return;
    console.log('query : ', query);

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log('data : ', data);
    setResults(data.results);
  };

  // 클라이언트 사이드 렌더링이 준비되기 전까지는 아무것도 렌더링하지 않음
  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">검색 페이지</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="border border-gray-300 p-2 mr-2 rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        검색
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">검색 결과:</h2>
        {results.length > 0 ? (
          <ul className="list-disc ml-6">
            {results.map((result) => (
              <li key={result.id}>
                <strong>{result.title}</strong>: {result.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
