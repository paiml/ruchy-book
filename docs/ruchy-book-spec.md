# Ruchy Book Specification
## Living Documentation Aligned with Implementation

### 1. Core Principles

#### 1.1 Implementation-First Documentation
- **No Vaporware**: Every code example must compile with current `ruchy` crate version
- **CI Enforcement**: Book examples tested against published crate on every commit
- **Feature Flags**: Unreleased features documented behind `--unstable` flags only
- **Version Pinning**: Book version strictly tracks compiler version

#### 1.2 Quality Gates
```toml
# book/Cargo.toml
[dev-dependencies]
ruchy = "=0.3.0"  # Exact version, no ranges
ruchy-test = "=0.3.0"

[features]
unstable = ["ruchy/unstable"]  # Future features
```

### 2. Repository Structure

```
paiml/ruchy-book/
├── .github/
│   ├── workflows/
│   │   ├── test.yml         # Test all examples
│   │   ├── deploy.yml       # Deploy to book.ruchy.org
│   │   └── sync.yml         # Sync with ruchy releases
│   └── CODEOWNERS
├── book.toml
├── theme/                    # Custom theme overrides
├── src/
│   ├── SUMMARY.md
│   ├── title-page.md
│   ├── foreword.md
│   ├── ch00-00-introduction.md
│   └── ...
├── listings/                 # Testable code examples
│   ├── ch01-hello-world/
│   │   ├── listing-01-01/
│   │   │   ├── src/main.ruchy
│   │   │   └── Cargo.toml
│   │   └── output-01-01.txt
│   └── ...
├── nostarch/                 # Print version (future)
├── tests/
│   ├── integration.rs       # Test all listings compile
│   └── links.rs            # Verify all links valid
└── tools/
    ├── update_version.sh    # Bump ruchy version
    └── extract_listings.py  # Extract code for testing
```

### 3. Content Architecture

#### 3.1 Progressive Disclosure Levels

```yaml
level_0_immediate:  # Chapters 1-3: Can write useful scripts
  topics:
    - hello_world
    - variables_and_types
    - functions
    - control_flow
  max_pages: 60
  completion_time: "2 hours"

level_1_productive:  # Chapters 4-7: Real-world programs
  topics:
    - ownership_simplified  # Not full Rust ownership
    - collections
    - error_handling
    - modules
  max_pages: 100
  completion_time: "1 week"

level_2_systems:  # Chapters 8-12: Performance code
  topics:
    - rust_interop
    - async_await
    - dataframes
    - actors
  max_pages: 150
  completion_time: "1 month"

level_3_advanced:  # Chapters 13+: Language mastery
  topics:
    - macros
    - unsafe
    - refinement_types
    - mcp_protocol
  max_pages: 200
  completion_time: "3 months"
```

#### 3.2 Chapter Template

```markdown
# Chapter N: Title

<!-- toc -->

## The Problem

[1-2 paragraphs: Why does this matter?]

## Quick Example

```ruchy
// Simplest possible working example
// Must compile with current ruchy version
```

## Core Concepts

[Theory and mental model, 2-3 pages max]

## Practical Usage

```ruchy
// Real-world example showing the feature
```

## Common Pitfalls

[What mistakes do people make?]

## Transpilation Insight

<details>
<summary>Generated Rust (click to expand)</summary>

```rust
// Show the actual generated Rust code
```

</details>

## Exercises

[2-3 exercises with solutions in appendix]

## Summary

[3-4 bullet points of key takeaways]
```

### 4. Testing Infrastructure

#### 4.1 Listing Validation

```rust
// tests/integration.rs
use ruchy::{compile, Config};
use std::fs;

#[test]
fn test_all_listings() {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    let listings_dir = Path::new(manifest_dir).join("listings");
    
    for entry in WalkDir::new(&listings_dir) {
        let entry = entry.unwrap();
        if entry.path().extension() == Some("ruchy".as_ref()) {
            let source = fs::read_to_string(entry.path()).unwrap();
            
            // Must compile without errors
            let result = compile(&source, Config::default());
            assert!(
                result.is_ok(), 
                "Failed to compile {}: {:?}", 
                entry.path().display(), 
                result.err()
            );
            
            // If output file exists, verify behavior
            let output_path = entry.path().with_extension("output");
            if output_path.exists() {
                let expected = fs::read_to_string(output_path).unwrap();
                let actual = run_ruchy(&source).unwrap();
                assert_eq!(actual.trim(), expected.trim());
            }
        }
    }
}
```

