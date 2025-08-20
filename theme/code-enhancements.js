/**
 * Enhanced Code Block Features for Ruchy Book
 * Adds line numbers, enhanced copy buttons, and syntax validation
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    enableLineNumbers: true,
    enableEnhancedCopy: true,
    enableSyntaxValidation: true,
    enableRunButton: true,
    ruchyKeywords: new Set([
      'actor', 'as', 'async', 'await', 'break', 'const', 'continue', 
      'defer', 'else', 'enum', 'false', 'for', 'fun', 'guard', 'if', 
      'impl', 'import', 'in', 'let', 'loop', 'match', 'mod', 'mut', 
      'pub', 'return', 'self', 'Self', 'static', 'struct', 'super', 
      'trait', 'true', 'type', 'use', 'where', 'while'
    ])
  };

  /**
   * Add line numbers to code blocks
   */
  function addLineNumbers(codeBlock) {
    const lines = codeBlock.textContent.split('\n');
    if (lines.length <= 1) return;

    const lineNumbersDiv = document.createElement('div');
    lineNumbersDiv.className = 'line-numbers';
    
    for (let i = 1; i <= lines.length; i++) {
      const lineNumber = document.createElement('span');
      lineNumber.className = 'line-number';
      lineNumber.textContent = i;
      lineNumbersDiv.appendChild(lineNumber);
    }

    const wrapper = codeBlock.parentElement;
    wrapper.style.position = 'relative';
    wrapper.insertBefore(lineNumbersDiv, codeBlock);
    codeBlock.classList.add('has-line-numbers');
  }

  /**
   * Enhanced copy button with feedback
   */
  function enhanceCopyButton(button) {
    const originalText = button.innerHTML;
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const codeBlock = this.parentElement.querySelector('code');
      const text = codeBlock.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        // Success feedback
        this.innerHTML = '✓ Copied!';
        this.classList.add('copy-success');
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.classList.remove('copy-success');
        }, 2000);
      }).catch(err => {
        // Error feedback
        this.innerHTML = '✗ Failed';
        this.classList.add('copy-error');
        console.error('Copy failed:', err);
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.classList.remove('copy-error');
        }, 2000);
      });
    });
  }

  /**
   * Add run button for Ruchy code blocks
   */
  function addRunButton(codeBlock) {
    const wrapper = codeBlock.parentElement;
    
    const runButton = document.createElement('button');
    runButton.className = 'run-button';
    runButton.innerHTML = '▶ Run';
    runButton.title = 'Run this code (opens in Ruchy playground)';
    
    runButton.addEventListener('click', function() {
      const code = codeBlock.textContent;
      // Encode the code for URL
      const encodedCode = encodeURIComponent(code);
      // Open in Ruchy playground (when available)
      const playgroundUrl = `https://play.ruchy.org/?code=${encodedCode}`;
      window.open(playgroundUrl, '_blank');
    });
    
    wrapper.appendChild(runButton);
  }

  /**
   * Validate Ruchy syntax and add indicators
   */
  function validateSyntax(codeBlock) {
    const code = codeBlock.textContent;
    const lines = code.split('\n');
    const issues = [];
    
    lines.forEach((line, index) => {
      // Check for common syntax issues
      
      // Missing semicolons (simplified check)
      if (line.trim().startsWith('let ') && !line.trim().endsWith(';') && !line.trim().endsWith('{')) {
        issues.push({
          line: index + 1,
          type: 'warning',
          message: 'Missing semicolon'
        });
      }
      
      // Unmatched brackets (simplified)
      const openBrackets = (line.match(/[\[{(]/g) || []).length;
      const closeBrackets = (line.match(/[\]})/]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        issues.push({
          line: index + 1,
          type: 'info',
          message: 'Check bracket matching'
        });
      }
    });
    
    // Add validation indicators
    if (issues.length > 0) {
      const validationDiv = document.createElement('div');
      validationDiv.className = 'syntax-validation';
      
      issues.forEach(issue => {
        const indicator = document.createElement('div');
        indicator.className = `syntax-${issue.type}`;
        indicator.setAttribute('data-line', issue.line);
        indicator.title = `Line ${issue.line}: ${issue.message}`;
        validationDiv.appendChild(indicator);
      });
      
      codeBlock.parentElement.appendChild(validationDiv);
    }
  }

  /**
   * Add metadata display for code blocks
   */
  function addMetadata(codeBlock) {
    const wrapper = codeBlock.parentElement;
    const language = codeBlock.className.match(/language-(\w+)/)?.[1] || 'code';
    
    const metadata = document.createElement('div');
    metadata.className = 'code-metadata';
    
    // Language badge
    const langBadge = document.createElement('span');
    langBadge.className = 'language-badge';
    langBadge.textContent = language;
    metadata.appendChild(langBadge);
    
    // Line count
    const lineCount = codeBlock.textContent.split('\n').length;
    const linesBadge = document.createElement('span');
    linesBadge.className = 'lines-badge';
    linesBadge.textContent = `${lineCount} lines`;
    metadata.appendChild(linesBadge);
    
    // Character count
    const charCount = codeBlock.textContent.length;
    const charsBadge = document.createElement('span');
    charsBadge.className = 'chars-badge';
    charsBadge.textContent = `${charCount} chars`;
    metadata.appendChild(charsBadge);
    
    wrapper.appendChild(metadata);
  }

  /**
   * Highlight active line on hover
   */
  function addLineHighlighting(codeBlock) {
    const lines = codeBlock.innerHTML.split('\n');
    const wrappedLines = lines.map((line, index) => {
      return `<span class="code-line" data-line="${index + 1}">${line}</span>`;
    });
    codeBlock.innerHTML = wrappedLines.join('\n');
    
    // Add hover effect
    codeBlock.addEventListener('mouseover', function(e) {
      if (e.target.classList.contains('code-line')) {
        // Remove previous highlights
        this.querySelectorAll('.code-line.highlight').forEach(line => {
          line.classList.remove('highlight');
        });
        // Add highlight to current line
        e.target.classList.add('highlight');
      }
    });
    
    codeBlock.addEventListener('mouseout', function() {
      this.querySelectorAll('.code-line.highlight').forEach(line => {
        line.classList.remove('highlight');
      });
    });
  }

  /**
   * Process all code blocks on the page
   */
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
      // Skip if already enhanced
      if (codeBlock.dataset.enhanced === 'true') return;
      
      const language = codeBlock.className.match(/language-(\w+)/)?.[1];
      
      // Only enhance Ruchy code blocks with all features
      if (language === 'ruchy' || language === 'ruc') {
        if (CONFIG.enableLineNumbers) {
          addLineNumbers(codeBlock);
        }
        
        if (CONFIG.enableRunButton) {
          addRunButton(codeBlock);
        }
        
        if (CONFIG.enableSyntaxValidation) {
          validateSyntax(codeBlock);
        }
        
        addLineHighlighting(codeBlock);
      }
      
      // Add metadata to all code blocks
      addMetadata(codeBlock);
      
      // Enhance copy buttons for all code blocks
      const copyButton = codeBlock.parentElement.querySelector('.copy-button');
      if (copyButton && CONFIG.enableEnhancedCopy) {
        enhanceCopyButton(copyButton);
      }
      
      // Mark as enhanced
      codeBlock.dataset.enhanced = 'true';
    });
  }

  /**
   * Initialize enhancements when DOM is ready
   */
  function initialize() {
    // Initial enhancement
    enhanceCodeBlocks();
    
    // Re-enhance when new content is loaded (for dynamic content)
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          enhanceCodeBlocks();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();