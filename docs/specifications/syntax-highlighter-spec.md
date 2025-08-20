# Ruchy Syntax Highlighter Specification v1.0

## Executive Summary

This specification defines a world-class syntax highlighting system for the Ruchy programming language, incorporating best practices from leading REPL-enabled languages and syntax highlighting libraries. The implementation will use Deno TypeScript with >80% test coverage, following the same rigor as enterprise-grade configuration scripts.

## Research Foundation

### Analyzed REPL-Enabled Languages

1. **Python (IPython/Pygments)**: Token-based coloring with customizable themes, uses Pygments library for tokenization
2. **Ruby (Pry/CodeRay)**: CodeRay tokenizer with configurable color schemes via .pryrc
3. **Node.js (pretty-repl)**: Override `_writeToOutput` method with colorize functions using chalk
4. **Rust (evcxr/syntect)**: Sublime Text syntax definitions with regex-based parsing
5. **Clojure (CIDER/nREPL)**: Piggieback middleware for ClojureScript REPL highlighting
6. **Julia (OhMyREPL.jl)**: Pass-based system with Tokenize.jl/JuliaSyntax.jl for lexical analysis
7. **Elixir (IEx)**: ANSI escape sequences with IO.ANSI module, configurable per-token colors
8. **Swift (REPL)**: LLVM-based syntax highlighting with SourceKit integration
9. **Haskell (GHCi)**: Haskeline library with custom prompt colorization
10. **Go (gore)**: go/scanner and go/token packages for lexical analysis

### Analyzed Top Syntax Highlighters

1. **Prism.js**: Lightweight (2KB core), regex-based tokens, CSS styling, plugin architecture
2. **highlight.js**: Tree-based modes, automatic language detection, relevance scoring
3. **CodeMirror 6 (Lezer)**: Incremental LR parsing, efficient tree reuse, error recovery
4. **Monaco Editor (Monarch)**: State-machine tokenizer, browser-optimized, semantic tokens
5. **Tree-sitter**: Full AST generation, incremental parsing, error tolerance

## Architecture Design

### Core Components

```typescript
// Core architecture modules
interface RuchyHighlighter {
  tokenizer: Tokenizer;           // Lexical analysis
  parser: IncrementalParser;      // Syntax tree generation
  highlighter: SyntaxHighlighter; // Token styling
  cache: TokenCache;               // Performance optimization
  themes: ThemeManager;           // Color scheme management
}
```

### Three-Layer Architecture

#### Layer 1: Tokenization (Lexical Analysis)
- **Input**: Raw Ruchy source code
- **Process**: Break into lexemes using finite automata
- **Output**: Token stream with positions

#### Layer 2: Parsing (Syntax Analysis)
- **Input**: Token stream
- **Process**: Build abstract syntax tree (AST)
- **Output**: Structured tree with semantic information

#### Layer 3: Highlighting (Style Application)
- **Input**: AST with semantic tokens
- **Process**: Apply theme colors and styles
- **Output**: Styled HTML/ANSI sequences

## Token Categories

### Primary Tokens (Must Support)
```typescript
enum TokenType {
  // Keywords (37 total from Ruchy spec)
  KEYWORD_FN = 'keyword.function',
  KEYWORD_LET = 'keyword.declaration',
  KEYWORD_IF = 'keyword.control',
  KEYWORD_ACTOR = 'keyword.actor',
  KEYWORD_ASYNC = 'keyword.async',
  
  // Literals
  STRING = 'string.quoted',
  STRING_INTERPOLATION = 'string.template',
  NUMBER_INTEGER = 'constant.numeric.integer',
  NUMBER_FLOAT = 'constant.numeric.float',
  BOOLEAN = 'constant.boolean',
  
  // Identifiers
  FUNCTION_NAME = 'entity.name.function',
  TYPE_NAME = 'entity.name.type',
  VARIABLE = 'variable',
  PARAMETER = 'variable.parameter',
  
  // Comments
  COMMENT_LINE = 'comment.line',
  COMMENT_BLOCK = 'comment.block',
  COMMENT_DOC = 'comment.documentation',
  
  // Operators
  OPERATOR_ARITHMETIC = 'keyword.operator.arithmetic',
  OPERATOR_COMPARISON = 'keyword.operator.comparison',
  OPERATOR_LOGICAL = 'keyword.operator.logical',
  OPERATOR_ASSIGNMENT = 'keyword.operator.assignment',
  
  // Punctuation
  PUNCTUATION_DELIMITER = 'punctuation.delimiter',
  PUNCTUATION_BRACKET = 'punctuation.bracket',
  PUNCTUATION_SEMICOLON = 'punctuation.terminator',
}
```