#### 4.2 Version Synchronization

```yaml
# .github/workflows/sync.yml
name: Sync with Ruchy Release

on:
  repository_dispatch:
    types: [ruchy-release]
  schedule:
    - cron: '0 */6 * * *'  # Check every 6 hours

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check latest ruchy version
        id: version
        run: |
          LATEST=$(cargo search ruchy --limit 1 | grep "^ruchy " | cut -d'"' -f2)
          CURRENT=$(grep 'ruchy = ' book/Cargo.toml | cut -d'"' -f2)
          echo "latest=$LATEST" >> $GITHUB_OUTPUT
          echo "current=$CURRENT" >> $GITHUB_OUTPUT
      
      - name: Update if needed
        if: steps.version.outputs.latest != steps.version.outputs.current
        run: |
          ./tools/update_version.sh ${{ steps.version.outputs.latest }}
          
      - name: Test with new version
        run: cargo test --all
        
      - name: Create PR
        if: success()
        uses: peter-evans/create-pull-request@v5
        with:
          title: "Update to ruchy ${{ steps.version.outputs.latest }}"
          body: "Automated update to track latest ruchy release"
          branch: update-ruchy-${{ steps.version.outputs.latest }}
```

### 5. mdBook Configuration

```toml
# book.toml
[book]
title = "The Ruchy Programming Language"
authors = ["PAIML Team"]
language = "en"
multilingual = false
src = "src"

[build]
build-dir = "book"
create-missing = false  # Prevent accidental file creation

[preprocessor.index]
[preprocessor.links]

[preprocessor.ruchy]
command = "./tools/ruchy-preprocessor"  # Custom processor
renderer = ["html"]

[output.html]
theme = "theme"
default-theme = "rust"
preferred-dark-theme = "coal"
curly-quotes = true
mathjax-support = false
copy-fonts = true
additional-css = ["theme/ruchy.css"]
additional-js = ["theme/ruchy.js"]
git-repository-url = "https://github.com/paiml/ruchy-book"
git-repository-icon = "fa-github"
edit-url-template = "https://github.com/paiml/ruchy-book/edit/main/{path}"
site-url = "https://book.ruchy.org/"
cname = "book.ruchy.org"
input-404 = "404.md"

[output.html.print]
enable = true

[output.html.fold]
enable = true
level = 1

[output.html.playground]
editable = true
copyable = true
copy-js = true
line-numbers = true
runnable = true

[output.html.search]
enable = true
limit-results = 30
teaser-word-count = 30
use-boolean-and = true
boost-title = 2
boost-hierarchy = 1
boost-paragraph = 1
expand = true
heading-split-level = 3
copy-js = true
```

### 6. Custom Preprocessor

