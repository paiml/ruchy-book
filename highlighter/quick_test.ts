import { highlight, highlightTerminal } from './src/index.ts';

console.log('🎨 Testing Ruchy Syntax Highlighter...\n');

const code = 'fn main() { println("Hello, Ruchy!"); }';

// Test HTML output
const html = highlight(code, 'monokai');
console.log('✅ HTML highlighting works:', html.includes('<span'));

// Test Terminal output  
const ansi = highlightTerminal(code);
console.log('✅ Terminal highlighting works:', ansi.includes('\x1b['));

console.log('\n🚀 Ruchy Syntax Highlighter is LIVE!');
