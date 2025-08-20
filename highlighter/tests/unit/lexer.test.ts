/**
 * Unit tests for the Ruchy lexer
 */

import { assertEquals, assertThrows } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { Lexer } from '../../src/tokenizer/lexer.ts';
import { TokenType } from '../../src/tokenizer/tokens.ts';

Deno.test('Lexer: tokenizes keywords correctly', () => {
  const code = 'fn let const if else for while return';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.KEYWORD_FN);
  assertEquals(tokens[1]!.type, TokenType.KEYWORD_LET);
  assertEquals(tokens[2]!.type, TokenType.KEYWORD_CONST);
  assertEquals(tokens[3]!.type, TokenType.KEYWORD_IF);
  assertEquals(tokens[4]!.type, TokenType.KEYWORD_ELSE);
  assertEquals(tokens[5]!.type, TokenType.KEYWORD_FOR);
  assertEquals(tokens[6]!.type, TokenType.KEYWORD_WHILE);
  assertEquals(tokens[7]!.type, TokenType.KEYWORD_RETURN);
});

Deno.test('Lexer: tokenizes identifiers', () => {
  const code = 'myVariable _private camelCase PascalCase snake_case';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  tokens.slice(0, -1).forEach(token => {
    assertEquals(token.type, TokenType.IDENTIFIER);
  });
});

Deno.test('Lexer: tokenizes numbers', () => {
  const testCases = [
    { code: '42', type: TokenType.NUMBER_INTEGER },
    { code: '3.14', type: TokenType.NUMBER_FLOAT },
    { code: '0xFF', type: TokenType.NUMBER_HEX },
    { code: '0b1010', type: TokenType.NUMBER_BINARY },
    { code: '0o755', type: TokenType.NUMBER_OCTAL },
    { code: '1.5e10', type: TokenType.NUMBER_FLOAT },
    { code: '2E-5', type: TokenType.NUMBER_FLOAT },
  ];

  for (const { code, type } of testCases) {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    assertEquals(tokens[0]!.type, type, `Failed for: ${code}`);
    assertEquals(tokens[0]!.value, code);
  }
});

Deno.test('Lexer: tokenizes strings', () => {
  const testCases = [
    { code: '"hello world"', type: TokenType.STRING },
    { code: "'single quotes'", type: TokenType.STRING_SINGLE },
    { code: 'f"Hello {name}"', type: TokenType.STRING_TEMPLATE },
    { code: 'r"raw\\nstring"', type: TokenType.STRING_RAW },
    { code: '"escaped \\"quotes\\""', type: TokenType.STRING },
  ];

  for (const { code, type } of testCases) {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    assertEquals(tokens[0]!.type, type, `Failed for: ${code}`);
  }
});

Deno.test('Lexer: tokenizes operators', () => {
  const testCases = [
    { code: '+ - * / %', count: 5, type: TokenType.OPERATOR_ARITHMETIC },
    { code: '== != < > <= >=', count: 6, type: TokenType.OPERATOR_COMPARISON },
    { code: '&& || !', count: 3, type: TokenType.OPERATOR_LOGICAL },
    { code: '= += -= *= /=', count: 5, type: TokenType.OPERATOR_ASSIGNMENT },
    { code: '.. ... -> =>', count: 4 },
  ];

  for (const testCase of testCases) {
    const lexer = new Lexer(testCase.code);
    const tokens = lexer.tokenize();
    const operatorTokens = tokens.filter(t => t.type.startsWith('keyword.operator'));
    assertEquals(operatorTokens.length, testCase.count, `Failed for: ${testCase.code}`);
  }
});

Deno.test('Lexer: tokenizes comments', () => {
  const code = `
    // Line comment
    /* Block comment */
    /** Doc comment */
    /// Doc line comment
  `;
  
  const lexer = new Lexer(code, { includeComments: true });
  const tokens = lexer.tokenize();
  const comments = tokens.filter(t => t.type.startsWith('comment'));
  
  assertEquals(comments.length, 4);
  assertEquals(comments[0]!.type, TokenType.COMMENT_LINE);
  assertEquals(comments[1]!.type, TokenType.COMMENT_BLOCK);
  assertEquals(comments[2]!.type, TokenType.COMMENT_DOC);
  assertEquals(comments[3]!.type, TokenType.COMMENT_DOC);
});

