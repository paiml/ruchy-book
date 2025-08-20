/**
 * Unit tests for REPL integration
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { 
  ReplHighlighter, 
  highlightForRepl,
  ANSI,
  AnsiColors 
} from '../../src/repl/index.ts';

Deno.test('ReplHighlighter: creates instance with defaults', () => {
  const highlighter = new ReplHighlighter();
  assertExists(highlighter);
});

Deno.test('ReplHighlighter: highlights code with ANSI colors', () => {
  const highlighter = new ReplHighlighter();
  const code = 'fn main() { println("Hello"); }';
  const result = highlighter.highlight(code);
  
  // Should contain ANSI escape codes
  assertEquals(result.includes('\x1b['), true);
  assertEquals(result.includes(ANSI.RESET), true);
  
  // Should contain original code
  assertEquals(result.includes('fn'), true);
  assertEquals(result.includes('main'), true);
  assertEquals(result.includes('Hello'), true);
});

Deno.test('ReplHighlighter: applies theme colors', () => {
  const highlighter = new ReplHighlighter({ theme: 'monokai' });
  const code = 'let x = 42;';
  const result = highlighter.highlight(code);
  
  // Should have ANSI colors
  assertEquals(result.includes('\x1b[38;2;'), true); // RGB color
});

Deno.test('ReplHighlighter: handles line numbers', () => {
  const highlighter = new ReplHighlighter();
  const code = 'fn test() {\n  return 42;\n}';
  const result = highlighter.highlight(code, { showLineNumbers: true });
  
  // Should have line numbers
  assertEquals(result.includes('1'), true);
  assertEquals(result.includes('2'), true);
  assertEquals(result.includes('3'), true);
  assertEquals(result.includes('│'), true); // Line separator
});

Deno.test('ReplHighlighter: falls back to basic colors', () => {
  const highlighter = new ReplHighlighter({ use256Colors: false });
  const code = 'let x = "test";';
  const result = highlighter.highlight(code);
  
  // Should use basic ANSI colors
  assertEquals(result.includes('\x1b[3'), true); // Basic color codes
});

Deno.test('ReplHighlighter: creates colored prompt', () => {
  const highlighter = new ReplHighlighter();
  const prompt = highlighter.createPrompt();
  
  // Should have colored prompt
  assertEquals(prompt.includes('ruchy>'), true);
  assertEquals(prompt.includes('\x1b['), true);
  assertEquals(prompt.includes(ANSI.BOLD), true);
  assertEquals(prompt.includes(ANSI.RESET), true);
});

Deno.test('ReplHighlighter: creates custom prompt', () => {
  const highlighter = new ReplHighlighter();
  const prompt = highlighter.createPrompt('>>> ');
  
  assertEquals(prompt.includes('>>> '), true);
  assertEquals(prompt.includes('\x1b['), true);
});

Deno.test('ReplHighlighter: formats errors', () => {
  const highlighter = new ReplHighlighter();
  const error = highlighter.formatError('Undefined variable', 10, 15);
  
  assertEquals(error.includes('Error:'), true);
  assertEquals(error.includes('Undefined variable'), true);
  assertEquals(error.includes('line 10'), true);
  assertEquals(error.includes('column 15'), true);
  assertEquals(error.includes('\x1b['), true);
});

Deno.test('ReplHighlighter: formats warnings', () => {
  const highlighter = new ReplHighlighter();
  const warning = highlighter.formatWarning('Unused variable', 5, 8);
  
  assertEquals(warning.includes('Warning:'), true);
  assertEquals(warning.includes('Unused variable'), true);
  assertEquals(warning.includes('line 5'), true);
  assertEquals(warning.includes('column 8'), true);
});

Deno.test('ReplHighlighter: formats success messages', () => {
  const highlighter = new ReplHighlighter();
  const success = highlighter.formatSuccess('Build completed');
  
  assertEquals(success.includes('✓'), true);
  assertEquals(success.includes('Build completed'), true);
  assertEquals(success.includes('\x1b['), true);
});

Deno.test('ReplHighlighter: changes theme', () => {
  const highlighter = new ReplHighlighter();
  
  highlighter.setTheme('ruchy-light');
  const theme = highlighter.getTheme();
  
  assertEquals(theme.name, 'ruchy-light');
  assertEquals(theme.type, 'light');
});

Deno.test('ReplHighlighter: gets available themes', () => {
  const highlighter = new ReplHighlighter();
  const themes = highlighter.getAvailableThemes();
  
  assertEquals(themes.includes('ruchy-dark'), true);
  assertEquals(themes.includes('ruchy-light'), true);
  assertEquals(themes.includes('monokai'), true);
  assertEquals(themes.length >= 5, true);
});

Deno.test('ReplHighlighter: handles keywords with styles', () => {
  const highlighter = new ReplHighlighter();
  const code = 'async fn test() { await call(); }';
  const result = highlighter.highlight(code);
  
  // Keywords should be bold
  assertEquals(result.includes(ANSI.BOLD), true);
});

Deno.test('ReplHighlighter: handles comments with italic', () => {
  const highlighter = new ReplHighlighter();
  const code = '// This is a comment';
  const result = highlighter.highlight(code);
  
  // Comments should be italic
  assertEquals(result.includes(ANSI.ITALIC), true);
});

Deno.test('ReplHighlighter: quick highlight function works', () => {
  const result = highlightForRepl('fn test() { return 42; }');
  
  assertEquals(result.includes('\x1b['), true);
  assertEquals(result.includes('fn'), true);
  assertEquals(result.includes('test'), true);
});

Deno.test('ReplHighlighter: ANSI utilities available', () => {
  assertEquals(typeof ANSI.RESET, 'string');
  assertEquals(typeof ANSI.BOLD, 'string');
  assertEquals(typeof ANSI.RED, 'string');
  assertEquals(typeof ANSI.fg256, 'function');
  assertEquals(typeof ANSI.rgbFg, 'function');
  
  // Test functions
  const color256 = ANSI.fg256(196);
  assertEquals(color256, '\x1b[38;5;196m');
  
  const colorRgb = ANSI.rgbFg(255, 0, 0);
  assertEquals(colorRgb, '\x1b[38;2;255;0;0m');
});

Deno.test('ReplHighlighter: static utilities work', () => {
  const clearScreen = ReplHighlighter.clearScreen();
  assertEquals(clearScreen, '\x1b[2J\x1b[H');
  
  const moveCursor = ReplHighlighter.moveCursor(10, 5);
  assertEquals(moveCursor, '\x1b[5;10H');
});

Deno.test('ReplHighlighter: handles empty input', () => {
  const highlighter = new ReplHighlighter();
  const result = highlighter.highlight('');
  
  assertEquals(result, '');
});

Deno.test('ReplHighlighter: handles multiline code', () => {
  const highlighter = new ReplHighlighter();
  const code = `fn calculate(x: i32, y: i32) -> i32 {
    let sum = x + y;
    let product = x * y;
    return sum + product;
}`;
  
  const result = highlighter.highlight(code);
  
  // Should preserve structure
  assertEquals(result.includes('\n'), true);
  assertEquals(result.split('\n').length, 5);
  
  // Should highlight all parts
  assertEquals(result.includes('fn'), true);
  assertEquals(result.includes('calculate'), true);
  assertEquals(result.includes('return'), true);
});

Deno.test('AnsiColors export works', () => {
  assertEquals(AnsiColors, ANSI);
  assertEquals(AnsiColors.RED, '\x1b[31m');
  assertEquals(typeof AnsiColors.rgbFg, 'function');
});