### Semantic Tokens (Context-Aware)
```typescript
interface SemanticToken extends Token {
  scope: ScopeType;        // function, class, module
  definition: boolean;     // is this a definition?
  mutable: boolean;        // is variable mutable?
  async: boolean;          // is function async?
  deprecated: boolean;     // is marked deprecated?
  builtin: boolean;        // is builtin function?
}
```

## Implementation Requirements

### Performance Specifications
- **Initial parse**: < 50ms for 10,000 lines
- **Incremental update**: < 5ms for single-line change
- **Memory usage**: < 10MB for 100,000 lines
- **Cache hit rate**: > 90% for incremental updates

### Quality Requirements
- **Test coverage**: > 80% (enforced by CI)
- **Lint compliance**: Zero warnings (deno lint)
- **Format compliance**: 100% (deno fmt --check)
- **Type safety**: Strict TypeScript with no any
- **Documentation**: JSDoc for all public APIs

### Browser Compatibility
- **ES2020+** target for modern browsers
- **WebWorker** support for async parsing
- **WASM** optional acceleration
- **Zero dependencies** for core functionality

## Tokenizer Implementation

### Finite State Machine Design
```typescript
interface TokenizerState {
  mode: LexicalMode;
  buffer: string;
  position: Position;
  stack: StateStack;
}

enum LexicalMode {
  DEFAULT,
  STRING,
  STRING_INTERPOLATION,
  COMMENT,
  REGEX,
  TEMPLATE,
}
```

### Lexical Rules (Regex-Based)
```typescript
const LEXICAL_RULES: LexicalRule[] = [
  // Keywords (highest priority)
  { pattern: /\b(fn|let|const|if|else|for|while|return)\b/, type: TokenType.KEYWORD },
  
  // Identifiers
  { pattern: /[a-zA-Z_][a-zA-Z0-9_]*/, type: TokenType.IDENTIFIER },
  
  // Numbers
  { pattern: /0x[0-9a-fA-F]+/, type: TokenType.NUMBER_HEX },
  { pattern: /\d+\.\d+([eE][+-]?\d+)?/, type: TokenType.NUMBER_FLOAT },
  { pattern: /\d+/, type: TokenType.NUMBER_INTEGER },
  
  // Strings with interpolation
  { pattern: /f"([^"\\]|\\.)*"/, type: TokenType.STRING_INTERPOLATION },
  { pattern: /"([^"\\]|\\.)*"/, type: TokenType.STRING },
  
  // Comments
  { pattern: /\/\/.*$/, type: TokenType.COMMENT_LINE },
  { pattern: /\/\*[\s\S]*?\*\//, type: TokenType.COMMENT_BLOCK },
  
  // Operators
  { pattern: /(\+\+|--|==|!=|<=|>=|&&|\|\||=>)/, type: TokenType.OPERATOR },
];
```

## Parser Implementation

