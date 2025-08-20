/**
 * Integration tests for complete syntax highlighting workflow
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { highlight, highlightTerminal } from '../../src/index.ts';
import { RuchySyntaxHighlighter } from '../../src/highlighter/highlighter.ts';
import { ThemeManager } from '../../src/highlighter/themes.ts';
import { ReplHighlighter } from '../../src/repl/index.ts';

Deno.test('Integration: complete Ruchy program highlighting', () => {
  const code = `
// Ruchy Actor System Example
module actors;

import std.io;
import std.collections.HashMap;

/// Message types for the counter actor
enum Message {
    Increment,
    Decrement,
    GetCount,
    Reset,
}

/// Response types
enum Response {
    Count(i32),
    Ok,
}

/// A simple counter actor
actor Counter {
    mut count: i32 = 0;
    
    receive msg: Message {
        match msg {
            Message::Increment => {
                self.count += 1;
                send(Response::Count(self.count));
            }
            Message::Decrement => {
                self.count -= 1;
                send(Response::Count(self.count));
            }
            Message::GetCount => {
                send(Response::Count(self.count));
            }
            Message::Reset => {
                self.count = 0;
                send(Response::Ok);
            }
        }
    }
}

/// Main entry point
async fn main() -> Result<(), Error> {
    // Spawn a counter actor
    let counter = spawn Counter::new();
    
    // Send some messages
    counter.send(Message::Increment).await?;
    counter.send(Message::Increment).await?;
    
    let response = counter.send(Message::GetCount).await?;
    
    if let Response::Count(count) = response {
        println(f"Current count: {count}");
    }
    
    // Reset the counter
    counter.send(Message::Reset).await?;
    
    Ok(())
}

// Generic trait example
trait Container<T> {
    fn add(&mut self, item: T);
    fn remove(&mut self) -> Option<T>;
    fn is_empty(&self) -> bool;
}

// Implementation
impl<T> Container<T> for Vec<T> {
    fn add(&mut self, item: T) {
        self.push(item);
    }
    
    fn remove(&mut self) -> Option<T> {
        self.pop()
    }
    
    fn is_empty(&self) -> bool {
        self.len() == 0
    }
}
`;

  const highlighter = new RuchySyntaxHighlighter();
  const result = highlighter.highlight(code);
  
  // Verify HTML output
  assertExists(result.html);
  assertEquals(result.html.includes('<span'), true);
  
  // Verify all major constructs are highlighted
  assertEquals(result.html.includes('keyword.declaration.module'), true);
  assertEquals(result.html.includes('keyword.control.import'), true);
  assertEquals(result.html.includes('keyword.declaration.enum'), true);
  assertEquals(result.html.includes('keyword.special.actor'), true);
  assertEquals(result.html.includes('keyword.special.receive'), true);
  assertEquals(result.html.includes('keyword.control.match'), true);
  assertEquals(result.html.includes('keyword.special.send'), true);
  assertEquals(result.html.includes('keyword.special.spawn'), true);
  assertEquals(result.html.includes('keyword.modifier.async'), true);
  assertEquals(result.html.includes('keyword.declaration.trait'), true);
  assertEquals(result.html.includes('keyword.declaration.impl'), true);
  
  // Verify comments are highlighted
  assertEquals(result.html.includes('comment.line'), true);
  assertEquals(result.html.includes('comment.doc'), true);
  
  // Verify strings are highlighted
  assertEquals(result.html.includes('string.template'), true);
  
  // Verify statistics
  assertEquals(result.stats.lines > 80, true);
  assertEquals(result.stats.tokens > 200, true);
});

Deno.test('Integration: theme switching workflow', () => {
  const code = 'fn test() { return 42; }';
  const themes = ['ruchy-dark', 'ruchy-light', 'monokai', 'github', 'dracula'];
  
  const highlighter = new RuchySyntaxHighlighter();
  const results = new Map<string, string>();
  
  for (const theme of themes) {
    highlighter.setTheme(theme);
    const result = highlighter.highlight(code);
    results.set(theme, result.html);
  }
  
  // All themes should produce different output
  const uniqueOutputs = new Set(results.values());
  assertEquals(uniqueOutputs.size, themes.length);
  
  // Dark themes should have dark backgrounds
  const darkTheme = results.get('ruchy-dark')!;
  assertEquals(darkTheme.includes('#1e1e1e'), true);
  
  // Light themes should have light backgrounds
  const lightTheme = results.get('ruchy-light')!;
  assertEquals(lightTheme.includes('#ffffff'), true);
});

Deno.test('Integration: HTML and ANSI output consistency', () => {
  const code = `
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
`;

  const highlighter = new RuchySyntaxHighlighter();
  
  // Get HTML output
  const htmlResult = highlighter.highlight(code);
  
  // Get ANSI output
  const ansiResult = highlighter.toANSI(code);
  
  // Both should contain the same code structure
  assertEquals(htmlResult.html.includes('fibonacci'), true);
  assertEquals(ansiResult.includes('fibonacci'), true);
  
  assertEquals(htmlResult.html.includes('match'), true);
  assertEquals(ansiResult.includes('match'), true);
  
  // HTML should have tags
  assertEquals(htmlResult.html.includes('<span'), true);
  
  // ANSI should have escape codes
  assertEquals(ansiResult.includes('\x1b['), true);
});

Deno.test('Integration: REPL highlighting workflow', () => {
  const replHighlighter = new ReplHighlighter({ theme: 'monokai' });
  
  // Simulate REPL session
  const prompt = replHighlighter.createPrompt();
  assertEquals(prompt.includes('ruchy>'), true);
  
  // User input
  const input = 'let x = 42;';
  const highlighted = replHighlighter.highlight(input);
  assertEquals(highlighted.includes('\x1b['), true);
  
  // Error output
  const error = replHighlighter.formatError('Undefined variable: y', 1, 8);
  assertEquals(error.includes('Error:'), true);
  
  // Success output
  const success = replHighlighter.formatSuccess('Expression evaluated');
  assertEquals(success.includes('✓'), true);
});

Deno.test('Integration: custom theme workflow', () => {
  const themeManager = new ThemeManager();
  
  // Create custom theme
  const customTheme = themeManager.createTheme('my-custom', 'dark', {
    keyword: '#ff00ff',
    string: '#00ff00',
    number: '#ffff00',
  });
  
  // Register it
  themeManager.registerTheme(customTheme);
  
  // Use it in highlighter
  const highlighter = new RuchySyntaxHighlighter({ theme: 'my-custom' });
  const code = 'let msg = "Hello"; let num = 123;';
  const result = highlighter.highlight(code);
  
  // Verify custom colors are applied
  assertEquals(result.html.includes('#ff00ff'), true); // keyword
  assertEquals(result.html.includes('#00ff00'), true); // string
  assertEquals(result.html.includes('#ffff00'), true); // number
});

Deno.test('Integration: caching performance', () => {
  const highlighter = new RuchySyntaxHighlighter({ cacheSize: 100 });
  
  // Generate test data
  const codes = [];
  for (let i = 0; i < 50; i++) {
    codes.push(`fn function_${i}() { return ${i}; }`);
  }
  
  // First pass - populate cache
  const firstPassStart = performance.now();
  for (const code of codes) {
    highlighter.highlight(code);
  }
  const firstPassTime = performance.now() - firstPassStart;
  
  // Second pass - should be cached
  const secondPassStart = performance.now();
  for (const code of codes) {
    highlighter.highlight(code);
  }
  const secondPassTime = performance.now() - secondPassStart;
  
  // Cached should be significantly faster
  assertEquals(secondPassTime < firstPassTime * 0.5, true);
});

Deno.test('Integration: error handling', () => {
  const highlighter = new RuchySyntaxHighlighter();
  
  // Malformed input with special characters
  const malformed = 'let x = @#$%;';
  const result = highlighter.highlight(malformed);
  
  // Should still produce output
  assertExists(result.html);
  assertExists(result.tokens);
  
  // Should have error tokens
  const errorTokens = result.tokens.filter(t => t.type === 'error');
  assertEquals(errorTokens.length > 0, true);
});

Deno.test('Integration: quick highlight functions', () => {
  // Test HTML quick highlight
  const html = highlight('fn main() { println("Hello"); }', 'dark');
  assertEquals(html.includes('<span'), true);
  assertEquals(html.includes('fn'), true);
  
  // Test terminal quick highlight
  const ansi = highlightTerminal('let x = 42;', 'monokai');
  assertEquals(ansi.includes('\x1b['), true);
  assertEquals(ansi.includes('let'), true);
});

Deno.test('Integration: line number rendering', () => {
  const code = `fn line1() {
    // line 2
    let x = 3;
    return x;
}`;

  const highlighter = new RuchySyntaxHighlighter();
  const result = highlighter.highlight(code, { lineNumbers: true });
  
  // Check line numbers are present
  assertEquals(result.html.includes('line-number'), true);
  assertEquals(result.html.includes('data-line="1"'), true);
  assertEquals(result.html.includes('data-line="2"'), true);
  assertEquals(result.html.includes('data-line="3"'), true);
  assertEquals(result.html.includes('data-line="4"'), true);
  assertEquals(result.html.includes('data-line="5"'), true);
});

Deno.test('Integration: large file performance', () => {
  // Generate a large file
  const lines = [];
  for (let i = 0; i < 1000; i++) {
    lines.push(`
actor Service_${i} {
    mut state: HashMap<String, i32> = HashMap::new();
    
    receive msg: Request {
        match msg.type {
            RequestType::Get(key) => {
                let value = self.state.get(&key).unwrap_or(&0);
                send(Response::Value(*value));
            }
            RequestType::Set(key, value) => {
                self.state.insert(key, value);
                send(Response::Ok);
            }
        }
    }
}`);
  }
  
  const code = lines.join('\n');
  const highlighter = new RuchySyntaxHighlighter();
  
  const start = performance.now();
  const result = highlighter.highlight(code);
  const elapsed = performance.now() - start;
  
  // Should complete within performance requirements
  assertEquals(elapsed < 1000, true); // Less than 1 second for 1000 actors
  
  // Should have correct output
  assertExists(result.html);
  assertEquals(result.stats.lineCount > 15000, true);
});