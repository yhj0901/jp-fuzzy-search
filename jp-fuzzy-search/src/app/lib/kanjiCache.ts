import { translateKanjiToHiragana } from './api';

const kanjiCache: Record<string, string> = {};

export async function getHiraganaWithCache(kanji: string): Promise<string> {
  if (kanjiCache[kanji]) {
    return kanjiCache[kanji];
  }
  const hiragana = await translateKanjiToHiragana();
  kanjiCache[kanji] = hiragana; // 캐싱
  return hiragana;
}