### Incremental Parsing Strategy
```typescript
class IncrementalParser {
  private tree: SyntaxTree;
  private cache: Map<string, TreeFragment>;
  
  parse(input: string, oldTree?: SyntaxTree): SyntaxTree {
    if (oldTree) {
      const changes = diff(input, oldTree.input);
      return this.incrementalParse(oldTree, changes);
    }
    return this.fullParse(input);
  }
  
  private incrementalParse(oldTree: SyntaxTree, changes: Change[]): SyntaxTree {
    // Reuse unchanged subtrees
    const fragments = this.extractReusableFragments(oldTree, changes);
    return this.parseWithFragments(input, fragments);
  }
}
```

### Error Recovery
```typescript
interface ErrorRecovery {
  strategy: RecoveryStrategy;
  syncTokens: Set<TokenType>;  // Tokens to sync on
  maxLookahead: number;         // Maximum tokens to skip
}

enum RecoveryStrategy {
  PANIC_MODE,      // Skip until sync token
  PHRASE_LEVEL,    // Try alternative productions
  ERROR_PRODUCTION // Use error production rules
}
```

## Theme System

### Theme Definition
```typescript
interface Theme {
  name: string;
  type: 'light' | 'dark';
  colors: ColorScheme;
  fontStyles?: FontStyles;
}

interface ColorScheme {
  // Base colors
  background: Color;
  foreground: Color;
  selection: Color;
  cursor: Color;
  
  // Syntax colors
  keyword: Color;
  string: Color;
  number: Color;
  comment: Color;
  function: Color;
  variable: Color;
  type: Color;
  operator: Color;
  
  // Semantic colors
  deprecated: Color;
  error: Color;
  warning: Color;
  info: Color;
}
```

### Built-in Themes
1. **Ruchy Dark** (default dark theme)
2. **Ruchy Light** (default light theme)
3. **Monokai** (popular dark theme)
4. **GitHub** (clean light theme)
5. **Dracula** (vibrant dark theme)

## API Design

### Public API
```typescript
export class RuchySyntaxHighlighter {
  constructor(options?: HighlighterOptions);
  
  // Core methods
  highlight(code: string, options?: HighlightOptions): HighlightResult;
  highlightElement(element: HTMLElement): void;
  
  // Incremental updates
  updateHighlight(code: string, changes: Change[]): HighlightResult;
  
  // Theme management
  setTheme(theme: Theme | string): void;
  registerTheme(theme: Theme): void;
  
  // Language extensions
  addKeyword(keyword: string, type: TokenType): void;
  addPattern(pattern: RegExp, type: TokenType): void;
  
  // REPL support
  highlightREPL(line: string, state?: REPLState): REPLHighlightResult;
}

interface HighlightResult {
  html: string;           // HTML with spans
  tokens: Token[];        // Token array
  ast?: SyntaxTree;       // Optional AST
  stats: {
    parseTime: number;
    tokenCount: number;
    cacheHits: number;
  };
}
```

### REPL Integration
```typescript
export class RuchyREPLHighlighter extends RuchySyntaxHighlighter {
  // ANSI color output for terminal
  toANSI(code: string): string;
  
  // Streaming highlights for typing
  streamHighlight(stream: ReadableStream<string>): ReadableStream<string>;
  
  // Auto-completion hints
  getCompletions(code: string, position: number): Completion[];
  
  // Error highlighting
  highlightErrors(code: string, errors: SyntaxError[]): HighlightResult;
}
```

## Testing Strategy

### Unit Tests (60% coverage)
```typescript
// tokenizer.test.ts
Deno.test("tokenizes keywords correctly", () => {
  const tokens = tokenize("fn main() { return 42; }");
  assertEquals(tokens[0].type, TokenType.KEYWORD_FN);
  assertEquals(tokens[1].type, TokenType.IDENTIFIER);
});

// parser.test.ts
Deno.test("parses function declarations", () => {
  const ast = parse("fn add(a, b) { return a + b; }");
  assertEquals(ast.type, "FunctionDeclaration");
  assertEquals(ast.name, "add");
});

// highlighter.test.ts
Deno.test("applies theme colors correctly", () => {
  const result = highlight("let x = 42", { theme: "dark" });
  assertStringIncludes(result.html, 'class="keyword"');
});
```

