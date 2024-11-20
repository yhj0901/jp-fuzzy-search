// src/index.js
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const path = require('path');

let kuroshiro;

function convertLongVowelsToRepeating(romaji) {
  return romaji
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ii')
    .replace(/ū/g, 'uu')
    .replace(/ē/g, 'ee')
    .replace(/ō/g, 'oo');
}

async function initializeKuroshiro() {
  if (!kuroshiro) {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(
      new KuromojiAnalyzer({
        // Lambda 환경에서는 /var/task가 소스 코드의 루트 디렉토리입니다
        dictPath: path.join('/var/task', 'dict'),
      })
    );
  }
}

exports.handler = async (event) => {
  try {
    // event.body가 문자열인 경우에만 JSON.parse 실행
    const data = typeof event === 'string' ? JSON.parse(event) : event;
    const text = data.text;

    // 디버깅
    console.log('Received event:', JSON.stringify(event));
    console.log('Parsed text:', text);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    // 디버깅을 위한 로그 추가
    console.log('Received text:', text);

    await initializeKuroshiro();
    const romaji = await kuroshiro.convert(text, { to: 'romaji' });
    const modifiedRomaji = convertLongVowelsToRepeating(romaji);

    return {
      statusCode: 200,
      body: JSON.stringify({ modifiedRomaji }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error details:', error);
    console.error('Event received:', JSON.stringify(event)); // 디버깅용 로그 추가
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to convert text',
        details: error.message,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};
