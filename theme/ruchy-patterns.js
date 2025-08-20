/**
 * Ruchy-Specific Pattern Highlighting
 * Advanced pattern recognition for Ruchy language constructs
 */

(function() {
  'use strict';

  // Ruchy-specific patterns and constructs
  const RuchySpecificPatterns = {
    // Actor system patterns
    actorPatterns: {
      // Actor definition: actor MyActor { ... }
      actorDefinition: /\bactor\s+([A-Z]\w*)\s*\{/g,
      
      // Message definition: message MyMessage { ... }
      messageDefinition: /\bmessage\s+([A-Z]\w*)\s*\{/g,
      
      // Send operation: actor.send(msg)
      sendOperation: /(\w+)\.send\s*\(/g,
      
      // Ask operation: actor.ask(msg).await
      askOperation: /(\w+)\.ask\s*\([^)]*\)\.await/g,
      
      // Tell operation: actor.tell(msg)
      tellOperation: /(\w+)\.tell\s*\(/g,
      
      // Receive pattern: receive { ... }
      receiveBlock: /\breceive\s*\{/g,
      
      // Spawn operation: spawn(actor)
      spawnOperation: /\bspawn\s*\(/g
    },
    
    // DataFrame patterns
    dataFramePatterns: {
      // DataFrame literal: df![...]
      dataFrameLiteral: /\bdf!\s*\[([^\]]*)\]/g,
      
      // Series literal: series![...]
      seriesLiteral: /\bseries!\s*\[([^\]]*)\]/g,
      
      // DataFrame operations
      select: /\.select\s*\(/g,
      filter: /\.filter\s*\(/g,
      groupBy: /\.group_by\s*\(/g,
      aggregate: /\.agg\s*\(/g,
      join: /\.join\s*\(/g,
      pivot: /\.pivot\s*\(/g,
      melt: /\.melt\s*\(/g,
      
      // Column access: df["column"] or df.column
      columnAccess: /(\w+)\[["']([^"']+)["']\]|(\w+)\.([a-z_]\w*)/g
    },
    
    // Async/concurrent patterns
    asyncPatterns: {
      // Async function: async fun name() -> T
      asyncFunction: /\basync\s+fun\s+(\w+)/g,
      
      // Await expression: expr.await
      awaitExpression: /(\w+(?:\([^)]*\))?(?:\.\w+\([^)]*\))*)\.await/g,
      
      // Async block: async { ... }
      asyncBlock: /\basync\s*\{/g,
      
      // Join operation: join!(future1, future2)
      joinMacro: /\bjoin!\s*\([^)]*\)/g,
      
      // Select operation: select! { ... }
      selectMacro: /\bselect!\s*\{/g,
      
      // Tokio spawn: tokio::spawn(async { ... })
      tokioSpawn: /\btokio::spawn\s*\(/g
    },
    
    // Error handling patterns
    errorPatterns: {
      // Result type: Result<T, E>
      resultType: /\bResult\s*<([^,>]+),\s*([^>]+)>/g,
      
      // Option type: Option<T>
      optionType: /\bOption\s*<([^>]+)>/g,
      
      // Question mark operator: expr?
      questionMark: /(\w+(?:\([^)]*\))?(?:\.\w+\([^)]*\))*)\?/g,
      
      // Unwrap operations
      unwrap: /\.unwrap\(\)/g,
      unwrapOr: /\.unwrap_or\([^)]*\)/g,
      unwrapOrElse: /\.unwrap_or_else\([^)]*\)/g,
      expect: /\.expect\([^)]*\)/g,
      
      // Match on Result/Option
      okPattern: /\bOk\s*\(/g,
      errPattern: /\bErr\s*\(/g,
      somePattern: /\bSome\s*\(/g,
      nonePattern: /\bNone\b/g
    },
    
    // Memory management patterns
    memoryPatterns: {
      // Box allocation: Box::new(value)
      boxNew: /\bBox::new\s*\(/g,
      
      // Reference counting: Rc::new(value), Arc::new(value)
      rcNew: /\bRc::new\s*\(/g,
      arcNew: /\bArc::new\s*\(/g,
      
      // Cell types
      cellNew: /\bCell::new\s*\(/g,
      refCellNew: /\bRefCell::new\s*\(/g,
      
      // Mutex/RwLock
      mutexNew: /\bMutex::new\s*\(/g,
      rwLockNew: /\bRwLock::new\s*\(/g,
      
      // Clone operation
      cloneOp: /\.clone\(\)/g,
      
      // Drop trait
      dropImpl: /\bimpl\s+Drop\s+for\s+/g
    },
    
    // Type system patterns
    typePatterns: {
      // Generic constraints: where T: Trait
      whereClause: /\bwhere\s+([^{]+)/g,
      
      // Trait bounds: T: Display + Debug
      traitBounds: /(\w+)\s*:\s*([A-Z]\w+(?:\s*\+\s*[A-Z]\w+)*)/g,
      
      // Associated types: type Item = T
      associatedType: /\btype\s+(\w+)\s*=\s*([^;]+)/g,
      
      // Impl blocks: impl Trait for Type
      implBlock: /\bimpl(?:\s*<[^>]+>)?\s+(?:(\w+)\s+for\s+)?(\w+)/g,
      
      // Lifetime annotations: 'a, 'static
      lifetimeAnnotation: /'[a-z]\w*|'static/g,
      
      // Phantom data: PhantomData<T>
      phantomData: /\bPhantomData\s*<[^>]+>/g
    },
    
    // Macro patterns
    macroPatterns: {
      // Declarative macro: macro_rules! name { ... }
      macroRules: /\bmacro_rules!\s+(\w+)\s*\{/g,
      
      // Procedural macro attributes
      deriveAttr: /#\[derive\([^)]+\)\]/g,
      
      // Common derives
      commonDerives: /\b(Debug|Clone|Copy|PartialEq|Eq|Hash|Default|Serialize|Deserialize)\b/g,
      
      // Format macros
      formatMacros: /\b(format|print|println|eprint|eprintln|write|writeln)!\s*\(/g,
      
      // Assert macros
      assertMacros: /\b(assert|assert_eq|assert_ne|debug_assert|debug_assert_eq|debug_assert_ne)!\s*\(/g,
      
      // Panic macros
      panicMacros: /\b(panic|todo|unimplemented|unreachable)!\s*\(/g
    },
    
    // Module system patterns
    modulePatterns: {
      // Use statements: use std::collections::HashMap
      useStatement: /\buse\s+([^;]+)/g,
      
      // Module declaration: mod name
      modDeclaration: /\bmod\s+(\w+)/g,
      
      // Pub visibility: pub fn, pub struct, etc.
      pubVisibility: /\bpub(?:\s*\(([^)]+)\))?\s+(fn|struct|enum|trait|type|const|static|mod)\s+/g,
      
      // Crate references: crate::module::item
      crateRef: /\bcrate::[a-z_][\w:]*/g,
      
      // Super references: super::item
      superRef: /\bsuper::[a-z_][\w:]*/g,
      
      // Self references: self::item
      selfRef: /\bself::[a-z_][\w:]*/g
    },
    
    // Testing patterns
    testPatterns: {
      // Test attribute: #[test]
      testAttr: /#\[test\]/g,
      
      // Test module: #[cfg(test)]
      testModule: /#\[cfg\(test\)\]/g,
      
      // Bench attribute: #[bench]
      benchAttr: /#\[bench\]/g,
      
      // Should panic: #[should_panic]
      shouldPanic: /#\[should_panic(?:\([^)]*\))?\]/g,
      
      // Ignore test: #[ignore]
      ignoreTest: /#\[ignore\]/g
    },
    
    // Unsafe patterns
    unsafePatterns: {
      // Unsafe block: unsafe { ... }
      unsafeBlock: /\bunsafe\s*\{/g,
      
      // Unsafe function: unsafe fn
      unsafeFn: /\bunsafe\s+fn\s+/g,
      
      // Unsafe trait: unsafe trait
      unsafeTrait: /\bunsafe\s+trait\s+/g,
      
      // Unsafe impl: unsafe impl
      unsafeImpl: /\bunsafe\s+impl\s+/g,
      
      // Raw pointers: *const T, *mut T
      rawPointers: /\*(?:const|mut)\s+\w+/g
    }
  };

  /**
   * Apply Ruchy-specific highlighting to code blocks
   */
  function applyRuchyPatterns(codeElement) {
    if (codeElement.dataset.ruchyPatterns === 'true') {
      return; // Already processed
    }
    
    let html = codeElement.innerHTML;
    
    // Apply actor patterns
    html = highlightActorPatterns(html);
    
    // Apply DataFrame patterns
    html = highlightDataFramePatterns(html);
    
    // Apply async patterns
    html = highlightAsyncPatterns(html);
    
    // Apply error handling patterns
    html = highlightErrorPatterns(html);
    
    // Apply memory management patterns
    html = highlightMemoryPatterns(html);
    
    // Apply type system patterns
    html = highlightTypePatterns(html);
    
    // Apply macro patterns
    html = highlightMacroPatterns(html);
    
    // Apply module patterns
    html = highlightModulePatterns(html);
    
    // Apply testing patterns
    html = highlightTestPatterns(html);
    
    // Apply unsafe patterns
    html = highlightUnsafePatterns(html);
    
    codeElement.innerHTML = html;
    codeElement.dataset.ruchyPatterns = 'true';
  }

  /**
   * Highlight actor patterns
   */
  function highlightActorPatterns(html) {
    const patterns = RuchySpecificPatterns.actorPatterns;
    
    // Actor definitions
    html = html.replace(patterns.actorDefinition, 
      '<span class="ruchy-actor-keyword">actor</span> <span class="ruchy-actor-name">$1</span> {');
    
    // Message definitions
    html = html.replace(patterns.messageDefinition,
      '<span class="ruchy-message-keyword">message</span> <span class="ruchy-message-name">$1</span> {');
    
    // Send operations
    html = html.replace(patterns.sendOperation,
      '<span class="ruchy-actor-var">$1</span>.<span class="ruchy-actor-method">send</span>(');
    
    // Ask operations
    html = html.replace(patterns.askOperation,
      '<span class="ruchy-actor-var">$1</span>.<span class="ruchy-actor-method">ask</span>$2.<span class="ruchy-async-keyword">await</span>');
    
    // Receive blocks
    html = html.replace(patterns.receiveBlock,
      '<span class="ruchy-actor-keyword">receive</span> {');
    
    // Spawn operations
    html = html.replace(patterns.spawnOperation,
      '<span class="ruchy-actor-function">spawn</span>(');
    
    return html;
  }

  /**
   * Highlight DataFrame patterns
   */
  function highlightDataFramePatterns(html) {
    const patterns = RuchySpecificPatterns.dataFramePatterns;
    
    // DataFrame literals
    html = html.replace(patterns.dataFrameLiteral,
      '<span class="ruchy-df-macro">df!</span>[<span class="ruchy-df-content">$1</span>]');
    
    // Series literals
    html = html.replace(patterns.seriesLiteral,
      '<span class="ruchy-df-macro">series!</span>[<span class="ruchy-df-content">$1</span>]');
    
    // DataFrame operations
    const ops = ['select', 'filter', 'group_by', 'agg', 'join', 'pivot', 'melt'];
    ops.forEach(op => {
      const pattern = new RegExp(`\\.${op}\\s*\\(`, 'g');
      html = html.replace(pattern,
        `.<span class="ruchy-df-method">${op}</span>(`);
    });
    
    return html;
  }

  /**
   * Highlight async patterns
   */
  function highlightAsyncPatterns(html) {
    const patterns = RuchySpecificPatterns.asyncPatterns;
    
    // Async functions
    html = html.replace(patterns.asyncFunction,
      '<span class="ruchy-async-keyword">async</span> <span class="ruchy-keyword">fun</span> <span class="ruchy-function-name">$1</span>');
    
    // Await expressions
    html = html.replace(patterns.awaitExpression,
      '$1.<span class="ruchy-async-keyword">await</span>');
    
    // Async blocks
    html = html.replace(patterns.asyncBlock,
      '<span class="ruchy-async-keyword">async</span> {');
    
    // Join macro
    html = html.replace(patterns.joinMacro,
      '<span class="ruchy-async-macro">join!</span>$1');
    
    // Select macro
    html = html.replace(patterns.selectMacro,
      '<span class="ruchy-async-macro">select!</span> {');
    
    return html;
  }

  /**
   * Highlight error handling patterns
   */
  function highlightErrorPatterns(html) {
    const patterns = RuchySpecificPatterns.errorPatterns;
    
    // Result type
    html = html.replace(patterns.resultType,
      '<span class="ruchy-result-type">Result</span>&lt;<span class="ruchy-type-param">$1</span>, <span class="ruchy-error-type">$2</span>&gt;');
    
    // Option type
    html = html.replace(patterns.optionType,
      '<span class="ruchy-option-type">Option</span>&lt;<span class="ruchy-type-param">$1</span>&gt;');
    
    // Question mark operator
    html = html.replace(patterns.questionMark,
      '$1<span class="ruchy-question-mark">?</span>');
    
    // Result/Option variants
    html = html.replace(patterns.okPattern,
      '<span class="ruchy-ok-variant">Ok</span>(');
    html = html.replace(patterns.errPattern,
      '<span class="ruchy-err-variant">Err</span>(');
    html = html.replace(patterns.somePattern,
      '<span class="ruchy-some-variant">Some</span>(');
    html = html.replace(patterns.nonePattern,
      '<span class="ruchy-none-variant">None</span>');
    
    return html;
  }

  /**
   * Highlight memory management patterns
   */
  function highlightMemoryPatterns(html) {
    const patterns = RuchySpecificPatterns.memoryPatterns;
    
    // Smart pointers
    html = html.replace(patterns.boxNew,
      '<span class="ruchy-smart-pointer">Box</span>::<span class="ruchy-constructor">new</span>(');
    html = html.replace(patterns.rcNew,
      '<span class="ruchy-smart-pointer">Rc</span>::<span class="ruchy-constructor">new</span>(');
    html = html.replace(patterns.arcNew,
      '<span class="ruchy-smart-pointer">Arc</span>::<span class="ruchy-constructor">new</span>(');
    
    // Cell types
    html = html.replace(patterns.cellNew,
      '<span class="ruchy-cell-type">Cell</span>::<span class="ruchy-constructor">new</span>(');
    html = html.replace(patterns.refCellNew,
      '<span class="ruchy-cell-type">RefCell</span>::<span class="ruchy-constructor">new</span>(');
    
    // Synchronization primitives
    html = html.replace(patterns.mutexNew,
      '<span class="ruchy-sync-type">Mutex</span>::<span class="ruchy-constructor">new</span>(');
    html = html.replace(patterns.rwLockNew,
      '<span class="ruchy-sync-type">RwLock</span>::<span class="ruchy-constructor">new</span>(');
    
    // Clone operation
    html = html.replace(patterns.cloneOp,
      '.<span class="ruchy-clone-method">clone</span>()');
    
    return html;
  }

  /**
   * Highlight type system patterns
   */
  function highlightTypePatterns(html) {
    const patterns = RuchySpecificPatterns.typePatterns;
    
    // Where clauses
    html = html.replace(patterns.whereClause,
      '<span class="ruchy-where-keyword">where</span> <span class="ruchy-where-clause">$1</span>');
    
    // Impl blocks
    html = html.replace(patterns.implBlock, function(match, trait, type) {
      if (trait) {
        return `<span class="ruchy-impl-keyword">impl</span> <span class="ruchy-trait-name">${trait}</span> <span class="ruchy-for-keyword">for</span> <span class="ruchy-type-name">${type}</span>`;
      } else {
        return `<span class="ruchy-impl-keyword">impl</span> <span class="ruchy-type-name">${type}</span>`;
      }
    });
    
    // Lifetime annotations
    html = html.replace(patterns.lifetimeAnnotation,
      '<span class="ruchy-lifetime">$&</span>');
    
    return html;
  }

  /**
   * Highlight macro patterns
   */
  function highlightMacroPatterns(html) {
    const patterns = RuchySpecificPatterns.macroPatterns;
    
    // Macro rules
    html = html.replace(patterns.macroRules,
      '<span class="ruchy-macro-keyword">macro_rules!</span> <span class="ruchy-macro-name">$1</span> {');
    
    // Derive attributes
    html = html.replace(patterns.deriveAttr,
      '<span class="ruchy-derive-attr">$&</span>');
    
    // Format macros
    html = html.replace(patterns.formatMacros,
      '<span class="ruchy-format-macro">$1!</span>(');
    
    // Assert macros
    html = html.replace(patterns.assertMacros,
      '<span class="ruchy-assert-macro">$1!</span>(');
    
    // Panic macros
    html = html.replace(patterns.panicMacros,
      '<span class="ruchy-panic-macro">$1!</span>(');
    
    return html;
  }

  /**
   * Highlight module patterns
   */
  function highlightModulePatterns(html) {
    const patterns = RuchySpecificPatterns.modulePatterns;
    
    // Use statements
    html = html.replace(patterns.useStatement,
      '<span class="ruchy-use-keyword">use</span> <span class="ruchy-module-path">$1</span>');
    
    // Module declarations
    html = html.replace(patterns.modDeclaration,
      '<span class="ruchy-mod-keyword">mod</span> <span class="ruchy-module-name">$1</span>');
    
    // Pub visibility
    html = html.replace(patterns.pubVisibility, function(match, restriction, item) {
      if (restriction) {
        return `<span class="ruchy-pub-keyword">pub</span>(<span class="ruchy-pub-restriction">${restriction}</span>) <span class="ruchy-item-keyword">${item}</span> `;
      } else {
        return `<span class="ruchy-pub-keyword">pub</span> <span class="ruchy-item-keyword">${item}</span> `;
      }
    });
    
    return html;
  }

  /**
   * Highlight testing patterns
   */
  function highlightTestPatterns(html) {
    const patterns = RuchySpecificPatterns.testPatterns;
    
    // Test attributes
    html = html.replace(patterns.testAttr,
      '<span class="ruchy-test-attr">#[test]</span>');
    
    // Test module
    html = html.replace(patterns.testModule,
      '<span class="ruchy-test-attr">#[cfg(test)]</span>');
    
    // Bench attribute
    html = html.replace(patterns.benchAttr,
      '<span class="ruchy-test-attr">#[bench]</span>');
    
    // Should panic
    html = html.replace(patterns.shouldPanic,
      '<span class="ruchy-test-attr">$&</span>');
    
    return html;
  }

  /**
   * Highlight unsafe patterns
   */
  function highlightUnsafePatterns(html) {
    const patterns = RuchySpecificPatterns.unsafePatterns;
    
    // Unsafe blocks
    html = html.replace(patterns.unsafeBlock,
      '<span class="ruchy-unsafe-keyword">unsafe</span> {');
    
    // Unsafe functions
    html = html.replace(patterns.unsafeFn,
      '<span class="ruchy-unsafe-keyword">unsafe</span> <span class="ruchy-keyword">fn</span> ');
    
    // Unsafe trait
    html = html.replace(patterns.unsafeTrait,
      '<span class="ruchy-unsafe-keyword">unsafe</span> <span class="ruchy-keyword">trait</span> ');
    
    // Unsafe impl
    html = html.replace(patterns.unsafeImpl,
      '<span class="ruchy-unsafe-keyword">unsafe</span> <span class="ruchy-keyword">impl</span> ');
    
    // Raw pointers
    html = html.replace(patterns.rawPointers,
      '<span class="ruchy-raw-pointer">$&</span>');
    
    return html;
  }

  /**
   * Process all code blocks
   */
  function processCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code.language-ruchy, pre code.language-ruc');
    
    codeBlocks.forEach(codeBlock => {
      applyRuchyPatterns(codeBlock);
    });
  }

  /**
   * Initialize Ruchy pattern highlighting
   */
  function initialize() {
    // Process existing code blocks
    processCodeBlocks();
    
    // Watch for new content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          setTimeout(processCodeBlocks, 200); // Delay to let other highlighters run first
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