### Integration Tests (15% coverage)
```typescript
Deno.test("incremental parsing maintains correctness", async () => {
  const initial = "fn test() { return 1; }";
  const updated = "fn test() { return 42; }";
  
  const result1 = await highlighter.highlight(initial);
  const result2 = await highlighter.updateHighlight(updated, changes);
  
  assertEquals(result2.tokens.length, result1.tokens.length);
  assert(result2.stats.cacheHits > 0);
});
```

### Performance Tests (5% coverage)
```typescript
Deno.test("meets performance requirements", () => {
  const largeFile = generateCode(10000); // 10k lines
  
  const start = performance.now();
  const result = highlighter.highlight(largeFile);
  const elapsed = performance.now() - start;
  
  assert(elapsed < 50, `Parse time ${elapsed}ms exceeds 50ms limit`);
});
```

### Fuzzing Tests
```typescript
Deno.test("handles malformed input gracefully", () => {
  const fuzzer = new CodeFuzzer();
  
  for (let i = 0; i < 1000; i++) {
    const malformed = fuzzer.generate();
    assertDoesNotThrow(() => {
      highlighter.highlight(malformed);
    });
  }
});
```

## Build & Deployment

### Project Structure
```
ruchy-highlighter/
├── src/
│   ├── tokenizer/
│   │   ├── lexer.ts
│   │   ├── tokens.ts
│   │   └── rules.ts
│   ├── parser/
│   │   ├── parser.ts
│   │   ├── ast.ts
│   │   └── incremental.ts
│   ├── highlighter/
│   │   ├── highlighter.ts
│   │   ├── themes.ts
│   │   └── renderer.ts
│   ├── repl/
│   │   ├── repl.ts
│   │   └── ansi.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── performance/
├── themes/
│   ├── dark.json
│   ├── light.json
│   └── monokai.json
├── benchmarks/
├── examples/
├── deno.json
├── Makefile
└── README.md
```

### Makefile Integration
```makefile
# Ruchy Syntax Highlighter Makefile
.PHONY: all test lint format coverage build clean

DENO = deno
SRC = src/**/*.ts
TESTS = tests/**/*.ts

all: lint format test build

lint:
	@echo "🔍 Linting TypeScript files..."
	@$(DENO) lint $(SRC) $(TESTS)
	@echo "✅ No linting errors"

format:
	@echo "📐 Formatting code..."
	@$(DENO) fmt --check $(SRC) $(TESTS)
	@echo "✅ Code formatting correct"

test:
	@echo "🧪 Running tests..."
	@$(DENO) test --allow-read --coverage=coverage
	@echo "✅ All tests passing"

coverage:
	@echo "📊 Generating coverage report..."
	@$(DENO) coverage coverage --lcov > coverage.lcov
	@$(DENO) run --allow-read scripts/check-coverage.ts
	@echo "✅ Coverage > 80%"

build:
	@echo "🔨 Building bundles..."
	@$(DENO) bundle src/index.ts dist/highlighter.js
	@$(DENO) bundle src/repl/index.ts dist/repl.js
	@echo "✅ Build complete"

watch:
	@echo "👁️ Watching for changes..."
	@$(DENO) run --watch --allow-read src/dev.ts

bench:
	@echo "⚡ Running benchmarks..."
	@$(DENO) bench benchmarks/

clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/ coverage/
	@echo "✅ Clean complete"

# Quality gates (must pass for commit)
quality-gate: lint format test coverage
	@echo "✨ All quality gates passed!"

# Deploy to npm/deno.land
deploy: quality-gate build
	@echo "🚀 Deploying to package registries..."
	@$(DENO) run --allow-net scripts/deploy.ts
```

