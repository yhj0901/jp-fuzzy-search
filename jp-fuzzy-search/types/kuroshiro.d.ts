declare module 'kuroshiro' {
  export interface ConvertOptions {
    to?: 'hiragana' | 'katakana' | 'romaji';
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    romajiSystem?: 'hepburn' | 'passport' | 'kunrei';
  }

  export default class Kuroshiro {
    init(analyzer: AnalyzerType): Promise<void>;
    convert(text: string, options?: ConvertOptions): Promise<string>;
    isInitialized(): boolean;
  }
}
