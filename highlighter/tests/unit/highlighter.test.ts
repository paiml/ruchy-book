/**
 * Unit tests for the Ruchy syntax highlighter
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { RuchySyntaxHighlighter } from '../../src/highlighter/highlighter.ts';

Deno.test('Highlighter: creates instance with default options', () => {
  const highlighter = new RuchySyntaxHighlighter();
  assertExists(highlighter);
});

Deno.test('Highlighter: highlights simple code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = 'fn main() { println("Hello"); }';
  const result = highlighter.highlight(code);
  
  assertExists(result.html);
  assertExists(result.tokens);
  assertExists(result.stats);
  
  // Check HTML contains expected elements
  assertEquals(result.html.includes('<span'), true);
  assertEquals(result.html.includes('class="'), true);
  assertEquals(result.html.includes('fn'), true);
  assertEquals(result.html.includes('main'), true);
});

Deno.test('Highlighter: applies theme correctly', () => {
  const highlighter = new RuchySyntaxHighlighter({ theme: 'monokai' });
  const code = 'let x = 42;';
  const result = highlighter.highlight(code);
  
  // Monokai uses specific colors
  assertEquals(result.html.includes('#f92672'), true); // keyword color
  assertEquals(result.html.includes('#ae81ff'), true); // number color
});

Deno.test('Highlighter: handles line numbers', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = 'fn test() {\n  return 42;\n}';
  const result = highlighter.highlight(code, { lineNumbers: true });
  
  // Check for line number elements
  assertEquals(result.html.includes('class="line-number"'), true);
  assertEquals(result.html.includes('>1<'), true);
  assertEquals(result.html.includes('>2<'), true);
  assertEquals(result.html.includes('>3<'), true);
  assertEquals(result.html.includes('ruchy-line-numbers'), true);
});

Deno.test('Highlighter: wraps output when requested', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = 'let x = 10;';
  const result = highlighter.highlight(code, { wrapLines: true });
  
  // Check for wrapper elements
  assertEquals(result.html.includes('<pre'), true);
  assertEquals(result.html.includes('<code'), true);
  assertEquals(result.html.includes('class="ruchy-highlight"'), true);
});

Deno.test('Highlighter: handles empty input', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const result = highlighter.highlight('');
  
  assertEquals(result.tokens.length, 0);
  assertEquals(result.html, '');
});

Deno.test('Highlighter: handles whitespace-only input', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const result = highlighter.highlight('   \n\t  \n  ');
  
  // Should wrap whitespace in standard HTML wrapper
  assertEquals(result.html.includes('<pre'), true);
  assertEquals(result.html.includes('<code'), true);
  assertEquals(result.tokens.length, 0); // No tokens for whitespace
});

Deno.test('Highlighter: escapes HTML in strings', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = '"<script>alert(1)</script>"';
  const result = highlighter.highlight(code);
  
  // Check that HTML is escaped
  assertEquals(result.html.includes('&lt;script&gt;'), true);
  assertEquals(result.html.includes('&lt;/script&gt;'), true);
  assertEquals(result.html.includes('<script>'), false);
});

Deno.test('Highlighter: handles comments', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = '// Line comment\n/* Block comment */\n/// Doc comment';
  const result = highlighter.highlight(code);
  
  // Check for comment tokens
  const commentTokens = result.tokens.filter(t => t.type.startsWith('comment'));
  assertEquals(commentTokens.length, 3);
});

Deno.test('Highlighter: caches results', () => {
  const highlighter = new RuchySyntaxHighlighter({ maxCacheSize: 10 });
  const code = 'fn cached() { return true; }';
  
  // First call
  const start1 = performance.now();
  const result1 = highlighter.highlight(code);
  const time1 = performance.now() - start1;
  
  // Second call (should be cached)
  const start2 = performance.now();
  const result2 = highlighter.highlight(code);
  const time2 = performance.now() - start2;
  
  // Results should be identical
  assertEquals(result1.html, result2.html);
  
  // Cached call should be faster (allowing some variance)
  assertEquals(time2 <= time1, true);
});

Deno.test('Highlighter: respects cache size limit', () => {
  const highlighter = new RuchySyntaxHighlighter({ maxCacheSize: 2 });
  
  // Add 3 items to cache (should evict first)
  highlighter.highlight('code1');
  highlighter.highlight('code2');
  highlighter.highlight('code3');
  
  // Cache should only have 2 items
  // This is internal, but we can verify by performance
  const start = performance.now();
  highlighter.highlight('code1'); // Not cached
  const time1 = performance.now() - start;
  
  const start2 = performance.now();
  highlighter.highlight('code3'); // Should be cached
  const time2 = performance.now() - start2;
  
  // code3 should be faster (cached)
  assertEquals(time2 <= time1, true);
});

