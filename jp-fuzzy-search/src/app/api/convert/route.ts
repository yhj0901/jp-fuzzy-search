import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import path from 'path';

let kuroshiro: Kuroshiro | undefined;

// 장음 변환 함수
function convertLongVowelsToRepeating(romaji: string) {
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
    await kuroshiro.init(
      new KuromojiAnalyzer({
        dictPath: path.join(process.cwd(), 'public', 'dict'),
      })
    );
  }
}

// API 핸들러
export async function POST(req: Request) {
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

    let modifiedRomaji = '';

    // Kuroshiro 초기화
    await initializeKuroshiro();
    if (kuroshiro) {
      // 텍스트를 로마자로 변환
      const romaji = await kuroshiro.convert(text, { to: 'romaji' });
      modifiedRomaji = convertLongVowelsToRepeating(romaji);
      console.log('modifiedRomaji : ', modifiedRomaji);
    } else {
      throw new Error('Kuroshiro is not initialized');
    }
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
