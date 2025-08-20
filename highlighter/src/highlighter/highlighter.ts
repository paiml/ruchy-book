/**
 * Main highlighter implementation for Ruchy
 * Converts tokens to styled HTML or ANSI output
 */

import { Token, TokenType } from '../tokenizer/tokens.ts';
import { Lexer } from '../tokenizer/lexer.ts';
import { Theme, ThemeManager } from './themes.ts';
import { escapeHTML } from '../utils/escape.ts';

export interface HighlightOptions {
  theme?: string | Theme;
  language?: string;
  lineNumbers?: boolean;
  wrapLines?: boolean;
  semantic?: boolean;
  tabSize?: number;
}

export interface HighlightResult {
  html: string;
  tokens: Token[];
  stats: {
    parseTime: number;
    tokenCount: number;
    lineCount: number;
    cacheHits?: number;
  };
}

export interface HighlightLine {
  number: number;
  content: string;
  tokens: Token[];
}

export class RuchySyntaxHighlighter {
  private themeManager: ThemeManager;
  private currentTheme: Theme;
  private cache: Map<string, HighlightResult>;
  private maxCacheSize: number;

  constructor(options?: { theme?: string | Theme; maxCacheSize?: number }) {
    this.themeManager = new ThemeManager();
    this.currentTheme = this.themeManager.getTheme(options?.theme || 'ruchy-dark');
    this.cache = new Map();
    this.maxCacheSize = options?.maxCacheSize || 100;
  }

