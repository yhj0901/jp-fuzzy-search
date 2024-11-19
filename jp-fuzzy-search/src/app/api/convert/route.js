import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiro;

// 장음 변환 함수
function convertLongVowelsToRepeating(romaji) {
  return romaji
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ii')
    .replace(/ū/g, 'uu')
    .replace(/ē/g, 'ee')
    .replace(/ō/g, 'oo');
}

// Kuroshiro 초기화 함수 (서버에서 한 번만 실행)
async function initializeKuroshiro() {
  if (!kuroshiro) {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'public/dict/' }));
  }
}

// API 핸들러
export async function POST(req) {
  try {
    // 요청 본문에서 텍스트 추출
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kuroshiro 초기화
    await initializeKuroshiro();

    // 텍스트를 로마자로 변환
    const romaji = await kuroshiro.convert(text, { to: 'romaji' });
    const modifiedRomaji = convertLongVowelsToRepeating(romaji);
    console.log('modifiedRomaji : ', modifiedRomaji);

    // 성공 응답
    return new Response(JSON.stringify({ modifiedRomaji }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to convert text' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
