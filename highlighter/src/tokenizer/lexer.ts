/**
 * Lexer implementation for Ruchy syntax highlighter
 * High-performance tokenization with <50ms for 10K lines
 */

import { KEYWORDS, OPERATORS, Token, TokenType } from './tokens.ts';

export interface LexerOptions {
  includeWhitespace?: boolean;
  includeComments?: boolean;
  throwOnError?: boolean;
}

export class Lexer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;
  private tokens: Token[];
  private options: LexerOptions;

  constructor(input: string, options: LexerOptions = {}) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.options = {
      includeWhitespace: false,
      includeComments: true,
      throwOnError: false,
      ...options,
    };
  }

  tokenize(): Token[] {
    this.tokens = [];
    this.position = 0;
    this.line = 1;
    this.column = 1;

    while (!this.isAtEnd()) {
      this.scanToken();
    }

    this.addToken(TokenType.EOF, '', this.position, this.position);
    return this.tokens;
  }

  private scanToken(): void {
    const start = this.position;

    const char = this.advance();

    // Whitespace
    if (this.isWhitespace(char)) {
      if (char === '\n') {
        if (this.options.includeWhitespace) {
          this.addToken(TokenType.NEWLINE, char, start, this.position);
        }
        this.line++;
        this.column = 1;
      } else {
        let next = this.peek();
        while (next && this.isWhitespace(next) && next !== '\n') {
          this.advance();
          next = this.peek();
        }
        if (this.options.includeWhitespace) {
          this.addToken(
            TokenType.WHITESPACE,
            this.input.slice(start, this.position),
            start,
            this.position,
          );
        }
      }
      return;
    }

    // Comments
    if (char === '/') {
      if (this.peek() === '/') {
        this.advance();
        this.scanLineComment(start);
        return;
      } else if (this.peek() === '*') {
        this.advance();
        this.scanBlockComment(start);
        return;
      }
    }

    // Strings
    if (char === '"' || char === "'") {
      this.scanString(char, start);
      return;
    }

    // Template strings
    if (char === 'f' && (this.peek() === '"' || this.peek() === "'")) {
      const quote = this.advance(); // Get and consume the quote
      this.scanTemplateString(quote, start);
      return;
    }

    // Raw strings
    if (char === 'r' && (this.peek() === '"' || this.peek() === "'")) {
      const quote = this.advance(); // Get and consume the quote
      this.scanRawString(quote, start);
      return;
    }

    // Numbers
    if (this.isDigit(char)) {
      this.scanNumber(start);
      return;
    }

    // Identifiers and keywords
    if (this.isAlpha(char) || char === '_') {
      this.scanIdentifier(start);
      return;
    }

    // Operators and punctuation
    this.scanOperatorOrPunctuation(char, start);
  }

  private scanLineComment(start: number): void {
    // Check if it's a doc comment
    const isDoc = this.peek() === '/';

    while (this.peek() !== '\n' && !this.isAtEnd()) {
      this.advance();
    }

    if (this.options.includeComments) {
      this.addToken(
        isDoc ? TokenType.COMMENT_DOC : TokenType.COMMENT_LINE,
        this.input.slice(start, this.position),
        start,
        this.position,
      );
    }
  }

  private scanBlockComment(start: number): void {
    // Check if it's a doc comment
    const isDoc = this.peek() === '*' && this.peekNext() !== '/';

    let depth = 1;
    while (depth > 0 && !this.isAtEnd()) {
      if (this.peek() === '/' && this.peekNext() === '*') {
        depth++;
        this.advance();
        this.advance();
      } else if (this.peek() === '*' && this.peekNext() === '/') {
        depth--;
        this.advance();
        this.advance();
      } else {
        if (this.peek() === '\n') {
          this.line++;
          this.column = 0;
        }
        this.advance();
      }
    }

    if (this.options.includeComments) {
      this.addToken(
        isDoc ? TokenType.COMMENT_DOC : TokenType.COMMENT_BLOCK,
        this.input.slice(start, this.position),
        start,
        this.position,
      );
    }
  }

  private scanString(quote: string, start: number): void {
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\\') {
        this.advance(); // Skip escape character
        if (!this.isAtEnd()) this.advance(); // Skip escaped character
      } else {
        if (this.peek() === '\n') {
          this.line++;
          this.column = 0;
        }
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.error('Unterminated string', start);
      return;
    }

    this.advance(); // Closing quote

    this.addToken(
      quote === '"' ? TokenType.STRING : TokenType.STRING_SINGLE,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanTemplateString(quote: string, start: number): void {

    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\\') {
        this.advance();
        if (!this.isAtEnd()) this.advance();
      } else if (this.peek() === '{') {
        // Handle interpolation - for now just skip to closing brace
        // In a full implementation, we'd recursively tokenize the expression
        this.advance();
        let braceDepth = 1;
        while (braceDepth > 0 && !this.isAtEnd()) {
          if (this.peek() === '{') braceDepth++;
          else if (this.peek() === '}') braceDepth--;
          this.advance();
        }
      } else {
        if (this.peek() === '\n') {
          this.line++;
          this.column = 0;
        }
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.error('Unterminated template string', start);
      return;
    }

    this.advance(); // Closing quote

    this.addToken(
      TokenType.STRING_TEMPLATE,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanRawString(quote: string, start: number): void {

    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 0;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      this.error('Unterminated raw string', start);
      return;
    }

    this.advance(); // Closing quote

    this.addToken(
      TokenType.STRING_RAW,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanNumber(start: number): void {
    // Check for hex, binary, octal
    if (this.input[start] === '0') {
      const next = this.peek();
      if (next === 'x' || next === 'X') {
        this.advance();
        this.scanHexNumber(start);
        return;
      } else if (next === 'b' || next === 'B') {
        this.advance();
        this.scanBinaryNumber(start);
        return;
      } else if (next === 'o' || next === 'O') {
        this.advance();
        this.scanOctalNumber(start);
        return;
      }
    }

    // Scan integer part
    let current = this.peek();
    while (current && this.isDigit(current)) {
      this.advance();
      current = this.peek();
    }

    // Check for decimal part
    let isFloat = false;
    const nextChar = this.peek();
    const nextNextChar = this.peekNext();
    if (nextChar === '.' && nextNextChar && this.isDigit(nextNextChar)) {
      isFloat = true;
      this.advance(); // Consume '.'
      let digit = this.peek();
      while (digit && this.isDigit(digit)) {
        this.advance();
        digit = this.peek();
      }
    }

    // Check for exponent
    const exp = this.peek();
    if (exp === 'e' || exp === 'E') {
      isFloat = true;
      this.advance();
      const sign = this.peek();
      if (sign === '+' || sign === '-') {
        this.advance();
      }
      let expDigit = this.peek();
      while (expDigit && this.isDigit(expDigit)) {
        this.advance();
        expDigit = this.peek();
      }
    }

    this.addToken(
      isFloat ? TokenType.NUMBER_FLOAT : TokenType.NUMBER_INTEGER,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanHexNumber(start: number): void {
    let hex = this.peek();
    while (hex && this.isHexDigit(hex)) {
      this.advance();
      hex = this.peek();
    }
    this.addToken(
      TokenType.NUMBER_HEX,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanBinaryNumber(start: number): void {
    while (this.peek() === '0' || this.peek() === '1') {
      this.advance();
    }
    this.addToken(
      TokenType.NUMBER_BINARY,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanOctalNumber(start: number): void {
    while (this.isOctalDigit(this.peek())) {
      this.advance();
    }
    this.addToken(
      TokenType.NUMBER_OCTAL,
      this.input.slice(start, this.position),
      start,
      this.position,
    );
  }

  private scanIdentifier(start: number): void {
    while (this.isAlphaNumeric(this.peek()) || this.peek() === '_') {
      this.advance();
    }

    const text = this.input.slice(start, this.position);
    const type = KEYWORDS.get(text) || TokenType.IDENTIFIER;

    this.addToken(type, text, start, this.position);
  }

  private scanOperatorOrPunctuation(char: string, start: number): void {
    // Try to match multi-character operators first
    const twoChar = char + this.peek();
    const threeChar = twoChar + this.peekNext();

    // Check three-character operators
    if (OPERATORS.has(threeChar)) {
      this.advance();
      this.advance();
      this.addToken(OPERATORS.get(threeChar)!, threeChar, start, this.position);
      return;
    }

    // Check two-character operators
    if (OPERATORS.has(twoChar)) {
      this.advance();
      this.addToken(OPERATORS.get(twoChar)!, twoChar, start, this.position);
      return;
    }

    // Check single-character operators
    if (OPERATORS.has(char)) {
      this.addToken(OPERATORS.get(char)!, char, start, this.position);
      return;
    }

    // Punctuation
    switch (char) {
      case '(':
        this.addToken(TokenType.PUNCTUATION_PAREN_OPEN, char, start, this.position);
        break;
      case ')':
        this.addToken(TokenType.PUNCTUATION_PAREN_CLOSE, char, start, this.position);
        break;
      case '[':
        this.addToken(TokenType.PUNCTUATION_BRACKET_OPEN, char, start, this.position);
        break;
      case ']':
        this.addToken(TokenType.PUNCTUATION_BRACKET_CLOSE, char, start, this.position);
        break;
      case '{':
        this.addToken(TokenType.PUNCTUATION_BRACE_OPEN, char, start, this.position);
        break;
      case '}':
        this.addToken(TokenType.PUNCTUATION_BRACE_CLOSE, char, start, this.position);
        break;
      case ';':
        this.addToken(TokenType.PUNCTUATION_SEMICOLON, char, start, this.position);
        break;
      case ',':
        this.addToken(TokenType.PUNCTUATION_COMMA, char, start, this.position);
        break;
      case '.':
        this.addToken(TokenType.PUNCTUATION_DOT, char, start, this.position);
        break;
      case ':':
        if (this.peek() === ':') {
          this.advance();
          this.addToken(TokenType.PUNCTUATION_DOUBLE_COLON, '::', start, this.position);
        } else {
          this.addToken(TokenType.PUNCTUATION_COLON, char, start, this.position);
        }
        break;
      default:
        this.error(`Unexpected character: ${char}`, start);
    }
  }

  private addToken(
    type: TokenType,
    value: string,
    start: number,
    end: number,
  ): void {
    this.tokens.push({
      type,
      value,
      start,
      end,
      line: this.line,
      column: this.column - (end - start),
    });
  }

  private advance(): string {
    const char = this.input[this.position];
    this.position++;
    this.column++;
    return char!;
  }

  private peek(): string | undefined {
    return this.input[this.position];
  }

  private peekNext(): string | undefined {
    return this.input[this.position + 1];
  }

  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }

  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\r' || char === '\n';
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isHexDigit(char: string | undefined): boolean {
    if (!char) return false;
    return (
      (char >= '0' && char <= '9') ||
      (char >= 'a' && char <= 'f') ||
      (char >= 'A' && char <= 'F')
    );
  }

  private isOctalDigit(char: string | undefined): boolean {
    if (!char) return false;
    return char >= '0' && char <= '7';
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z')
    );
  }

  private isAlphaNumeric(char: string | undefined): boolean {
    if (!char) return false;
    return this.isAlpha(char) || this.isDigit(char);
  }

  private error(message: string, position: number): void {
    const error = new Error(
      `Lexer error at line ${this.line}, column ${this.column}: ${message}`,
    );

    if (this.options.throwOnError) {
      throw error;
    } else {
      // Add error token
      this.addToken(TokenType.ERROR, this.input[position] || '', position, position + 1);
    }
  }
}
