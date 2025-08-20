# Editor Integration Guide for Ruchy Syntax Highlighter

This chapter provides comprehensive guidance on integrating the Ruchy syntax highlighter into various editors and development environments.

## Table of Contents
- [Overview](#overview)
- [Visual Studio Code](#visual-studio-code)
- [Neovim/Vim](#neovimvim)
- [Sublime Text](#sublime-text)
- [Atom](#atom)
- [IntelliJ IDEA](#intellij-idea)
- [Monaco Editor (Web)](#monaco-editor-web)
- [CodeMirror (Web)](#codemirror-web)
- [Terminal/REPL Integration](#terminalrepl-integration)

## Overview

The Ruchy syntax highlighter is designed as a modular system that can be integrated into various editors through different approaches:

1. **Language Server Protocol (LSP)** - For semantic highlighting
2. **TextMate Grammars** - For basic syntax highlighting
3. **Native Extensions** - For full-featured integration
4. **Web Components** - For browser-based editors

## Visual Studio Code

### Option 1: TextMate Grammar (Basic)

Create a VS Code extension with TextMate grammar support:

```json
// package.json
{
  "name": "ruchy-vscode",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.74.0"
  },
  "contributes": {
    "languages": [{
      "id": "ruchy",
      "aliases": ["Ruchy", "ruchy"],
      "extensions": [".ruchy", ".rcy"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "ruchy",
      "scopeName": "source.ruchy",
      "path": "./syntaxes/ruchy.tmLanguage.json"
    }]
  }
}
```

### Option 2: Language Server (Advanced)

Implement a Language Server for semantic highlighting:

```typescript
// server.ts
import { 
  createConnection,
  TextDocuments,
  SemanticTokensBuilder
} from 'vscode-languageserver/node';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

const connection = createConnection();
const documents = new TextDocuments();
const highlighter = new RuchySyntaxHighlighter();

connection.onRequest('textDocument/semanticTokens/full', (params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  
  const result = highlighter.highlight(document.getText());
  const builder = new SemanticTokensBuilder();
  
  for (const token of result.tokens) {
    builder.push(
      token.line - 1,
      token.column - 1,
      token.value.length,
      mapTokenType(token.type),
      0
    );
  }
  
  return builder.build();
});
```

### Option 3: WebView Integration

For rich highlighting features in VS Code:

```typescript
// extension.ts
import * as vscode from 'vscode';
import { highlight } from 'ruchy-highlighter';

export function activate(context: vscode.ExtensionContext) {
  const provider = new RuchyPreviewProvider();
  
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      'ruchy.preview',
      provider
    )
  );
}

class RuchyPreviewProvider implements vscode.CustomTextEditorProvider {
  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel
  ): void {
    const updateWebview = () => {
      const html = highlight(document.getText(), 'monokai');
      webviewPanel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              background: #272822; 
              color: #f8f8f2;
              font-family: 'Fira Code', monospace;
            }
          </style>
        </head>
        <body>${html}</body>
        </html>
      `;
    };
    
    updateWebview();
    
    const changeDisposable = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });
    
    webviewPanel.onDidDispose(() => changeDisposable.dispose());
  }
}
```

## Neovim/Vim

### Tree-sitter Integration

Create a Tree-sitter grammar for Neovim:

```lua
-- init.lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()

parser_config.ruchy = {
  install_info = {
    url = "https://github.com/ruchy-lang/tree-sitter-ruchy",
    files = {"src/parser.c"},
    branch = "main"
  },
  filetype = "ruchy"
}

-- Custom highlight groups
vim.api.nvim_set_hl(0, "@keyword.ruchy", { fg = "#569cd6" })
vim.api.nvim_set_hl(0, "@string.ruchy", { fg = "#ce9178" })
vim.api.nvim_set_hl(0, "@function.ruchy", { fg = "#dcdcaa" })
```

### LSP Client Configuration

```lua
-- lsp-config.lua
local lspconfig = require('lspconfig')

lspconfig.ruchy_ls.setup{
  cmd = {"ruchy-language-server", "--stdio"},
  filetypes = {"ruchy"},
  root_dir = lspconfig.util.root_pattern("Ruchy.toml", ".git"),
  settings = {
    ruchy = {
      highlighter = {
        theme = "monokai",
        semantic = true
      }
    }
  }
}
```

## Sublime Text

### Syntax Definition

Create a Sublime syntax file:

```yaml
# Ruchy.sublime-syntax
%YAML 1.2
---
name: Ruchy
file_extensions: [ruchy, rcy]
scope: source.ruchy

contexts:
  main:
    - match: '\b(fn|let|const|if|else|for|while)\b'
      scope: keyword.control.ruchy
    
    - match: '\b(actor|spawn|send|receive)\b'
      scope: keyword.special.ruchy
    
    - match: '"'
      scope: punctuation.definition.string.begin.ruchy
      push: double_quoted_string
    
    - match: '//.*$'
      scope: comment.line.ruchy

  double_quoted_string:
    - meta_scope: string.quoted.double.ruchy
    - match: '\\.'
      scope: constant.character.escape.ruchy
    - match: '"'
      scope: punctuation.definition.string.end.ruchy
      pop: true
```

### Plugin Integration

```python
# ruchy_highlighter.py
import sublime
import sublime_plugin
from ruchy_highlighter import highlight

class RuchyHighlightCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        # Get current file content
        content = self.view.substr(sublime.Region(0, self.view.size()))
        
        # Highlight using Ruchy highlighter
        result = highlight(content, theme='sublime')
        
        # Apply regions for highlighting
        for token in result['tokens']:
            region = sublime.Region(token['start'], token['end'])
            scope = f"ruchy.{token['type']}"
            self.view.add_regions(
                f"ruchy_{token['id']}",
                [region],
                scope,
                flags=sublime.DRAW_NO_OUTLINE
            )
```

## Monaco Editor (Web)

### Web Integration

```typescript
// monaco-ruchy.ts
import * as monaco from 'monaco-editor';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

// Register Ruchy language
monaco.languages.register({ id: 'ruchy' });

// Token provider
monaco.languages.setTokensProvider('ruchy', {
  getInitialState: () => new RuchyState(),
  tokenize: (line: string, state: RuchyState) => {
    const highlighter = new RuchySyntaxHighlighter();
    const result = highlighter.highlightLine(line);
    
    const tokens: monaco.languages.IToken[] = [];
    for (const token of result.tokens) {
      tokens.push({
        startIndex: token.column - 1,
        scopes: mapTokenToMonacoScope(token.type)
      });
    }
    
    return {
      tokens,
      endState: state
    };
  }
});

// Configuration
monaco.languages.setLanguageConfiguration('ruchy', {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
});

// Theme
monaco.editor.defineTheme('ruchy-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword.ruchy', foreground: '569cd6', fontStyle: 'bold' },
    { token: 'string.ruchy', foreground: 'ce9178' },
    { token: 'number.ruchy', foreground: 'b5cea8' },
    { token: 'comment.ruchy', foreground: '6a9955', fontStyle: 'italic' },
    { token: 'function.ruchy', foreground: 'dcdcaa' },
    { token: 'variable.ruchy', foreground: '9cdcfe' },
    { token: 'type.ruchy', foreground: '4ec9b0' }
  ],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4'
  }
});
```

### Usage Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js"></script>
  <script src="ruchy-highlighter.min.js"></script>
</head>
<body>
  <div id="editor" style="width:800px;height:600px;"></div>
  <script>
    require.config({ 
      paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }
    });
    
    require(['vs/editor/editor.main'], function() {
      // Load Ruchy language support
      registerRuchyLanguage();
      
      // Create editor
      const editor = monaco.editor.create(
        document.getElementById('editor'), 
        {
          value: 'fn main() {\n  println("Hello, Ruchy!");\n}',
          language: 'ruchy',
          theme: 'ruchy-dark'
        }
      );
    });
  </script>
</body>
</html>
```

