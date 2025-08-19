# CLAUDE.md - Ruchy Book Implementation Protocol

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prime Directive

**Generate correct documentation where every example compiles on first attempt. Quality is built-in, not bolted-on.**

## Core Principles (Toyota Way)

- **Kaizen (改善)**: Continuous incremental improvement - one chapter at a time
- **Genchi Genbutsu (現地現物)**: Go and see - test every example in real REPL before documenting
- **Jidoka (自働化)**: Quality at the source - automated validation prevents broken examples

## MANDATORY Quality Gates (BLOCKING - Not Advisory)

### Pre-Commit Hooks (MANDATORY)
```bash
#!/bin/bash
# .git/hooks/pre-commit - BLOCKS commits that violate quality
set -e

echo "🔒 MANDATORY Book Quality Gates..."

# GATE 1: All listings must compile
cargo test --manifest-path book/Cargo.toml || {
    echo "❌ BLOCKED: Code examples don't compile"
    exit 1
}

# GATE 2: Strict mode validation
MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build || {
    echo "❌ BLOCKED: Examples fail strict validation"
    exit 1
}

# GATE 3: Zero broken links
mdbook-linkcheck || {
    echo "❌ BLOCKED: Broken links found"
    exit 1
}

# GATE 4: No vaporware documentation
! grep -r "coming soon\|not yet implemented\|TODO" src/ || {
    echo "❌ BLOCKED: Vaporware documentation found"
    exit 1
}

echo "✅ All quality gates passed"
```

## Absolute Rules

1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware. If it doesn't compile in current `ruchy`, it doesn't go in the book.

2. **ALWAYS Test in REPL First**: Before documenting ANY code example:
   ```bash
   echo 'your_code_here' | ruchy repl
   # MUST see expected output before documenting
   ```

3. **NEVER Leave SATD Comments**: No TODO, FIXME, HACK comments. File GitHub issues instead.

4. **ALWAYS Use Exact Version Pinning**: 
   ```toml
   ruchy = "=0.3.0"  # EXACT version, no ranges
   ```

5. **NEVER Skip Testing**: Every listing MUST have a test that verifies compilation and output.

6. **Zero Cruft Tolerance**: No temporary files, no debug artifacts. Clean workspace always.

## Repository Structure

```
ruchy-book/
├── .github/
│   ├── workflows/
│   │   ├── test.yml         # Test all examples
│   │   ├── deploy.yml       # Deploy to book.ruchy.org
│   │   └── sync.yml         # Sync with ruchy releases
│   └── CODEOWNERS
├── book.toml                # mdBook configuration
├── src/                     # Book content (markdown)
│   ├── SUMMARY.md
│   └── ch*.md
├── listings/                # Testable code examples
│   └── ch*/listing-*/
│       ├── src/main.ruchy
│       ├── Cargo.toml
│       └── output.txt
├── tests/                   # Integration tests
└── tools/                   # Build tools
    ├── ruchy-preprocessor/  # Custom validation
    └── update_version.sh    # Version sync script
```

## Development Commands

### Essential Commands
```bash
# Build and validate book
make build           # mdbook build with validation
make serve          # Local preview with auto-reload
make test           # Test all listings compile

# Quality gates
make lint           # Check for vaporware/SATD
make validate       # Run ALL quality checks
make clean          # Remove all build artifacts

# Version management
make sync-version   # Update to latest ruchy version
make verify-version # Check version consistency
```

### The Kaizen Loop for Documentation

#### Step 1: Identify Gap (Genchi Genbutsu)
```bash
# Find undocumented features
diff <(ruchy --help) <(grep -h "##" src/ch*.md)

# Find failing examples
cargo test --manifest-path book/Cargo.toml 2>&1 | grep FAILED
```

#### Step 2: Validate Before Documenting
```bash
# Test the example works
echo 'example_code' | ruchy repl

# Create listing with test
mkdir -p listings/ch03/listing-03-01/src
echo 'example_code' > listings/ch03/listing-03-01/src/main.ruchy
echo 'expected_output' > listings/ch03/listing-03-01/output.txt

# Verify it passes
cargo test --manifest-path book/Cargo.toml
```

#### Step 3: Document with Validation
```markdown
<!-- In chapter file -->
```ruchy
// This will be validated by preprocessor
fn main() {
    println("Hello, Ruchy!")
}
```

<details>
<summary>Generated Rust (click to expand)</summary>

```rust
// Show actual transpiled code
fn main() {
    println!("Hello, Ruchy!");
}
```
</details>
```

## Architecture & Progressive Disclosure