Deno.test('Lexer: handles punctuation', () => {
  const code = '()[]{},.;:';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.PUNCTUATION_PAREN_OPEN);
  assertEquals(tokens[1]!.type, TokenType.PUNCTUATION_PAREN_CLOSE);
  assertEquals(tokens[2]!.type, TokenType.PUNCTUATION_BRACKET_OPEN);
  assertEquals(tokens[3]!.type, TokenType.PUNCTUATION_BRACKET_CLOSE);
  assertEquals(tokens[4]!.type, TokenType.PUNCTUATION_BRACE_OPEN);
  assertEquals(tokens[5]!.type, TokenType.PUNCTUATION_BRACE_CLOSE);
  assertEquals(tokens[6]!.type, TokenType.PUNCTUATION_COMMA);
  assertEquals(tokens[7]!.type, TokenType.PUNCTUATION_DOT);
  assertEquals(tokens[8]!.type, TokenType.PUNCTUATION_SEMICOLON);
  assertEquals(tokens[9]!.type, TokenType.PUNCTUATION_COLON);
});

Deno.test('Lexer: handles function declaration', () => {
  const code = 'fn add(a: i32, b: i32) -> i32 { return a + b; }';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.KEYWORD_FN);
  assertEquals(tokens[1]!.type, TokenType.IDENTIFIER);
  assertEquals(tokens[1]!.value, 'add');
  assertEquals(tokens[2]!.type, TokenType.PUNCTUATION_PAREN_OPEN);
  
  // Find return keyword
  const returnToken = tokens.find(t => t.type === TokenType.KEYWORD_RETURN);
  assertEquals(returnToken?.value, 'return');
});

Deno.test('Lexer: handles async/await', () => {
  const code = 'async fn fetch() { await http.get(url); }';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.KEYWORD_ASYNC);
  assertEquals(tokens[1]!.type, TokenType.KEYWORD_FN);
  
  const awaitToken = tokens.find(t => t.type === TokenType.KEYWORD_AWAIT);
  assertEquals(awaitToken?.value, 'await');
});

Deno.test('Lexer: handles actor syntax', () => {
  const code = 'actor Counter { spawn receive send }';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.KEYWORD_ACTOR);
  assertEquals(tokens[1]!.type, TokenType.IDENTIFIER);
  assertEquals(tokens[3]!.type, TokenType.KEYWORD_SPAWN);
  assertEquals(tokens[4]!.type, TokenType.KEYWORD_RECEIVE);
  assertEquals(tokens[5]!.type, TokenType.KEYWORD_SEND);
});

Deno.test('Lexer: handles boolean literals', () => {
  const code = 'true false null';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.BOOLEAN_TRUE);
  assertEquals(tokens[1]!.type, TokenType.BOOLEAN_FALSE);
  assertEquals(tokens[2]!.type, TokenType.NULL);
});

Deno.test('Lexer: handles multiline input', () => {
  const code = `fn main() {
    let x = 42;
    println("Hello");
  }`;
  
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  // Check that line numbers are tracked correctly
  const fnToken = tokens.find(t => t.type === TokenType.KEYWORD_FN);
  assertEquals(fnToken?.line, 1);
  
  const letToken = tokens.find(t => t.type === TokenType.KEYWORD_LET);
  assertEquals(letToken?.line, 2);
});

Deno.test('Lexer: handles errors gracefully', () => {
  const code = 'let x = @#$';
  const lexer = new Lexer(code, { throwOnError: false });
  const tokens = lexer.tokenize();

  // Should have error tokens for invalid characters
  const errorTokens = tokens.filter(t => t.type === TokenType.ERROR);
  assertEquals(errorTokens.length, 3); // @, #, $
});

Deno.test('Lexer: throws on error when configured', () => {
  const code = 'let x = @';
  const lexer = new Lexer(code, { throwOnError: true });
  
  assertThrows(
    () => lexer.tokenize(),
    Error,
    'Unexpected character: @',
  );
});

Deno.test('Lexer: handles template string interpolation', () => {
  const code = 'f"Hello {name}, you are {age} years old"';
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.STRING_TEMPLATE);
  assertEquals(tokens[0]!.value, code);
});

Deno.test('Lexer: handles nested block comments', () => {
  const code = '/* outer /* inner */ still in outer */';
  const lexer = new Lexer(code, { includeComments: true });
  const tokens = lexer.tokenize();

  assertEquals(tokens[0]!.type, TokenType.COMMENT_BLOCK);
  assertEquals(tokens[0]!.value, code);
});

Deno.test('Lexer: performance test for large file', () => {
  // Generate a large file (10,000 lines)
  const lines = [];
  for (let i = 0; i < 10000; i++) {
    lines.push(`fn function_${i}() { return ${i}; }`);
  }
  const code = lines.join('\n');

  const start = performance.now();
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const elapsed = performance.now() - start;

  // Should tokenize 10k lines in less than 100ms (adjust threshold for safety)
  assertEquals(elapsed < 100, true, `Tokenization took ${elapsed}ms`);
  
  // Should have correct number of tokens (approximately)
  assertEquals(tokens.length > 10000, true);
});