## CodeMirror (Web)

### CodeMirror 6 Integration

```typescript
// codemirror-ruchy.ts
import { 
  LanguageSupport, 
  StreamLanguage,
  syntaxHighlighting,
  HighlightStyle
} from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { RuchySyntaxHighlighter } from 'ruchy-highlighter';

// Define Ruchy language
export const ruchyLanguage = StreamLanguage.define({
  name: 'ruchy',
  startState: () => ({}),
  token: (stream, state) => {
    const highlighter = new RuchySyntaxHighlighter();
    const line = stream.string;
    const pos = stream.pos;
    
    // Get token at current position
    const result = highlighter.highlightLine(line);
    const token = result.tokens.find(t => 
      t.start <= pos && t.end > pos
    );
    
    if (token) {
      stream.pos = token.end;
      return mapTokenToCodeMirror(token.type);
    }
    
    stream.next();
    return null;
  }
});

// Highlight style
export const ruchyHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#dcdcaa' },
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.typeName, color: '#4ec9b0' }
]);

// Language support
export function ruchy(): LanguageSupport {
  return new LanguageSupport(
    ruchyLanguage,
    [syntaxHighlighting(ruchyHighlightStyle)]
  );
}
```

### Usage

```javascript
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { ruchy } from './codemirror-ruchy';

const editor = new EditorView({
  extensions: [
    basicSetup,
    ruchy()
  ],
  parent: document.getElementById('editor')
});
```

