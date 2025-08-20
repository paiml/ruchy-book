/**
 * Theme Optimizer for Ruchy Book
 * Provides adaptive contrast, readability enhancements, and accessibility features
 */

(function() {
  'use strict';

  const ThemeOptimizer = {
    // Contrast ratios for WCAG AAA compliance
    MIN_CONTRAST_RATIO: 7.0,
    MIN_CONTRAST_RATIO_LARGE: 4.5,
    
    // Theme configurations
    themes: {
      light: {
        name: 'light',
        background: '#ffffff',
        foreground: '#000000',
        codeBackground: '#f6f8fa',
        lineNumberBg: '#f0f3f6',
        selectionBg: 'rgba(0, 123, 255, 0.15)',
        scrollbarBg: 'rgba(0, 0, 0, 0.1)',
        scrollbarThumb: 'rgba(0, 0, 0, 0.3)'
      },
      rust: {
        name: 'rust',
        background: '#fdf6e3',
        foreground: '#657b83',
        codeBackground: '#fdf6e3',
        lineNumberBg: '#eee8d5',
        selectionBg: 'rgba(38, 139, 210, 0.15)',
        scrollbarBg: 'rgba(101, 123, 131, 0.1)',
        scrollbarThumb: 'rgba(101, 123, 131, 0.3)'
      },
      coal: {
        name: 'coal',
        background: '#292c3e',
        foreground: '#a1adb8',
        codeBackground: '#1e2127',
        lineNumberBg: '#171a1f',
        selectionBg: 'rgba(66, 165, 245, 0.2)',
        scrollbarBg: 'rgba(255, 255, 255, 0.1)',
        scrollbarThumb: 'rgba(255, 255, 255, 0.3)'
      },
      navy: {
        name: 'navy',
        background: '#161923',
        foreground: '#bcbcbc',
        codeBackground: '#0f1419',
        lineNumberBg: '#0b0e14',
        selectionBg: 'rgba(33, 150, 243, 0.2)',
        scrollbarBg: 'rgba(255, 255, 255, 0.1)',
        scrollbarThumb: 'rgba(255, 255, 255, 0.3)'
      },
      ayu: {
        name: 'ayu',
        background: '#0f1419',
        foreground: '#c5c5c5',
        codeBackground: '#191f26',
        lineNumberBg: '#14191f',
        selectionBg: 'rgba(255, 152, 0, 0.2)',
        scrollbarBg: 'rgba(255, 255, 255, 0.1)',
        scrollbarThumb: 'rgba(255, 255, 255, 0.3)'
      }
    },
    
    /**
     * Initialize theme optimizer
     */
    init() {
      this.detectTheme();
      this.optimizeContrast();
      this.enhanceReadability();
      this.setupAccessibility();
      this.watchThemeChanges();
    },
    
    /**
     * Detect current theme
     */
    detectTheme() {
      const bodyClasses = document.body.className;
      for (const [key, theme] of Object.entries(this.themes)) {
        if (bodyClasses.includes(theme.name)) {
          this.currentTheme = theme;
          return theme;
        }
      }
      this.currentTheme = this.themes.light;
      return this.themes.light;
    },
    
    /**
     * Calculate contrast ratio between two colors
     */
    getContrastRatio(color1, color2) {
      const rgb1 = this.hexToRgb(color1);
      const rgb2 = this.hexToRgb(color2);
      
      const l1 = this.getRelativeLuminance(rgb1);
      const l2 = this.getRelativeLuminance(rgb2);
      
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      
      return (lighter + 0.05) / (darker + 0.05);
    },
    
    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
      if (hex.startsWith('rgba')) {
        const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3])
        } : { r: 0, g: 0, b: 0 };
      }
      
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    },
    
    /**
     * Calculate relative luminance
     */
    getRelativeLuminance(rgb) {
      const { r, g, b } = rgb;
      const sRGB = [r, g, b].map(val => {
        val = val / 255;
        return val <= 0.03928
          ? val / 12.92
          : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    },
    
    /**
     * Optimize contrast for current theme
     */
    optimizeContrast() {
      const theme = this.currentTheme;
      const style = document.createElement('style');
      style.id = 'theme-contrast-optimizer';
      
      // Remove existing optimizer styles
      const existing = document.getElementById('theme-contrast-optimizer');
      if (existing) existing.remove();
      
      const isDark = ['coal', 'navy', 'ayu'].includes(theme.name);
      
      style.textContent = `
        /* Optimized contrast for ${theme.name} theme */
        
        /* Ensure sufficient contrast for code comments */
        .hljs-comment,
        .hljs-quote,
        .sem-comment {
          opacity: ${isDark ? '0.8' : '0.7'};
          filter: ${isDark ? 'brightness(1.3)' : 'brightness(0.8)'};
        }
        
        /* Enhance visibility of line numbers */
        .line-number {
          opacity: ${isDark ? '0.6' : '0.5'};
          font-weight: ${isDark ? '500' : '400'};
        }
        
        /* Improve selection visibility */
        ::selection {
          background-color: ${theme.selectionBg};
          color: ${isDark ? '#ffffff' : '#000000'};
        }
        
        /* Optimize link contrast */
        a {
          text-decoration-thickness: ${isDark ? '2px' : '1px'};
          text-underline-offset: 2px;
        }
        
        /* Enhance focus indicators */
        :focus {
          outline: 3px solid ${isDark ? '#4fc1ff' : '#0066cc'};
          outline-offset: 2px;
        }
        
        /* Code block optimizations */
        pre code {
          background: ${theme.codeBackground};
          box-shadow: ${isDark 
            ? 'inset 0 1px 3px rgba(0, 0, 0, 0.3)' 
            : 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'};
        }
        
        /* Scrollbar optimization */
        pre::-webkit-scrollbar-track {
          background: ${theme.scrollbarBg};
        }
        
        pre::-webkit-scrollbar-thumb {
          background: ${theme.scrollbarThumb};
        }
      `;
      
      document.head.appendChild(style);
    },
    
    /**
     * Enhance readability with typography adjustments
     */
    enhanceReadability() {
      const style = document.createElement('style');
      style.id = 'readability-enhancements';
      
      // Remove existing readability styles
      const existing = document.getElementById('readability-enhancements');
      if (existing) existing.remove();
      
      const isDark = ['coal', 'navy', 'ayu'].includes(this.currentTheme.name);
      
      style.textContent = `
        /* Readability enhancements */
        
        /* Optimize line height for code blocks */
        pre code {
          line-height: ${isDark ? '1.6' : '1.5'};
          letter-spacing: ${isDark ? '0.3px' : '0'};
        }
        
        /* Improve font rendering */
        code, pre {
          -webkit-font-smoothing: ${isDark ? 'antialiased' : 'auto'};
          -moz-osx-font-smoothing: ${isDark ? 'grayscale' : 'auto'};
          text-rendering: optimizeLegibility;
        }
        
        /* Add subtle text shadow for dark themes */
        ${isDark ? `
        .content {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        pre code {
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        }
        ` : ''}
        
        /* Optimize syntax highlighting colors */
        .hljs-keyword,
        .sem-control-flow {
          font-weight: ${isDark ? '600' : '700'};
        }
        
        .hljs-string,
        .sem-string {
          ${isDark 
            ? 'filter: brightness(1.1) saturate(1.2);' 
            : 'filter: brightness(0.95) saturate(1.1);'}
        }
        
        /* Reduce eye strain with softer colors */
        ${isDark ? `
        .hljs-number,
        .sem-number {
          filter: hue-rotate(-10deg) brightness(1.1);
        }
        ` : `
        .hljs-number,
        .sem-number {
          filter: hue-rotate(5deg) brightness(0.9);
        }
        `}
        
        /* Add breathing room */
        pre {
          padding: 1.25em;
          margin: 1.5em 0;
        }
        
        /* Improve inline code visibility */
        :not(pre) > code {
          padding: 0.2em 0.4em;
          border-radius: 3px;
          background: ${isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)'};
          border: 1px solid ${isDark 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.1)'};
        }
      `;
      
      document.head.appendChild(style);
    },
    
    /**
     * Setup accessibility features
     */
    setupAccessibility() {
      // Add ARIA labels to code blocks
      document.querySelectorAll('pre code').forEach((code, index) => {
        code.setAttribute('role', 'region');
        code.setAttribute('aria-label', `Code block ${index + 1}`);
        code.setAttribute('tabindex', '0');
      });
      
      // Add keyboard navigation for code blocks
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'CODE' && e.target.parentElement.tagName === 'PRE') {
          const codeBlock = e.target;
          
          // Ctrl/Cmd + A to select all
          if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            const range = document.createRange();
            range.selectNodeContents(codeBlock);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
          
          // Escape to exit focus
          if (e.key === 'Escape') {
            codeBlock.blur();
          }
        }
      });
      
      // Add high contrast mode toggle
      this.setupHighContrastToggle();
      
      // Add font size controls
      this.setupFontSizeControls();
    },
    
    /**
     * Setup high contrast mode toggle
     */
    setupHighContrastToggle() {
      const button = document.createElement('button');
      button.id = 'high-contrast-toggle';
      button.innerHTML = '👁️';
      button.title = 'Toggle high contrast mode';
      button.setAttribute('aria-label', 'Toggle high contrast mode');
      button.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(128, 128, 128, 0.2);
        border: 2px solid rgba(128, 128, 128, 0.3);
        cursor: pointer;
        z-index: 1000;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      `;
      
      button.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        this.applyHighContrast(document.body.classList.contains('high-contrast'));
      });
      
      document.body.appendChild(button);
    },
    
    /**
     * Apply high contrast mode
     */
    applyHighContrast(enabled) {
      const style = document.getElementById('high-contrast-style') || document.createElement('style');
      style.id = 'high-contrast-style';
      
      if (enabled) {
        const isDark = ['coal', 'navy', 'ayu'].includes(this.currentTheme.name);
        
        style.textContent = `
          /* High contrast mode */
          .high-contrast {
            filter: contrast(1.3) saturate(0.8);
          }
          
          .high-contrast code,
          .high-contrast pre {
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          
          .high-contrast .hljs-keyword,
          .high-contrast .sem-control-flow {
            text-decoration: underline;
            text-decoration-thickness: 2px;
          }
          
          .high-contrast a {
            text-decoration: underline !important;
            text-decoration-thickness: 3px !important;
          }
          
          .high-contrast :focus {
            outline-width: 4px !important;
            outline-style: solid !important;
            outline-color: ${isDark ? '#ffff00' : '#0000ff'} !important;
          }
        `;
        
        if (!document.getElementById('high-contrast-style')) {
          document.head.appendChild(style);
        }
      } else {
        style.remove();
      }
    },
    
    /**
     * Setup font size controls
     */
    setupFontSizeControls() {
      const container = document.createElement('div');
      container.id = 'font-size-controls';
      container.style.cssText = `
        position: fixed;
        bottom: 130px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 1000;
      `;
      
      const sizes = [
        { label: 'A-', scale: 0.9, title: 'Decrease font size' },
        { label: 'A', scale: 1.0, title: 'Reset font size' },
        { label: 'A+', scale: 1.1, title: 'Increase font size' }
      ];
      
      sizes.forEach(size => {
        const button = document.createElement('button');
        button.innerHTML = size.label;
        button.title = size.title;
        button.setAttribute('aria-label', size.title);
        button.style.cssText = `
          width: 40px;
          height: 30px;
          border-radius: 5px;
          background: rgba(128, 128, 128, 0.2);
          border: 2px solid rgba(128, 128, 128, 0.3);
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        `;
        
        button.addEventListener('click', () => {
          document.querySelectorAll('pre code').forEach(code => {
            code.style.fontSize = `${14 * size.scale}px`;
          });
        });
        
        container.appendChild(button);
      });
      
      document.body.appendChild(container);
    },
    
    /**
     * Watch for theme changes
     */
    watchThemeChanges() {
      const observer = new MutationObserver(() => {
        const newTheme = this.detectTheme();
        if (newTheme.name !== this.currentTheme.name) {
          this.currentTheme = newTheme;
          this.optimizeContrast();
          this.enhanceReadability();
        }
      });
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeOptimizer.init());
  } else {
    ThemeOptimizer.init();
  }
})();