### Deno Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  },
  "lint": {
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo", "no-unused-vars"],
      "exclude": ["no-explicit-any"]
    }
  },
  "fmt": {
    "options": {
      "lineWidth": 100,
      "indentWidth": 2,
      "singleQuote": true,
      "proseWrap": "preserve"
    }
  },
  "test": {
    "files": {
      "include": ["tests/"],
      "exclude": ["tests/fixtures/"]
    }
  },
  "tasks": {
    "dev": "deno run --watch --allow-read src/dev.ts",
    "test": "deno test --allow-read",
    "bench": "deno bench benchmarks/",
    "build": "deno task build:highlighter && deno task build:repl",
    "build:highlighter": "deno bundle src/index.ts dist/highlighter.js",
    "build:repl": "deno bundle src/repl/index.ts dist/repl.js"
  }
}
```

## Performance Optimizations

### Caching Strategy
```typescript
class TokenCache {
  private cache = new LRUCache<string, Token[]>(1000);
  private hashCache = new Map<string, string>();
  
  get(input: string): Token[] | null {
    const hash = this.hash(input);
    return this.cache.get(hash);
  }
  
  set(input: string, tokens: Token[]): void {
    const hash = this.hash(input);
    this.cache.set(hash, tokens);
  }
  
  private hash(input: string): string {
    // Fast hash using djb2 algorithm
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) + hash) + input.charCodeAt(i);
    }
    return hash.toString(36);
  }
}
```

### WebWorker Support
```typescript
// worker.ts
self.onmessage = async (e: MessageEvent) => {
  const { code, options } = e.data;
  const highlighter = new RuchySyntaxHighlighter(options);
  const result = await highlighter.highlight(code);
  self.postMessage(result);
};

// main.ts
class AsyncHighlighter {
  private worker: Worker;
  
  constructor() {
    this.worker = new Worker(new URL('./worker.ts', import.meta.url).href, {
      type: 'module'
    });
  }
  
  async highlight(code: string): Promise<HighlightResult> {
    return new Promise((resolve) => {
      this.worker.onmessage = (e) => resolve(e.data);
      this.worker.postMessage({ code });
    });
  }
}
```

### WASM Acceleration (Optional)
```typescript
// Compile Rust tokenizer to WASM for 10x speedup
import init, { tokenize_wasm } from './tokenizer_wasm.js';

class WASMTokenizer implements Tokenizer {
  private initialized = false;
  
  async init(): Promise<void> {
    await init();
    this.initialized = true;
  }
  
  tokenize(input: string): Token[] {
    if (!this.initialized) {
      throw new Error('WASM not initialized');
    }
    return tokenize_wasm(input);
  }
}
```

## Editor Integration Guide

### VS Code Extension
```typescript
// extension.ts
import * as vscode from 'vscode';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

export function activate(context: vscode.ExtensionContext) {
  const highlighter = new RuchySyntaxHighlighter();
  
  // Register semantic token provider
  const provider = new RuchySemanticTokensProvider(highlighter);
  const selector = { language: 'ruchy', scheme: 'file' };
  
  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      selector, provider, provider.legend
    )
  );
}
```

### Monaco Editor Integration
```javascript
// monaco-integration.js
import * as monaco from 'monaco-editor';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

const highlighter = new RuchySyntaxHighlighter();

// Register language
monaco.languages.register({ id: 'ruchy' });

// Set tokenizer
monaco.languages.setMonarchTokensProvider('ruchy', {
  tokenizer: {
    root: highlighter.getMonarchRules()
  }
});

// Set theme
monaco.editor.defineTheme('ruchy-dark', highlighter.getMonacoTheme('dark'));
```

### CodeMirror 6 Integration
```typescript
// codemirror-integration.ts
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

const highlighter = new RuchySyntaxHighlighter();

// Create highlight style
const ruchyHighlightStyle = HighlightStyle.define(
  highlighter.getCodeMirrorTags()
);