### Level 0: Immediate (Chapters 1-3)
- **Goal**: Write useful scripts in 2 hours
- **Topics**: Hello world, variables, functions, control flow
- **Max Pages**: 60
- **Validation**: Every example runs in REPL

### Level 1: Productive (Chapters 4-7)
- **Goal**: Real-world programs in 1 week
- **Topics**: Ownership (simplified), collections, errors, modules
- **Max Pages**: 100
- **Validation**: Build complete programs

### Level 2: Systems (Chapters 8-12)
- **Goal**: Performance code in 1 month
- **Topics**: Rust interop, async, dataframes, actors
- **Max Pages**: 150
- **Validation**: Benchmarks included

### Level 3: Advanced (Chapters 13+)
- **Goal**: Language mastery in 3 months
- **Topics**: Macros, unsafe, refinement types, MCP
- **Max Pages**: 200
- **Validation**: Integration tests

## Chapter Template (MANDATORY Structure)

```markdown
# Chapter N: Title

## The Problem
[1-2 paragraphs: Why does this matter?]

## Quick Example
```ruchy
// Simplest possible WORKING example
// MUST compile with current ruchy version
```

## Core Concepts
[Theory and mental model, 2-3 pages max]

## Practical Usage
```ruchy
// Real-world example showing the feature
// Include performance characteristics if relevant
```

## Common Pitfalls
[What mistakes do people make?]

## Transpilation Insight
<details>
<summary>Generated Rust (click to expand)</summary>
```rust
// Show the ACTUAL generated Rust code
```
</details>

## Exercises
[2-3 exercises with solutions in appendix]

## Summary
- Key takeaway 1
- Key takeaway 2
- Key takeaway 3
```

## Testing Infrastructure

### Listing Validation
```rust
// tests/integration.rs
#[test]
fn test_all_listings() {
    for listing in find_listings() {
        // MUST compile without errors
        let result = compile(&source, Config::default());
        assert!(result.is_ok(), "Failed: {}", path);
        
        // MUST produce expected output
        if output_path.exists() {
            assert_eq!(actual.trim(), expected.trim());
        }
    }
}
```

### Version Synchronization
```yaml
# .github/workflows/sync.yml
- name: Check latest ruchy version
- name: Update if needed
- name: Test with new version
- name: Create PR if all tests pass
```

## Success Metrics

### Quality Metrics (MANDATORY)
- **Example Compilation Rate**: 100% (BLOCKING)
- **Link Validity**: 100% (BLOCKING)
- **CI Green Rate**: 100% (BLOCKING)
- **Zero Vaporware**: 0 "coming soon" references

### Adoption Metrics
- **Time to Hello World**: <5 minutes
- **Chapter 1-3 Completion**: >80%
- **Issue Resolution**: <48 hours

### Maintenance Metrics
- **Version Sync Lag**: <24 hours
- **PR Merge Time**: <4 hours
- **Test Execution**: <2 minutes

## Non-Goals (What NOT to Document)

- **Theoretical features**: Only what ships
- **Alternative syntaxes**: One way to do things
- **Implementation details**: Usage, not internals
- **Opinion pieces**: Technical facts only
- **Versioned docs**: Always track latest stable

## Sprint Hygiene Protocol

### Pre-Sprint Cleanup
```bash
# Remove all temporary files
rm -f test_* debug_* *.tmp
find . -name "*.bak" -delete

# Clean build artifacts
rm -rf book/
cargo clean

# Verify clean state
git status --ignored
```

### Post-Sprint Checklist
```bash
# Update tracking
git add docs/

# Verify no cruft
find . -type f -size +100M

# Push with clean history
git push origin main
```

## The Make Commands Contract

```makefile
# Makefile (to be created)
.PHONY: all build serve test validate clean

all: validate build

build:
	mdbook build

serve:
	mdbook serve --open

test:
	cargo test --manifest-path book/Cargo.toml
	./tools/test-listings.sh

validate: lint test
	MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build
	mdbook-linkcheck

lint:
	! grep -r "TODO\|FIXME\|coming soon" src/
	! grep -r "not yet implemented" listings/

clean:
	rm -rf book/
	cargo clean
	find . -name "*.tmp" -delete

sync-version:
	./tools/update_version.sh $(shell cargo search ruchy --limit 1 | grep "^ruchy " | cut -d'"' -f2)

pre-commit: validate
	@echo "✅ Ready to commit"
```

## Remember

**Implementation-first documentation**: Every line of example code must compile and run correctly with the current Ruchy compiler. The book is a living proof that Ruchy works, not a promise of what it might do.