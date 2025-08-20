/**
 * Semantic Syntax Highlighting for Ruchy
 * Provides IDE-quality semantic coloring with type-aware highlighting
 */

(function() {
  'use strict';

  // Token types for semantic highlighting
  const TokenType = {
    // Variables & Parameters
    VARIABLE: 'variable',
    PARAMETER: 'parameter',
    CONSTANT: 'constant',
    MUTABLE: 'mutable',
    
    // Functions & Methods
    FUNCTION: 'function',
    METHOD: 'method',
    MACRO: 'macro',
    BUILTIN: 'builtin',
    
    // Types
    TYPE: 'type',
    TRAIT: 'trait',
    STRUCT: 'struct',
    ENUM: 'enum',
    GENERIC: 'generic',
    
    // Control Flow
    CONTROL_FLOW: 'control-flow',
    ASYNC: 'async',
    
    // Literals
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    
    // Special
    SELF: 'self',
    LIFETIME: 'lifetime',
    ATTRIBUTE: 'attribute',
    UNSAFE: 'unsafe',
    
    // Comments & Docs
    COMMENT: 'comment',
    DOC_COMMENT: 'doc-comment'
  };

  // Semantic token modifiers
  const TokenModifier = {
    DECLARATION: 'declaration',
    DEFINITION: 'definition',
    READONLY: 'readonly',
    STATIC: 'static',
    DEPRECATED: 'deprecated',
    ASYNC: 'async',
    MODIFICATION: 'modification',
    DOCUMENTATION: 'documentation',
    DEFAULT_LIBRARY: 'defaultLibrary'
  };

  // Ruchy language semantic model
  class RuchySemanticModel {
    constructor() {
      this.builtinTypes = new Set([
        'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
        'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
        'f32', 'f64', 'bool', 'char', 'str', 'String',
        'Vec', 'HashMap', 'HashSet', 'Option', 'Result',
        'Box', 'Rc', 'Arc', 'Cell', 'RefCell', 'Mutex',
        'DataFrame', 'Series', 'Actor', 'Message'
      ]);
      
      this.builtinFunctions = new Set([
        'print', 'println', 'eprintln', 'panic', 'assert',
        'assert_eq', 'assert_ne', 'debug_assert', 'format',
        'vec', 'hashmap', 'hashset', 'df', 'series',
        'spawn', 'send', 'receive', 'ask', 'tell'
      ]);
      
      this.builtinMacros = new Set([
        'println!', 'print!', 'eprintln!', 'format!', 'panic!',
        'assert!', 'assert_eq!', 'assert_ne!', 'debug_assert!',
        'vec!', 'hashmap!', 'df!', 'actor!', 'message!'
      ]);
      
      this.controlFlowKeywords = new Set([
        'if', 'else', 'match', 'while', 'for', 'loop',
        'break', 'continue', 'return', 'yield'
      ]);
      
      this.asyncKeywords = new Set([
        'async', 'await', 'spawn', 'join', 'select'
      ]);
      
      this.declarationKeywords = new Set([
        'let', 'const', 'static', 'mut', 'pub', 'impl'
      ]);
      
      this.typeKeywords = new Set([
        'struct', 'enum', 'trait', 'type', 'impl', 'where'
      ]);
    }
    
    /**
     * Tokenize Ruchy code with semantic information
     */
    tokenize(code) {
      const tokens = [];
      const lines = code.split('\n');
      
      let inComment = false;
      let inString = false;
      let inDocComment = false;
      
      for (let lineNum = 0; lineNum < lines.length; lineNum++) {
        const line = lines[lineNum];
        const lineTokens = this.tokenizeLine(line, lineNum);
        tokens.push(...lineTokens);
      }
      
      return tokens;
    }
    
    /**
     * Tokenize a single line with semantic analysis
     */
    tokenizeLine(line, lineNum) {
      const tokens = [];
      const pattern = /(\b\w+\b|[^\w\s]+|\s+)/g;
      let match;
      let columnNum = 0;
      
      while ((match = pattern.exec(line)) !== null) {
        const text = match[0];
        const startCol = match.index;
        
        // Skip whitespace
        if (/^\s+$/.test(text)) {
          continue;
        }
        
        const token = this.classifyToken(text, line, startCol, lineNum);
        if (token) {
          tokens.push(token);
        }
      }
      
      return tokens;
    }
    
    /**
     * Classify a token semantically
     */
    classifyToken(text, line, column, lineNum) {
      // Comments
      if (text.startsWith('//')) {
        if (text.startsWith('///') || text.startsWith('//!')) {
          return {
            text,
            type: TokenType.DOC_COMMENT,
            modifiers: [TokenModifier.DOCUMENTATION],
            line: lineNum,
            column
          };
        }
        return {
          text,
          type: TokenType.COMMENT,
          line: lineNum,
          column
        };
      }
      
      // String literals
      if (text.startsWith('"') || text.startsWith("'") || text.startsWith('f"')) {
        return {
          text,
          type: TokenType.STRING,
          line: lineNum,
          column
        };
      }
      
      // Numbers
      if (/^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text)) {
        return {
          text,
          type: TokenType.NUMBER,
          line: lineNum,
          column
        };
      }
      
      // Booleans
      if (text === 'true' || text === 'false') {
        return {
          text,
          type: TokenType.BOOLEAN,
          line: lineNum,
          column
        };
      }
      
      // Self
      if (text === 'self' || text === 'Self') {
        return {
          text,
          type: TokenType.SELF,
          modifiers: text === 'Self' ? [TokenModifier.DEFINITION] : [],
          line: lineNum,
          column
        };
      }
      
      // Control flow
      if (this.controlFlowKeywords.has(text)) {
        return {
          text,
          type: TokenType.CONTROL_FLOW,
          line: lineNum,
          column
        };
      }
      
      // Async keywords
      if (this.asyncKeywords.has(text)) {
        return {
          text,
          type: TokenType.ASYNC,
          modifiers: [TokenModifier.ASYNC],
          line: lineNum,
          column
        };
      }
      
      // Type keywords
      if (this.typeKeywords.has(text)) {
        return {
          text,
          type: TokenType.TYPE,
          modifiers: [TokenModifier.DECLARATION],
          line: lineNum,
          column
        };
      }
      
      // Builtin types
      if (this.builtinTypes.has(text)) {
        return {
          text,
          type: TokenType.TYPE,
          modifiers: [TokenModifier.DEFAULT_LIBRARY],
          line: lineNum,
          column
        };
      }
      
      // Builtin functions
      if (this.builtinFunctions.has(text)) {
        return {
          text,
          type: TokenType.BUILTIN,
          modifiers: [TokenModifier.DEFAULT_LIBRARY],
          line: lineNum,
          column
        };
      }
      
      // Macros
      if (text.endsWith('!')) {
        return {
          text,
          type: TokenType.MACRO,
          modifiers: this.builtinMacros.has(text) ? [TokenModifier.DEFAULT_LIBRARY] : [],
          line: lineNum,
          column
        };
      }
      
      // Lifetimes
      if (text.startsWith("'")) {
        return {
          text,
          type: TokenType.LIFETIME,
          line: lineNum,
          column
        };
      }
      
      // Attributes
      if (text.startsWith('#[') || text.startsWith('#![')) {
        return {
          text,
          type: TokenType.ATTRIBUTE,
          line: lineNum,
          column
        };
      }
      
      // Variable detection based on context
      if (this.isVariable(text, line, column)) {
        const isMutable = this.isMutableVariable(line, text, column);
        const isConstant = this.isConstant(line, text, column);
        
        return {
          text,
          type: isConstant ? TokenType.CONSTANT : TokenType.VARIABLE,
          modifiers: isMutable ? [TokenModifier.MODIFICATION] : [TokenModifier.READONLY],
          line: lineNum,
          column
        };
      }
      
      // Function detection
      if (this.isFunction(text, line, column)) {
        return {
          text,
          type: TokenType.FUNCTION,
          modifiers: [TokenModifier.DECLARATION],
          line: lineNum,
          column
        };
      }
      
      // Type detection
      if (this.isType(text, line, column)) {
        return {
          text,
          type: TokenType.TYPE,
          line: lineNum,
          column
        };
      }
      
      return null;
    }
    
    /**
     * Check if token is a variable
     */
    isVariable(text, line, column) {
      // Look for let/const patterns
      const beforeText = line.substring(0, column);
      return /\b(let|const|mut)\s+$/.test(beforeText) ||
             /\b(let|const)\s+mut\s+$/.test(beforeText);
    }
    
    /**
     * Check if variable is mutable
     */
    isMutableVariable(line, text, column) {
      const beforeText = line.substring(0, column);
      return /\bmut\s+$/.test(beforeText);
    }
    
    /**
     * Check if variable is constant
     */
    isConstant(line, text, column) {
      const beforeText = line.substring(0, column);
      return /\bconst\s+$/.test(beforeText) || /\bstatic\s+$/.test(beforeText);
    }
    
    /**
     * Check if token is a function
     */
    isFunction(text, line, column) {
      const beforeText = line.substring(0, column);
      return /\bfun\s+$/.test(beforeText) || /\bfn\s+$/.test(beforeText);
    }
    
    /**
     * Check if token is a type
     */
    isType(text, line, column) {
      // Check if it starts with uppercase (convention for types)
      if (!/^[A-Z]/.test(text)) return false;
      
      const beforeText = line.substring(0, column);
      return /:\s*$/.test(beforeText) || 
             /\b(struct|enum|trait|type|impl)\s+$/.test(beforeText) ||
             /<\s*$/.test(beforeText) ||
             /\s+as\s+$/.test(beforeText);
    }
  }

  /**
   * Apply semantic highlighting to code elements
   */
  function applySemanticHighlighting(codeElement) {
    const language = codeElement.className.match(/language-(\w+)/)?.[1];
    
    // Only apply to Ruchy code
    if (language !== 'ruchy' && language !== 'ruc') {
      return;
    }
    
    const code = codeElement.textContent;
    const model = new RuchySemanticModel();
    const tokens = model.tokenize(code);
    
    // Build highlighted HTML
    const lines = code.split('\n');
    const highlightedLines = [];
    
    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const lineTokens = tokens.filter(t => t.line === lineNum);
      
      if (lineTokens.length === 0) {
        highlightedLines.push(escapeHtml(line));
        continue;
      }
      
      // Sort tokens by column
      lineTokens.sort((a, b) => a.column - b.column);
      
      let highlightedLine = '';
      let lastEnd = 0;
      
      for (const token of lineTokens) {
        // Add text before token
        if (token.column > lastEnd) {
          highlightedLine += escapeHtml(line.substring(lastEnd, token.column));
        }
        
        // Add highlighted token
        const classes = [`sem-${token.type}`];
        if (token.modifiers) {
          classes.push(...token.modifiers.map(m => `sem-mod-${m}`));
        }
        
        highlightedLine += `<span class="${classes.join(' ')}">${escapeHtml(token.text)}</span>`;
        lastEnd = token.column + token.text.length;
      }
      
      // Add remaining text
      if (lastEnd < line.length) {
        highlightedLine += escapeHtml(line.substring(lastEnd));
      }
      
      highlightedLines.push(highlightedLine);
    }
    
    // Apply the highlighted HTML
    codeElement.innerHTML = highlightedLines.join('\n');
    codeElement.classList.add('semantic-highlighted');
  }

  /**
   * Escape HTML characters
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Process all code blocks
   */
  function processCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code:not(.semantic-highlighted)');
    
    codeBlocks.forEach(codeBlock => {
      applySemanticHighlighting(codeBlock);
    });
  }

  /**
   * Initialize semantic highlighting
   */
  function initialize() {
    // Process existing code blocks
    processCodeBlocks();
    
    // Watch for new code blocks
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          // Delay to let other scripts run first
          setTimeout(processCodeBlocks, 100);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();