  /**
   * Highlight code and return styled HTML
   */
  highlight(code: string, options: HighlightOptions = {}): HighlightResult {
    const startTime = performance.now();
    
    // Handle empty input
    if (!code) {
      return {
        html: '',
        tokens: [],
        stats: {
          parseTime: performance.now() - startTime,
          tokenCount: 0,
          lineCount: 0,
          cacheHits: 0,
        },
      };
    }

    // Check cache
    const cacheKey = this.getCacheKey(code, options);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        stats: {
          ...cached.stats,
          cacheHits: (cached.stats.cacheHits || 0) + 1,
        },
      };
    }

    // Tokenize
    const lexer = new Lexer(code, {
      includeWhitespace: true,
      includeComments: true,
      throwOnError: false,
    });
    const tokens = lexer.tokenize();

    // Apply theme
    const theme = options.theme ? this.themeManager.getTheme(options.theme) : this.currentTheme;

    // Generate HTML
    const html = options.lineNumbers
      ? this.generateHTMLWithLineNumbers(tokens, theme, options)
      : this.generateHTML(tokens, theme, options);

    // Calculate stats
    const parseTime = performance.now() - startTime;
    const lineCount = code.split('\n').length;

    const result: HighlightResult = {
      html,
      tokens: tokens.filter((t) =>
        t.type !== TokenType.WHITESPACE &&
        t.type !== TokenType.NEWLINE &&
        t.type !== TokenType.EOF
      ),
      stats: {
        parseTime,
        tokenCount: tokens.length,
        lineCount,
        cacheHits: 0,
      },
    };

    // Update cache
    this.updateCache(cacheKey, result);

    return result;
  }

  /**
   * Highlight a single line (useful for REPL)
   */
  highlightLine(line: string, options: HighlightOptions = {}): string {
    const result = this.highlight(line, { ...options, lineNumbers: false });
    return result.html;
  }

  /**
   * Highlight code for terminal output (ANSI colors)
   */
  toANSI(code: string, options: HighlightOptions = {}): string {
    const lexer = new Lexer(code, {
      includeWhitespace: true,
      includeComments: true,
      throwOnError: false,
    });
    const tokens = lexer.tokenize();
    const theme = options.theme ? this.themeManager.getTheme(options.theme) : this.currentTheme;

    return this.generateANSI(tokens, theme);
  }

  /**
   * Set the current theme
   */
  setTheme(theme: string | Theme): void {
    this.currentTheme = typeof theme === 'string' ? this.themeManager.getTheme(theme) : theme;
    this.cache.clear(); // Clear cache when theme changes
  }

  /**
   * Register a custom theme
   */
  registerTheme(theme: Theme): void {
    this.themeManager.registerTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get list of available themes
   */
  getThemes(): string[] {
    return this.themeManager.getThemeNames();
  }

  private generateHTML(
    tokens: Token[],
    theme: Theme,
    _options: HighlightOptions,
  ): string {
    let html = '<pre class="ruchy-highlight"><code>';

    for (const token of tokens) {
      if (token.type === TokenType.EOF) break;

      const style = this.getTokenStyle(token, theme);
      const value = escapeHTML(token.value);

      if (token.type === TokenType.NEWLINE) {
        html += '\n';
      } else if (token.type === TokenType.WHITESPACE) {
        html += value;
      } else if (style) {
        html += `<span class="${this.getTokenClass(token)}" style="${style}">${value}</span>`;
      } else {
        html += value;
      }
    }

    html += '</code></pre>';
    return html;
  }

  private generateHTMLWithLineNumbers(
    tokens: Token[],
    theme: Theme,
    options: HighlightOptions,
  ): string {
    const lines = this.groupTokensByLine(tokens);
    let html = '<div class="ruchy-highlight-container">';
    html += '<div class="ruchy-line-numbers">';

    for (let i = 1; i <= lines.length; i++) {
      html += `<span class="line-number">${i}</span>\n`;
    }

    html += '</div>';
    html += '<pre class="ruchy-highlight"><code>';

    for (const line of lines) {
      if (options.wrapLines) {
        html += '<span class="line">';
      }

      for (const token of line.tokens) {
        if (token.type === TokenType.EOF) break;

        const style = this.getTokenStyle(token, theme);
        const value = escapeHTML(token.value);

        if (token.type === TokenType.NEWLINE) {
          // Skip newline as we handle it at line level
        } else if (token.type === TokenType.WHITESPACE) {
          html += value;
        } else if (style) {
          html += `<span class="${this.getTokenClass(token)}" style="${style}">${value}</span>`;
        } else {
          html += value;
        }
      }

      if (options.wrapLines) {
        html += '</span>';
      }
      html += '\n';
    }

    html += '</code></pre></div>';
    return html;
  }

  private generateANSI(tokens: Token[], theme: Theme): string {
    let output = '';
    const reset = '\x1b[0m';

    for (const token of tokens) {
      if (token.type === TokenType.EOF) break;

      const ansiCode = this.getANSICode(token, theme);

      if (token.type === TokenType.NEWLINE) {
        output += '\n';
      } else if (token.type === TokenType.WHITESPACE) {
        output += token.value;
      } else if (ansiCode) {
        output += `${ansiCode}${token.value}${reset}`;
      } else {
        output += token.value;
      }
    }

    return output;
  }

  private getTokenStyle(token: Token, theme: Theme): string | null {
    const color = this.getTokenColor(token, theme);
    if (!color) return null;

    let style = `color: ${color};`;

    // Add font styles if applicable
    const fontStyle = this.getTokenFontStyle(token, theme);
    if (fontStyle) {
      style += ` ${fontStyle}`;
    }

    return style;
  }

  private getTokenColor(token: Token, theme: Theme): string | null {
    const colors = theme.colors;

    // Map token types to theme colors
    switch (token.type) {
      // Keywords
      case TokenType.KEYWORD_IF:
      case TokenType.KEYWORD_ELSE:
      case TokenType.KEYWORD_FOR:
      case TokenType.KEYWORD_WHILE:
      case TokenType.KEYWORD_LOOP:
      case TokenType.KEYWORD_BREAK:
      case TokenType.KEYWORD_CONTINUE:
      case TokenType.KEYWORD_RETURN:
      case TokenType.KEYWORD_MATCH:
      case TokenType.KEYWORD_FN:
      case TokenType.KEYWORD_LET:
      case TokenType.KEYWORD_CONST:
      case TokenType.KEYWORD_VAR:
      case TokenType.KEYWORD_STRUCT:
      case TokenType.KEYWORD_ENUM:
      case TokenType.KEYWORD_TRAIT:
      case TokenType.KEYWORD_IMPL:
      case TokenType.KEYWORD_TYPE:
      case TokenType.KEYWORD_PUB:
      case TokenType.KEYWORD_PRIV:
      case TokenType.KEYWORD_MUT:
      case TokenType.KEYWORD_STATIC:
      case TokenType.KEYWORD_ASYNC:
      case TokenType.KEYWORD_AWAIT:
      case TokenType.KEYWORD_ACTOR:
      case TokenType.KEYWORD_SPAWN:
      case TokenType.KEYWORD_SEND:
      case TokenType.KEYWORD_RECEIVE:
      case TokenType.KEYWORD_USE:
      case TokenType.KEYWORD_MOD:
      case TokenType.KEYWORD_AS:
      case TokenType.KEYWORD_IN:
      case TokenType.KEYWORD_WHERE:
      case TokenType.KEYWORD_SELF:
      case TokenType.KEYWORD_SUPER:
      case TokenType.KEYWORD_CRATE:
      case TokenType.KEYWORD_UNSAFE:
        return colors.keyword;

      // Strings
      case TokenType.STRING:
      case TokenType.STRING_SINGLE:
      case TokenType.STRING_TEMPLATE:
      case TokenType.STRING_RAW:
        return colors.string;

      // Numbers
      case TokenType.NUMBER_INTEGER:
      case TokenType.NUMBER_FLOAT:
      case TokenType.NUMBER_HEX:
      case TokenType.NUMBER_BINARY:
      case TokenType.NUMBER_OCTAL:
        return colors.number;

      // Booleans and null
      case TokenType.BOOLEAN_TRUE:
      case TokenType.BOOLEAN_FALSE:
      case TokenType.NULL:
        return colors.constant || colors.keyword;

      // Comments
      case TokenType.COMMENT_LINE:
      case TokenType.COMMENT_BLOCK:
      case TokenType.COMMENT_DOC:
        return colors.comment;

      // Identifiers
      case TokenType.FUNCTION_NAME:
        return colors.function;
      case TokenType.TYPE_NAME:
        return colors.type;
      case TokenType.VARIABLE:
      case TokenType.PARAMETER:
      case TokenType.PROPERTY:
        return colors.variable;
      case TokenType.CONSTANT:
        return colors.constant || colors.variable;

      // Operators
      case TokenType.OPERATOR_ARITHMETIC:
      case TokenType.OPERATOR_COMPARISON:
      case TokenType.OPERATOR_LOGICAL:
      case TokenType.OPERATOR_ASSIGNMENT:
      case TokenType.OPERATOR_BITWISE:
      case TokenType.OPERATOR_RANGE:
      case TokenType.OPERATOR_ARROW:
        return colors.operator;

      // Punctuation
      case TokenType.PUNCTUATION_PAREN_OPEN:
      case TokenType.PUNCTUATION_PAREN_CLOSE:
      case TokenType.PUNCTUATION_BRACKET_OPEN:
      case TokenType.PUNCTUATION_BRACKET_CLOSE:
      case TokenType.PUNCTUATION_BRACE_OPEN:
      case TokenType.PUNCTUATION_BRACE_CLOSE:
      case TokenType.PUNCTUATION_SEMICOLON:
      case TokenType.PUNCTUATION_COMMA:
      case TokenType.PUNCTUATION_DOT:
      case TokenType.PUNCTUATION_COLON:
      case TokenType.PUNCTUATION_DOUBLE_COLON:
        return colors.punctuation || colors.foreground;

      // Error
      case TokenType.ERROR:
        return colors.error;

      default:
        return null;
    }
  }

  private getTokenFontStyle(token: Token, theme: Theme): string | null {
    if (!theme.fontStyles) return null;

    // Apply font styles based on token type
    switch (token.type) {
      case TokenType.KEYWORD_FN:
      case TokenType.KEYWORD_LET:
      case TokenType.KEYWORD_CONST:
      case TokenType.KEYWORD_VAR:
        return theme.fontStyles.bold ? 'font-weight: bold;' : null;

      case TokenType.COMMENT_LINE:
      case TokenType.COMMENT_BLOCK:
      case TokenType.COMMENT_DOC:
        return theme.fontStyles.italic ? 'font-style: italic;' : null;

      default:
        return null;
    }
  }

  private getTokenClass(token: Token): string {
    return token.type.replace(/\./g, '-');
  }

  private getANSICode(token: Token, theme: Theme): string | null {
    // Map theme colors to ANSI codes
    // This is a simplified mapping - a full implementation would
    // support 256 colors or true color
    const color = this.getTokenColor(token, theme);
    if (!color) return null;

    // Basic color mapping
    const colorMap: Record<string, string> = {
      '#ff0000': '\x1b[31m', // Red
      '#00ff00': '\x1b[32m', // Green
      '#ffff00': '\x1b[33m', // Yellow
      '#0000ff': '\x1b[34m', // Blue
      '#ff00ff': '\x1b[35m', // Magenta
      '#00ffff': '\x1b[36m', // Cyan
      '#ffffff': '\x1b[37m', // White
      '#808080': '\x1b[90m', // Bright black (gray)
    };

    // Find closest color
    for (const [hex, ansi] of Object.entries(colorMap)) {
      if (color.toLowerCase().includes(hex.slice(1))) {
        return ansi;
      }
    }

    return '\x1b[37m'; // Default to white
  }

  private groupTokensByLine(tokens: Token[]): HighlightLine[] {
    const lines: HighlightLine[] = [];
    let currentLine: Token[] = [];
    let lineNumber = 1;

    for (const token of tokens) {
      if (token.type === TokenType.NEWLINE) {
        lines.push({
          number: lineNumber,
          content: '',
          tokens: currentLine,
        });
        currentLine = [];
        lineNumber++;
      } else {
        currentLine.push(token);
      }
    }

    // Add last line if not empty
    if (currentLine.length > 0) {
      lines.push({
        number: lineNumber,
        content: '',
        tokens: currentLine,
      });
    }

    return lines;
  }

  private getCacheKey(code: string, options: HighlightOptions): string {
    const theme = options.theme || this.currentTheme.name;
    const flags = [
      options.lineNumbers ? 'ln' : '',
      options.wrapLines ? 'wrap' : '',
      options.semantic ? 'sem' : '',
    ].filter(Boolean).join('-');

    // Simple hash for code
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = ((hash << 5) - hash) + code.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }

    return `${theme}-${flags}-${hash}`;
  }

  private updateCache(key: string, result: HighlightResult): void {
    // Implement LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, result);
  }
}
