declare module 'kuromoji' {
  export interface Token {
    reading?: string;
    surface_form: string;
  }

  export interface Tokenizer {
    tokenize(text: string): Token[];
  }

  export interface Builder {
    build(callback: (err: Error | null, tokenizer: Tokenizer) => void): void;
  }

  export function builder(options: { dicPath: string }): Builder;
}
