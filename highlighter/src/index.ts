/**
 * Ruchy Syntax Highlighter
 * World-class syntax highlighting for the Ruchy programming language
 *
 * @module ruchy-highlighter
 * @version 1.0.0
 * @license MIT
 */

// Core exports - import first then export  
import { RuchySyntaxHighlighter } from './highlighter/highlighter.ts';
export { RuchySyntaxHighlighter };
export type { HighlightOptions, HighlightResult } from './highlighter/highlighter.ts';

// Tokenizer exports
export { Lexer } from './tokenizer/lexer.ts';
export type { LexerOptions } from './tokenizer/lexer.ts';
export { KEYWORDS, OPERATORS, TOKEN_CATEGORIES, TokenType } from './tokenizer/tokens.ts';
export type { Position, SemanticToken, Token, TokenRange } from './tokenizer/tokens.ts';

// Theme exports
export { ThemeManager } from './highlighter/themes.ts';
export type { ColorScheme, FontStyles, Theme } from './highlighter/themes.ts';

// Utility exports
export {
  escapeHTML,
  normalizeLineEndings,
  sanitizeInput,
  tabsToSpaces,
  unescapeHTML,
} from './utils/escape.ts';

// Version info
export const VERSION = '1.0.0';
export const SUPPORTED_LANGUAGES = ['ruchy'];

/**
 * Quick start function for simple usage
 */
export function highlight(code: string, theme: string = 'ruchy-dark'): string {
  const highlighter = new RuchySyntaxHighlighter({ theme });
  return highlighter.highlight(code).html;
}

/**
 * ANSI highlighting for terminal output
 */
export function highlightTerminal(code: string, theme: string = 'ruchy-dark'): string {
  const highlighter = new RuchySyntaxHighlighter({ theme });
  return highlighter.toANSI(code);
}

// Default export for convenience
export default RuchySyntaxHighlighter;