Deno.test('Highlighter: highlights with custom theme', () => {
  const customTheme = {
    name: 'custom',
    type: 'dark' as const,
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      selection: '#333333',
      cursor: '#ffffff',
      keyword: '#ff0000',
      string: '#00ff00',
      number: '#0000ff',
      comment: '#888888',
      function: '#ffff00',
      variable: '#ff00ff',
      type: '#00ffff',
      operator: '#ffffff',
      error: '#ff0000',
    },
  };
  
  const highlighter = new RuchySyntaxHighlighter({ theme: customTheme });
  const code = 'let x = "test";';
  const result = highlighter.highlight(code);
  
  // Check custom colors are applied
  assertEquals(result.html.includes('#ff0000'), true); // keyword
  assertEquals(result.html.includes('#00ff00'), true); // string
});

Deno.test('Highlighter: handles multiline strings', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = `let text = "This is
a multiline
string";`;
  
  const result = highlighter.highlight(code);
  
  // Should handle multiline strings
  const stringTokens = result.tokens.filter(t => t.type.startsWith('string'));
  assertEquals(stringTokens.length > 0, true);
});

Deno.test('Highlighter: handles all Ruchy keywords', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const keywords = [
    'fn', 'let', 'const', 'if', 'else', 'for', 'while', 'return',
    'break', 'continue', 'match', 'case', 'default', 'struct',
    'enum', 'trait', 'impl', 'pub', 'priv', 'mut', 'ref',
    'async', 'await', 'spawn', 'actor', 'send', 'receive',
    'try', 'catch', 'finally', 'throw', 'import', 'export',
    'module', 'use', 'as', 'in'
  ];
  
  const code = keywords.join(' ');
  const result = highlighter.highlight(code);
  
  // All should be highlighted as keywords
  const keywordTokens = result.tokens.filter(t => t.type.startsWith('keyword'));
  assertEquals(keywordTokens.length, keywords.length);
});

Deno.test('Highlighter: handles complex nested structures', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = `
actor Counter {
  mut count: i32 = 0;
  
  receive msg: Message {
    match msg {
      Increment => {
        self.count += 1;
        send(Response::Count(self.count));
      }
      Decrement => {
        self.count -= 1;
        send(Response::Count(self.count));
      }
      Reset => {
        self.count = 0;
        send(Response::Ok);
      }
    }
  }
}`;
  
  const result = highlighter.highlight(code);
  
  // Should have various token types
  assertExists(result.tokens.find(t => t.type.includes('actor')));
  assertExists(result.tokens.find(t => t.type.includes('receive')));
  assertExists(result.tokens.find(t => t.type.includes('match')));
  assertExists(result.tokens.find(t => t.type.includes('send')));
});

Deno.test('Highlighter: provides accurate statistics', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = `fn main() {
    // Comment
    let x = 42;
    println("Hello");
}`;
  
  const result = highlighter.highlight(code);
  
  assertExists(result.stats);
  assertEquals(result.stats.lineCount, 5);
  assertEquals(result.stats.tokenCount > 0, true);
  assertEquals(result.stats.parseTime >= 0, true);
});

Deno.test('Highlighter: handles ANSI output', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const code = 'fn test() { return 42; }';
  const ansi = highlighter.toANSI(code);
  
  // Should contain ANSI escape codes
  assertEquals(ansi.includes('\x1b['), true);
  assertEquals(ansi.includes('fn'), true);
  assertEquals(ansi.includes('test'), true);
});

Deno.test('Highlighter: changes theme dynamically', () => {
  const highlighter = new RuchySyntaxHighlighter({ theme: 'ruchy-dark' });
  
  const code = 'let x = 10;';
  const result1 = highlighter.highlight(code);
  
  highlighter.setTheme('ruchy-light');
  const result2 = highlighter.highlight(code);
  
  // Results should be different
  assertEquals(result1.html !== result2.html, true);
});

Deno.test('Highlighter: getTheme returns current theme', () => {
  const highlighter = new RuchySyntaxHighlighter({ theme: 'monokai' });
  const theme = highlighter.getTheme();
  
  assertEquals(theme.name, 'monokai');
  assertEquals(theme.type, 'dark');
});