## Terminal/REPL Integration

### Node.js REPL

```javascript
// ruchy-repl.js
const repl = require('repl');
const { highlightForRepl } = require('ruchy-highlighter');

// Custom eval with syntax highlighting
function evalWithHighlight(cmd, context, filename, callback) {
  // Display highlighted input
  console.log(highlightForRepl(cmd));
  
  // Evaluate normally
  defaultEval(cmd, context, filename, (err, result) => {
    if (err) {
      console.error(highlightForRepl(`Error: ${err.message}`, 'error'));
    } else {
      console.log(highlightForRepl(`=> ${result}`, 'success'));
    }
    callback(err, result);
  });
}

// Start REPL with highlighting
const replServer = repl.start({
  prompt: highlightForRepl('ruchy> ', 'prompt'),
  eval: evalWithHighlight
});
```

### Shell Integration (Zsh/Bash)

```bash
#!/bin/bash
# ruchy-highlight.sh

# Function to highlight Ruchy code
ruchy_highlight() {
  local code="$1"
  deno run --allow-read ruchy-highlighter-cli.ts "$code"
}

# Alias for highlighted cat
alias rcat='ruchy_highlight'

# Integration with less
export LESSOPEN="| ruchy_highlight %s"
```

### Python REPL Integration

```python
# ruchy_repl.py
import sys
from IPython.core.magic import register_line_magic
from ruchy_highlighter import highlight_terminal

@register_line_magic
def ruchy(line):
    """Magic command for Ruchy syntax highlighting"""
    highlighted = highlight_terminal(line)
    print(highlighted)
    
# Usage in IPython/Jupyter:
# %ruchy fn main() { println("Hello"); }
```

## Performance Considerations

When integrating the highlighter:

1. **Caching**: Use the built-in cache for repeated highlighting
2. **Incremental Updates**: Only re-highlight changed regions
3. **Web Workers**: Run highlighting in background threads for web
4. **Lazy Loading**: Load grammar rules on-demand
5. **Debouncing**: Delay highlighting during rapid typing

```typescript
// Example: Debounced highlighting
class DebouncedHighlighter {
  private timeout: number | null = null;
  private highlighter = new RuchySyntaxHighlighter();
  
  highlight(
    code: string, 
    callback: (result: HighlightResult) => void
  ) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.timeout = setTimeout(() => {
      const result = this.highlighter.highlight(code);
      callback(result);
    }, 150); // 150ms delay
  }
}
```

## Testing Your Integration

Always test your editor integration with:

```ruchy
// test.ruchy
actor TestActor {
  mut state: HashMap<String, i32> = HashMap::new();
  
  receive msg: Message {
    match msg {
      Get(key) => {
        let value = self.state.get(&key).unwrap_or(&0);
        send(Response::Value(*value));
      }
      Set(key, value) => {
        self.state.insert(key, value);
        send(Response::Ok);
      }
    }
  }
}

async fn main() -> Result<(), Error> {
  let actor = spawn TestActor::new();
  actor.send(Message::Set("test", 42)).await?;
  Ok(())
}
```

This code should highlight:
- Keywords (actor, spawn, async, fn, match, etc.)
- Types (HashMap, String, i32, Result, Error)
- Strings ("test")
- Numbers (42, 0)
- Comments (if added)
- Special syntax (::, ->, =>, ?, &)

## Contributing

To add support for your editor:

1. Fork the ruchy-highlighter repository
2. Create an `editors/` directory with your integration
3. Include installation instructions
4. Add tests for your integration
5. Submit a pull request

## Resources

- [Ruchy Highlighter API Docs](https://docs.ruchy-lang.org/highlighter)
- [TextMate Grammar Guide](https://macromates.com/manual/en/language_grammars)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [Tree-sitter Documentation](https://tree-sitter.github.io/)