```rust
// tools/ruchy-preprocessor/src/main.rs
use mdbook::book::{Book, Chapter};
use mdbook::errors::Error;
use mdbook::preprocess::{CmdPreprocessor, Preprocessor, PreprocessorContext};
use ruchy::{compile, Config};

struct RuchyPreprocessor;

impl Preprocessor for RuchyPreprocessor {
    fn name(&self) -> &str {
        "ruchy"
    }
    
    fn run(&self, ctx: &PreprocessorContext, mut book: Book) -> Result<Book, Error> {
        book.for_each_mut(|item| {
            if let BookItem::Chapter(ref mut ch) = item {
                process_chapter(ch, ctx).unwrap();
            }
        });
        Ok(book)
    }
}

fn process_chapter(ch: &mut Chapter, ctx: &PreprocessorContext) -> Result<(), Error> {
    let mut new_content = String::new();
    let mut in_ruchy_block = false;
    let mut code_block = String::new();
    
    for line in ch.content.lines() {
        if line.starts_with("```ruchy") {
            in_ruchy_block = true;
            code_block.clear();
            new_content.push_str(line);
            new_content.push('\n');
        } else if in_ruchy_block && line.starts_with("```") {
            // Validate code compiles
            match compile(&code_block, Config::default()) {
                Ok(_) => {
                    // Add success indicator
                    new_content.push_str(&code_block);
                    new_content.push_str("\n```\n");
                    new_content.push_str("<div class='ruchy-valid'>✓ Valid Ruchy code</div>\n");
                }
                Err(e) if ctx.config.get("strict").unwrap_or(&false.into()).as_bool().unwrap() => {
                    return Err(Error::msg(format!(
                        "Invalid Ruchy code in {}: {}", 
                        ch.name, e
                    )));
                }
                Err(e) => {
                    // Show error in development
                    new_content.push_str(&code_block);
                    new_content.push_str("\n```\n");
                    new_content.push_str(&format!(
                        "<div class='ruchy-error'>⚠ Compilation error: {}</div>\n", 
                        e
                    ));
                }
            }
            in_ruchy_block = false;
        } else if in_ruchy_block {
            code_block.push_str(line);
            code_block.push('\n');
        } else {
            new_content.push_str(line);
            new_content.push('\n');
        }
    }
    
    ch.content = new_content;
    Ok(())
}
```

### 7. Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Book

on:
  push:
    branches: [main]
  pull_request:

env:
  RUST_VERSION: "1.75.0"
  MDBOOK_VERSION: "0.4.37"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: ${{ env.RUST_VERSION }}
      
      - name: Cache cargo
        uses: Swatinem/rust-cache@v2
      
      - name: Install ruchy
        run: cargo install ruchy --version $(grep 'ruchy = ' book/Cargo.toml | cut -d'"' -f2)
      
      - name: Test listings
        run: cargo test --manifest-path book/Cargo.toml
      
      - name: Build preprocessor
        run: cargo build --release --manifest-path tools/ruchy-preprocessor/Cargo.toml
      
      - name: Install mdBook
        run: |
          curl -sSL https://github.com/rust-lang/mdBook/releases/download/v${MDBOOK_VERSION}/mdbook-v${MDBOOK_VERSION}-x86_64-unknown-linux-gnu.tar.gz | tar -xz
          chmod +x mdbook
          sudo mv mdbook /usr/local/bin/
      
      - name: Build book
        run: mdbook build
        env:
          MDBOOK_PREPROCESSOR__RUCHY__STRICT: true
      
      - name: Check links
        run: mdbook-linkcheck
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./book
          cname: book.ruchy.org
```

### 8. Feature Flag Documentation

```markdown
# Appendix F: Unstable Features

These features are available only with `--unstable` flag:

## Refinement Types (RFC #0042)

```ruchy,unstable
// Requires: ruchy --unstable
type Natural = i32 where self >= 0

fun sqrt(n: Natural) -> f64 {
    (n as f64).sqrt()
}
```

Status: Implementation 60% complete, targeting v0.5.0
```

### 9. Version Update Protocol

```bash
#!/bin/bash
# tools/update_version.sh

NEW_VERSION=$1

# Update Cargo.toml
sed -i "s/ruchy = \".*\"/ruchy = \"=${NEW_VERSION}\"/" book/Cargo.toml

# Update book.toml metadata
sed -i "s/ruchy-version = \".*\"/ruchy-version = \"${NEW_VERSION}\"/" book.toml

# Update all listings
find listings -name "Cargo.toml" -exec \
  sed -i "s/ruchy = \".*\"/ruchy = \"${NEW_VERSION}\"/" {} \;

# Run tests
cargo test --all

# Generate changelog entry
echo "## Version ${NEW_VERSION}" > CHANGELOG.tmp
echo "" >> CHANGELOG.tmp
git log --pretty=format:"- %s" $(git describe --tags --abbrev=0)..HEAD >> CHANGELOG.tmp
echo "" >> CHANGELOG.tmp
cat CHANGELOG.md >> CHANGELOG.tmp
mv CHANGELOG.tmp CHANGELOG.md
```

### 10. Success Metrics

```yaml
metrics:
  quality:
    - example_compilation_rate: 100%  # All examples must compile
    - link_validity: 100%             # No broken links
    - ci_green_rate: 100%             # No flaky tests
    
  adoption:
    - time_to_hello_world: <5min      # First program running
    - completion_rate_ch1_3: >80%     # Most readers finish basics
    - issue_resolution_time: <48h     # Quick fixes for errors
    
  maintenance:
    - version_sync_lag: <24h          # Track compiler quickly
    - pr_merge_time: <4h              # Rapid iteration
    - test_execution_time: <2min      # Fast feedback loop
```

### 11. Non-Goals

- **No theoretical features**: Document only what ships
- **No alternative syntaxes**: One way to do things
- **No implementation details**: Focus on usage, not compiler internals
- **No opinion pieces**: Technical documentation only
- **No versioned documentation**: Always track latest stable

This specification ensures the book remains a reliable, always-current reference that builds trust through working code rather than promises.