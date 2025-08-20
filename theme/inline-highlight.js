/**
 * Inline Code Highlighting for Ruchy Book
 * Provides intelligent syntax highlighting for inline code snippets
 */

(function() {
  'use strict';

  // Ruchy language patterns
  const RuchyPatterns = {
    // Keywords that should always be highlighted
    keywords: new Set([
      'actor', 'as', 'async', 'await', 'break', 'const', 'continue',
      'defer', 'else', 'enum', 'false', 'for', 'fun', 'guard', 'if',
      'impl', 'import', 'in', 'let', 'loop', 'match', 'mod', 'mut',
      'pub', 'return', 'self', 'Self', 'static', 'struct', 'super',
      'trait', 'true', 'type', 'use', 'where', 'while', 'fn'
    ]),
    
    // Common types
    types: new Set([
      'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
      'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
      'f32', 'f64', 'bool', 'char', 'str', 'String',
      'Vec', 'HashMap', 'HashSet', 'Option', 'Result',
      'Box', 'Rc', 'Arc', 'Cell', 'RefCell', 'Mutex',
      'DataFrame', 'Series', 'Actor', 'Message'
    ]),
    
    // Common macros
    macros: new Set([
      'println!', 'print!', 'eprintln!', 'format!', 'panic!',
      'assert!', 'assert_eq!', 'assert_ne!', 'debug_assert!',
      'vec!', 'hashmap!', 'df!', 'actor!', 'message!',
      'todo!', 'unimplemented!', 'unreachable!'
    ]),
    
    // Common functions
    functions: new Set([
      'main', 'new', 'clone', 'drop', 'default', 'from', 'into',
      'unwrap', 'expect', 'map', 'filter', 'fold', 'collect',
      'iter', 'next', 'spawn', 'send', 'receive', 'ask', 'tell'
    ]),
    
    // Patterns for different code elements
    patterns: {
      // Function calls: word followed by parentheses
      functionCall: /\b(\w+)\s*\(/g,
      
      // Method calls: .word(
      methodCall: /\.(\w+)\s*\(/g,
      
      // Type annotations: : Type
      typeAnnotation: /:\s*([A-Z]\w*(?:<[^>]+>)?)/g,
      
      // Generic parameters: <T>
      genericParams: /<([A-Z]\w*(?:\s*,\s*[A-Z]\w*)*)>/g,
      
      // Lifetimes: 'a, 'static
      lifetime: /'[a-z]\w*/g,
      
      // Numbers (including hex, binary, scientific)
      number: /\b(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)[iuf]?\d*\b/g,
      
      // String literals
      string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
      
      // Comments (though rare in inline code)
      comment: /\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
      
      // Attributes
      attribute: /#\[[\w\s,()="]+\]/g,
      
      // Paths: std::collections::HashMap
      path: /\b(?:\w+::)+\w+/g,
      
      // References and derefs: &, *, &mut
      reference: /&(?:mut\s+)?|\*/g,
      
      // Operators
      operator: /[+\-*/%=<>!&|^~?:]+/g
    }
  };

  /**
   * Detect the context of inline code
   */
  function detectContext(codeText, surroundingText) {
    const contexts = {
      type: false,
      function: false,
      variable: false,
      path: false,
      macro: false,
      attribute: false
    };
    
    // Check surrounding text for context clues
    const before = surroundingText.before.slice(-50);
    const after = surroundingText.after.slice(0, 50);
    
    // Type context indicators
    if (/(?:type|struct|enum|trait|impl|where|:\s*$)/.test(before) ||
        /^(?:\s*<|,|\+)/.test(after)) {
      contexts.type = true;
    }
    
    // Function context indicators
    if (/(?:fn|fun|function|method|call|invoke)/.test(before) ||
        /^\s*\(/.test(after)) {
      contexts.function = true;
    }
    
    // Variable context indicators
    if (/(?:let|const|mut|var|variable)/.test(before)) {
      contexts.variable = true;
    }
    
    // Path context indicators
    if (codeText.includes('::')) {
      contexts.path = true;
    }
    
    // Macro context indicators
    if (codeText.endsWith('!')) {
      contexts.macro = true;
    }
    
    // Attribute context indicators
    if (codeText.startsWith('#[')) {
      contexts.attribute = true;
    }
    
    return contexts;
  }

  /**
   * Apply syntax highlighting to inline code
   */
  function highlightInlineCode(codeElement) {
    const text = codeElement.textContent;
    
    // Skip if already highlighted or too short
    if (codeElement.classList.contains('inline-highlighted') || text.length < 2) {
      return;
    }
    
    // Get surrounding text for context detection
    const parent = codeElement.parentElement;
    const parentText = parent.textContent;
    const codeIndex = parentText.indexOf(text);
    const surroundingText = {
      before: parentText.substring(0, codeIndex),
      after: parentText.substring(codeIndex + text.length)
    };
    
    // Detect context
    const contexts = detectContext(text, surroundingText);
    
    // Create highlighted version
    let highlighted = text;
    
    // Apply highlighting based on patterns and context
    if (contexts.macro || text.endsWith('!')) {
      // Macro highlighting
      highlighted = highlightMacro(text);
    } else if (contexts.type || /^[A-Z]/.test(text)) {
      // Type highlighting
      highlighted = highlightType(text);
    } else if (contexts.function || /\w+\s*\(/.test(text)) {
      // Function highlighting
      highlighted = highlightFunction(text);
    } else if (contexts.path || text.includes('::')) {
      // Path highlighting
      highlighted = highlightPath(text);
    } else if (contexts.attribute || text.startsWith('#[')) {
      // Attribute highlighting
      highlighted = highlightAttribute(text);
    } else if (RuchyPatterns.keywords.has(text)) {
      // Keyword highlighting
      highlighted = `<span class="inline-keyword">${text}</span>`;
    } else if (RuchyPatterns.types.has(text)) {
      // Known type highlighting
      highlighted = `<span class="inline-type">${text}</span>`;
    } else if (RuchyPatterns.functions.has(text)) {
      // Known function highlighting
      highlighted = `<span class="inline-function">${text}</span>`;
    } else if (/^['"].*['"]$/.test(text)) {
      // String literal highlighting
      highlighted = `<span class="inline-string">${text}</span>`;
    } else if (/^\d+$/.test(text) || /^0[xXbBoO][\da-fA-F_]+$/.test(text)) {
      // Number highlighting
      highlighted = `<span class="inline-number">${text}</span>`;
    } else if (/^&(?:mut\s+)?\w+$/.test(text)) {
      // Reference highlighting
      highlighted = highlightReference(text);
    } else {
      // Complex expression highlighting
      highlighted = highlightExpression(text);
    }
    
    // Apply the highlighting if it changed
    if (highlighted !== text) {
      codeElement.innerHTML = highlighted;
      codeElement.classList.add('inline-highlighted');
    }
  }

  /**
   * Highlight macro syntax
   */
  function highlightMacro(text) {
    const macroName = text.replace(/!.*$/, '!');
    if (RuchyPatterns.macros.has(macroName)) {
      return `<span class="inline-macro">${escapeHtml(text)}</span>`;
    }
    return `<span class="inline-macro-custom">${escapeHtml(text)}</span>`;
  }

  /**
   * Highlight type syntax
   */
  function highlightType(text) {
    // Handle generic types like Vec<String>
    if (text.includes('<')) {
      return text.replace(/([A-Z]\w*)(<[^>]+>)?/g, (match, type, generics) => {
        const typeSpan = RuchyPatterns.types.has(type) 
          ? `<span class="inline-type">${type}</span>`
          : `<span class="inline-type-custom">${type}</span>`;
        
        if (generics) {
          const highlightedGenerics = generics.replace(/<|>/g, match => 
            `<span class="inline-punct">${match}</span>`
          ).replace(/[A-Z]\w*/g, innerType => 
            RuchyPatterns.types.has(innerType)
              ? `<span class="inline-type">${innerType}</span>`
              : `<span class="inline-type-custom">${innerType}</span>`
          );
          return typeSpan + highlightedGenerics;
        }
        return typeSpan;
      });
    }
    
    // Simple type
    if (RuchyPatterns.types.has(text)) {
      return `<span class="inline-type">${text}</span>`;
    }
    return `<span class="inline-type-custom">${text}</span>`;
  }

  /**
   * Highlight function syntax
   */
  function highlightFunction(text) {
    return text.replace(/(\w+)(\s*\()?/g, (match, name, paren) => {
      const funcSpan = RuchyPatterns.functions.has(name)
        ? `<span class="inline-function">${name}</span>`
        : `<span class="inline-function-custom">${name}</span>`;
      return funcSpan + (paren || '');
    });
  }

  /**
   * Highlight path syntax
   */
  function highlightPath(text) {
    return text.replace(/([\w:]+)/g, segment => {
      if (segment === '::') {
        return `<span class="inline-punct">${segment}</span>`;
      }
      return segment.split('::').map(part => {
        if (RuchyPatterns.types.has(part)) {
          return `<span class="inline-type">${part}</span>`;
        } else if (RuchyPatterns.keywords.has(part)) {
          return `<span class="inline-keyword">${part}</span>`;
        }
        return `<span class="inline-path">${part}</span>`;
      }).join('<span class="inline-punct">::</span>');
    });
  }

  /**
   * Highlight attribute syntax
   */
  function highlightAttribute(text) {
    return `<span class="inline-attribute">${escapeHtml(text)}</span>`;
  }

  /**
   * Highlight reference syntax
   */
  function highlightReference(text) {
    return text.replace(/(&(?:mut\s+)?)(\w+)/, (match, ref, name) => {
      return `<span class="inline-punct">${ref}</span><span class="inline-variable">${name}</span>`;
    });
  }

  /**
   * Highlight complex expressions
   */
  function highlightExpression(text) {
    let result = escapeHtml(text);
    
    // Highlight keywords
    RuchyPatterns.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      result = result.replace(regex, `<span class="inline-keyword">${keyword}</span>`);
    });
    
    // Highlight types
    RuchyPatterns.types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      result = result.replace(regex, `<span class="inline-type">${type}</span>`);
    });
    
    // Highlight numbers
    result = result.replace(RuchyPatterns.patterns.number, 
      match => `<span class="inline-number">${match}</span>`);
    
    // Highlight strings
    result = result.replace(RuchyPatterns.patterns.string,
      match => `<span class="inline-string">${match}</span>`);
    
    return result;
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
   * Process all inline code elements
   */
  function processInlineCode() {
    // Select only inline code (not in pre blocks)
    const inlineCode = document.querySelectorAll('code:not(pre code):not(.inline-highlighted)');
    
    inlineCode.forEach(codeElement => {
      highlightInlineCode(codeElement);
    });
  }

  /**
   * Initialize inline highlighting
   */
  function initialize() {
    // Process existing inline code
    processInlineCode();
    
    // Watch for new content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          // Delay to let other scripts run first
          setTimeout(processInlineCode, 100);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Add hover tooltips for inline code
    document.addEventListener('mouseover', function(e) {
      if (e.target.tagName === 'CODE' && !e.target.closest('pre')) {
        const text = e.target.textContent;
        
        // Add contextual tooltip
        if (RuchyPatterns.keywords.has(text)) {
          e.target.title = `Ruchy keyword: ${text}`;
        } else if (RuchyPatterns.types.has(text)) {
          e.target.title = `Built-in type: ${text}`;
        } else if (RuchyPatterns.macros.has(text)) {
          e.target.title = `Macro: ${text}`;
        } else if (RuchyPatterns.functions.has(text)) {
          e.target.title = `Standard function: ${text}`;
        }
      }
    });
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();