// Create extension
export const ruchyHighlighting = () => [
  syntaxHighlighting(ruchyHighlightStyle)
];
```

## Quality Metrics

### Code Quality Targets
- **Cyclomatic Complexity**: < 10 per function
- **Cognitive Complexity**: < 15 per function
- **Duplication**: < 3% across codebase
- **Technical Debt Ratio**: < 5%
- **Maintainability Index**: > 80

### Performance Benchmarks
```typescript
// benchmark.ts
Deno.bench("tokenize 1000 lines", () => {
  const code = generateRuchyCode(1000);
  tokenizer.tokenize(code);
});

Deno.bench("incremental parse 10k lines", () => {
  const code = generateRuchyCode(10000);
  const tree = parser.parse(code);
  const modified = modifyLine(code, 5000);
  parser.incrementalParse(modified, tree);
});

Deno.bench("highlight with caching", () => {
  const code = generateRuchyCode(100);
  for (let i = 0; i < 100; i++) {
    highlighter.highlight(code); // Should hit cache after first
  }
});
```

## Security Considerations

### Input Sanitization
```typescript
class SecureHighlighter {
  private readonly MAX_INPUT_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_TOKEN_COUNT = 1000000;
  
  highlight(input: string): HighlightResult {
    // Size check
    if (input.length > this.MAX_INPUT_SIZE) {
      throw new Error('Input too large');
    }
    
    // Sanitize input
    input = this.sanitize(input);
    
    // Token limit
    const tokens = this.tokenize(input);
    if (tokens.length > this.MAX_TOKEN_COUNT) {
      throw new Error('Token limit exceeded');
    }
    
    return this.doHighlight(tokens);
  }
  
  private sanitize(input: string): string {
    // Remove null bytes and control characters
    return input.replace(/\0/g, '').replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  }
}
```

### XSS Prevention
```typescript
function escapeHTML(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'\/]/g, (char) => escapeMap[char]);
}
```

## Accessibility

### ARIA Support
```typescript
interface AccessibleHighlight {
  // Add ARIA labels for screen readers
  addAriaLabels(element: HTMLElement): void;
  
  // High contrast mode support
  enableHighContrast(): void;
  
  // Keyboard navigation
  enableKeyboardNav(): void;
}
```

### Color Contrast
- All themes must meet WCAG AAA standards (7:1 ratio)
- Provide colorblind-friendly themes
- Support Windows High Contrast mode

## Future Enhancements

### Phase 2 Features
1. **LSP Integration**: Language Server Protocol support
2. **Diff Highlighting**: Show code changes with colors
3. **Folding Ranges**: Collapse/expand code blocks
4. **Minimap**: Visual code overview
5. **Bracket Matching**: Highlight matching brackets

### Phase 3 Features
1. **AI-Powered Themes**: ML-generated color schemes
2. **Context-Aware Highlighting**: Highlight based on usage
3. **Real-time Collaboration**: Shared highlighting state
4. **Voice Navigation**: Audio cues for code structure
5. **3D Visualization**: Three.js code structure viz

## Conclusion

This specification provides a comprehensive blueprint for implementing a world-class syntax highlighter for Ruchy. By incorporating best practices from leading projects and languages, we ensure:

1. **Performance**: Sub-50ms parsing with incremental updates
2. **Quality**: >80% test coverage with zero warnings
3. **Extensibility**: Plugin architecture for customization
4. **Accessibility**: WCAG AAA compliant themes
5. **Developer Experience**: Simple API with great documentation

The implementation will establish Ruchy as having one of the best syntax highlighting experiences available, suitable for everything from simple REPL usage to complex IDE integrations.

## References

- [Prism.js Architecture](https://prismjs.com/extending.html)
- [Tree-sitter Incremental Parsing](https://tree-sitter.github.io/tree-sitter/)
- [Lezer Parser System](https://lezer.codemirror.net/docs/guide/)
- [Monaco Editor Monarch](https://microsoft.github.io/monaco-editor/monarch.html)
- [Pygments Token Types](https://pygments.org/docs/tokens/)
- [TextMate Grammar Spec](https://macromates.com/manual/en/language_grammars)
- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [WebWorker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [WASM Performance](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced)