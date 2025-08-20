/**
 * Performance benchmarks for Ruchy syntax highlighter
 */

import { RuchySyntaxHighlighter } from '../src/highlighter/highlighter.ts';
import { Lexer } from '../src/tokenizer/lexer.ts';
import { ReplHighlighter } from '../src/repl/index.ts';

// Sample code snippets of various sizes
const SMALL_CODE = 'fn test() { return 42; }';

const MEDIUM_CODE = `
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn factorial(n: u32) -> u32 {
    if n <= 1 {
        return 1;
    }
    return n * factorial(n - 1);
}
`;

const LARGE_CODE = (() => {
  const lines = [];
  for (let i = 0; i < 100; i++) {
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
  return lines.join('\n');
})();

const HUGE_CODE = (() => {
  const lines = [];
  for (let i = 0; i < 10000; i++) {
    lines.push(`fn function_${i}(x: i32, y: i32) -> i32 { return x + y + ${i}; }`);
  }
  return lines.join('\n');
})();

// Benchmark: Lexer tokenization speed
Deno.bench('Lexer: small code (25 chars)', () => {
  const lexer = new Lexer(SMALL_CODE);
  lexer.tokenize();
});

Deno.bench('Lexer: medium code (~300 chars)', () => {
  const lexer = new Lexer(MEDIUM_CODE);
  lexer.tokenize();
});

Deno.bench('Lexer: large code (~1500 lines)', () => {
  const lexer = new Lexer(LARGE_CODE);
  lexer.tokenize();
});

Deno.bench('Lexer: huge code (10k lines)', () => {
  const lexer = new Lexer(HUGE_CODE);
  lexer.tokenize();
});

// Benchmark: Full highlighting pipeline
Deno.bench('Highlighter: small code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.highlight(SMALL_CODE);
});

Deno.bench('Highlighter: medium code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.highlight(MEDIUM_CODE);
});

Deno.bench('Highlighter: large code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.highlight(LARGE_CODE);
});

Deno.bench('Highlighter: huge code (10k lines)', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.highlight(HUGE_CODE);
});

// Benchmark: Caching effectiveness
Deno.bench('Highlighter: cached small code', () => {
  const highlighter = new RuchySyntaxHighlighter({ cacheSize: 100 });
  // Prime the cache
  highlighter.highlight(SMALL_CODE);
  
  // Benchmark cached access
  for (let i = 0; i < 100; i++) {
    highlighter.highlight(SMALL_CODE);
  }
});

Deno.bench('Highlighter: uncached small code', () => {
  const highlighter = new RuchySyntaxHighlighter({ cacheSize: 0 });
  
  for (let i = 0; i < 100; i++) {
    highlighter.highlight(SMALL_CODE);
  }
});

// Benchmark: ANSI output
Deno.bench('Highlighter: ANSI small code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.toANSI(SMALL_CODE);
});

Deno.bench('Highlighter: ANSI medium code', () => {
  const highlighter = new RuchySyntaxHighlighter();
  highlighter.toANSI(MEDIUM_CODE);
});

// Benchmark: REPL highlighting
Deno.bench('REPL: highlight small code', () => {
  const replHighlighter = new ReplHighlighter();
  replHighlighter.highlight(SMALL_CODE);
});

Deno.bench('REPL: highlight with line numbers', () => {
  const replHighlighter = new ReplHighlighter();
  replHighlighter.highlight(MEDIUM_CODE, { showLineNumbers: true });
});

// Benchmark: Theme switching
Deno.bench('Highlighter: theme switching', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const themes = ['ruchy-dark', 'ruchy-light', 'monokai', 'github', 'dracula'];
  
  for (const theme of themes) {
    highlighter.setTheme(theme);
    highlighter.highlight(SMALL_CODE);
  }
});

// Benchmark: Incremental updates (simulated)
Deno.bench('Highlighter: incremental update simulation', () => {
  const highlighter = new RuchySyntaxHighlighter({ cacheSize: 100 });
  let code = MEDIUM_CODE;
  
  // Simulate typing by appending characters
  for (let i = 0; i < 10; i++) {
    code += '\n// New comment';
    highlighter.highlight(code);
  }
});

// Memory benchmark helpers
function measureMemory(fn: () => void, iterations: number = 100): void {
  if (typeof Deno.memoryUsage === 'function') {
    const before = Deno.memoryUsage();
    
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    
    const after = Deno.memoryUsage();
    const used = (after.heapUsed - before.heapUsed) / 1024 / 1024;
    
    console.log(`Memory used: ${used.toFixed(2)} MB`);
  }
}

// Performance requirement validation
Deno.bench('Requirement: <50ms for 10k lines', () => {
  const highlighter = new RuchySyntaxHighlighter();
  const start = performance.now();
  highlighter.highlight(HUGE_CODE);
  const elapsed = performance.now() - start;
  
  if (elapsed >= 50) {
    console.warn(`⚠️  Performance requirement not met: ${elapsed.toFixed(2)}ms (target: <50ms)`);
  }
});

Deno.bench('Requirement: <5ms incremental update', () => {
  const highlighter = new RuchySyntaxHighlighter({ cacheSize: 100 });
  
  // Prime with initial code
  highlighter.highlight(MEDIUM_CODE);
  
  // Measure incremental update
  const start = performance.now();
  highlighter.highlight(MEDIUM_CODE + '\n// Added line');
  const elapsed = performance.now() - start;
  
  if (elapsed >= 5) {
    console.warn(`⚠️  Incremental update requirement not met: ${elapsed.toFixed(2)}ms (target: <5ms)`);
  }
});