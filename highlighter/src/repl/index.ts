/**
 * REPL integration for Ruchy syntax highlighter
 * Provides ANSI color output for terminal/REPL environments
 */

import { Lexer } from '../tokenizer/lexer.ts';
import { TokenType } from '../tokenizer/tokens.ts';
import type { Token } from '../tokenizer/tokens.ts';
import { ThemeManager } from '../highlighter/themes.ts';
import type { Theme } from '../highlighter/themes.ts';

/**
 * ANSI color codes for terminal output
 */
export const ANSI = {
  // Reset
  RESET: '\x1b[0m',

  // Styles
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',

  // Foreground colors
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',

  // Bright foreground colors
  BRIGHT_BLACK: '\x1b[90m',
  BRIGHT_RED: '\x1b[91m',
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_YELLOW: '\x1b[93m',
  BRIGHT_BLUE: '\x1b[94m',
  BRIGHT_MAGENTA: '\x1b[95m',
  BRIGHT_CYAN: '\x1b[96m',
  BRIGHT_WHITE: '\x1b[97m',

  // Background colors
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',

  // 256 color support
  fg256: (n: number) => `\x1b[38;5;${n}m`,
  bg256: (n: number) => `\x1b[48;5;${n}m`,

  // RGB color support (24-bit)
  rgbFg: (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`,
  rgbBg: (r: number, g: number, b: number) => `\x1b[48;2;${r};${g};${b}m`,
} as const;

/**
 * Map hex colors to ANSI codes
 */
function hexToAnsi(hex: string, use256Colors: boolean = true): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if (use256Colors) {
    // Use 24-bit color if available
    return ANSI.rgbFg(r, g, b);
  }

  // Fallback to basic colors
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness > 200) {
    return r > g && r > b
      ? ANSI.BRIGHT_RED
      : g > r && g > b
      ? ANSI.BRIGHT_GREEN
      : b > r && b > g
      ? ANSI.BRIGHT_BLUE
      : ANSI.BRIGHT_WHITE;
  } else if (brightness > 128) {
    return r > g && r > b
      ? ANSI.RED
      : g > r && g > b
      ? ANSI.GREEN
      : b > r && b > g
      ? ANSI.BLUE
      : ANSI.WHITE;
  } else if (brightness > 64) {
    return r > g && r > b
      ? ANSI.MAGENTA
      : g > r && g > b
      ? ANSI.YELLOW
      : b > r && b > g
      ? ANSI.CYAN
      : ANSI.BRIGHT_BLACK;
  } else {
    return ANSI.BLACK;
  }
}

/**
 * REPL highlighter options
 */
export interface ReplHighlightOptions {
  theme?: string | Theme;
  use256Colors?: boolean;
  showLineNumbers?: boolean;
  tabSize?: number;
}

/**
 * REPL syntax highlighter
 */
export class ReplHighlighter {
  private themeManager: ThemeManager;
  private theme: Theme;
  private use256Colors: boolean;

  constructor(options: ReplHighlightOptions = {}) {
    this.themeManager = new ThemeManager();
    this.theme = this.themeManager.getTheme(options.theme || 'ruchy-dark');
    this.use256Colors = options.use256Colors ?? true;
  }

  /**
   * Highlight code for REPL output
   */
  highlight(code: string, options: ReplHighlightOptions = {}): string {
    if (!code) return '';
    
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();

    // Build highlighted output
    let result = '';
    let lastEnd = 0;

    for (const token of tokens) {
      if (token.type === TokenType.EOF) continue;
      
      // Add any text between tokens
      if (token.start > lastEnd) {
        result += code.slice(lastEnd, token.start);
      }

      // Add highlighted token
      const color = this.getTokenColor(token);
      const style = this.getTokenStyle(token);

      if (color || style) {
        result += style + color + token.value + ANSI.RESET;
      } else {
        result += token.value;
      }
      lastEnd = token.end;
    }

    // Add any remaining text
    if (lastEnd < code.length) {
      result += code.slice(lastEnd);
    }

    // Add line numbers if requested
    if (options.showLineNumbers) {
      result = this.addLineNumbers(result);
    }

    return result;
  }

  /**
   * Get ANSI color for token type
   */
  private getTokenColor(token: Token): string {
    const colors = this.theme.colors;

    // Map token types to theme colors
    if (token.type.startsWith('keyword')) {
      return hexToAnsi(colors.keyword, this.use256Colors);
    } else if (token.type.startsWith('string')) {
      return hexToAnsi(colors.string, this.use256Colors);
    } else if (token.type.startsWith('number')) {
      return hexToAnsi(colors.number, this.use256Colors);
    } else if (token.type.startsWith('comment')) {
      return hexToAnsi(colors.comment, this.use256Colors);
    } else if (token.type === TokenType.IDENTIFIER) {
      // Check if it looks like a function
      return hexToAnsi(colors.variable, this.use256Colors);
    } else if (token.type.startsWith('keyword.operator')) {
      return hexToAnsi(colors.operator, this.use256Colors);
    } else if (token.type.startsWith('punctuation')) {
      return hexToAnsi(colors.punctuation || colors.foreground, this.use256Colors);
    } else if (token.type === TokenType.TYPE_NAME) {
      return hexToAnsi(colors.type, this.use256Colors);
    }

    return '';
  }

  /**
   * Get ANSI style for token type
   */
  private getTokenStyle(token: Token): string {
    let style = '';

    // Add styles based on token type
    if (token.type.startsWith('keyword')) {
      style += ANSI.BOLD;
    } else if (token.type.startsWith('comment')) {
      style += ANSI.ITALIC;
    } else if (token.type === TokenType.STRING_TEMPLATE) {
      style += ANSI.ITALIC;
    }

    return style;
  }

  /**
   * Add line numbers to output
   */
  private addLineNumbers(text: string): string {
    const lines = text.split('\n');
    const maxLineNum = lines.length;
    const padding = maxLineNum.toString().length;

    return lines.map((line, i) => {
      const lineNum = (i + 1).toString().padStart(padding, ' ');
      const lineNumColor = hexToAnsi(
        this.theme.colors.lineNumber || '#858585',
        this.use256Colors,
      );
      return `${lineNumColor}${lineNum}${ANSI.RESET} │ ${line}`;
    }).join('\n');
  }

  /**
   * Set theme
   */
  setTheme(theme: string | Theme): void {
    this.theme = this.themeManager.getTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.theme;
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): string[] {
    return this.themeManager.getThemeNames();
  }

  /**
   * Create a prompt with syntax highlighting
   */
  createPrompt(prompt: string = 'ruchy> '): string {
    const promptColor = hexToAnsi(this.theme.colors.info || '#75beff', this.use256Colors);
    return `${promptColor}${ANSI.BOLD}${prompt}${ANSI.RESET}`;
  }

  /**
   * Format error output
   */
  formatError(error: string, line?: number, column?: number): string {
    const errorColor = hexToAnsi(this.theme.colors.error, this.use256Colors);
    let result = `${errorColor}${ANSI.BOLD}Error:${ANSI.RESET} ${error}`;

    if (line !== undefined && column !== undefined) {
      const locationColor = hexToAnsi(
        this.theme.colors.lineNumber || '#858585',
        this.use256Colors,
      );
      result += `\n${locationColor}  at line ${line}, column ${column}${ANSI.RESET}`;
    }

    return result;
  }

  /**
   * Format warning output
   */
  formatWarning(warning: string, line?: number, column?: number): string {
    const warningColor = hexToAnsi(
      this.theme.colors.warning || '#cca700',
      this.use256Colors,
    );
    let result = `${warningColor}${ANSI.BOLD}Warning:${ANSI.RESET} ${warning}`;

    if (line !== undefined && column !== undefined) {
      const locationColor = hexToAnsi(
        this.theme.colors.lineNumber || '#858585',
        this.use256Colors,
      );
      result += `\n${locationColor}  at line ${line}, column ${column}${ANSI.RESET}`;
    }

    return result;
  }

  /**
   * Format success output
   */
  formatSuccess(message: string): string {
    const successColor = hexToAnsi(
      this.theme.colors.success || '#89d185',
      this.use256Colors,
    );
    return `${successColor}${ANSI.BOLD}✓${ANSI.RESET} ${message}`;
  }

  /**
   * Clear screen
   */
  static clearScreen(): string {
    return '\x1b[2J\x1b[H';
  }

  /**
   * Move cursor
   */
  static moveCursor(x: number, y: number): string {
    return `\x1b[${y};${x}H`;
  }
}

/**
 * Quick REPL highlight function
 */
export function highlightForRepl(
  code: string,
  theme: string = 'ruchy-dark',
  use256Colors: boolean = true,
): string {
  const highlighter = new ReplHighlighter({ theme, use256Colors });
  return highlighter.highlight(code);
}

// Export ANSI utilities
export { ANSI as AnsiColors };
