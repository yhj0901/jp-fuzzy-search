import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Document {
  id: number;
  title: string;
  text: string;
}

const documents: Document[] = [
  { id: 1, title: '벽에 구멍이 있습니다', text: '壁穴開いてます' },
  { id: 2, title: '문이 열려 있습니다', text: 'ドアが開いています' },
  {
    id: 3,
    title: 'ハりまくり?! テント日和!',
    text: 'ハりまくり?! テント日和!',
  },
  {
    id: 4,
    title: 'セッ◯ススキャン',
    text: 'セッ◯ススキャン ー最大多数の女を落とす攻略法ー',
  },
  { id: 5, title: '異世界☆人妻ハンター', text: '異世界☆人妻ハンター' },
  { id: 6, title: 'オイシイ集まり', text: 'オイシイ集まり' },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchDocuments(query: string): Promise<Document[]> {
  console.log('query : ', query);
  try {
    // GPT에게 유사도 평가 요청
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `당신은 일본어 텍스트의 의미적 유사도를 평가하는 API입니다.
          반드시 아래 JSON 형식으로 데이터를 만들어서 응답하며, 추가 설명이나 주석을 포함해서는 안 됩니다:
          {
            "document_similarity": [
              {"title": string, "content": string, "similarity_score": number}
            ]
          }`,
        },
        {
          role: 'user',
          content: `"${query}" 일본어와 뜻이 유사한 것을 제목과 내용에서 찾아서 문서 목록을 정리해서 알려줘 유사하지 않은 문서는 제외해줘
          문서 목록:
          ${documents
            .map((doc) => `${doc.id}. 제목: ${doc.title}, 내용: ${doc.text}`)
            .join('\n')}
          각 문서의 유사도를 1과 100 사이의 숫자로 평가하여 JSON 형식으로만 응답해주면 됨
          응답 json 형식:
          {
            "document_similarity": [
              {"title": string, "content": string, "similarity_score": number}
            ]
          }`,
        },
      ],
      temperature: 0.5,
    });

    // 응답 파싱 전에 로그 확인
    console.log('GPT Response:', completion.choices[0].message.content);

    // GPT 응답 파싱
    const response = JSON.parse(
      completion.choices[0].message.content ?? '{"results": []}'
    );
    console.log('response : ', response);

    // 유사도 결과를 기반으로 문서 정렬
    const sortedDocuments = (response.document_similarity || [])
      .filter(
        (result: { similarity_score: number }) => result.similarity_score >= 0.1
      )
      .map(
        (result: {
          title: string;
          content: string;
          similarity_score: number;
        }) => {
          const doc = documents.find((d) => d.title === result.title);
          return doc
            ? {
                ...doc,
                similarity: result.similarity_score, // similarity_score를 similarity로 매핑
              }
            : null;
        }
      )
      .filter(Boolean)
      .sort(
        (
          a: Document & { similarity: number },
          b: Document & { similarity: number }
        ) => b.similarity - a.similarity
      );

    console.log('sortedDocuments : ', sortedDocuments);
    return sortedDocuments;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    const results = await searchDocuments(query);
    console.log('results : ', results);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
