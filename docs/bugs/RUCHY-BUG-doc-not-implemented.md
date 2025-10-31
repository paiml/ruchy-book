# Bug Report: `ruchy doc` Command Not Implemented

**Filed**: 2025-10-31
**Reporter**: Claude Code (via ruchy-book validation)
**Severity**: Medium
**Status**: Open
**GitHub Issue**: https://github.com/paiml/ruchy/issues/101

## Summary

The `ruchy doc` command has a complete CLI interface with help text but returns "Command not yet implemented" when executed on any file.

## Reproduction Steps

**100% reproducible** on any system with ruchy v3.152.0:

```bash
# Step 1: Verify ruchy version
$ ruchy --version
ruchy 3.152.0

# Step 2: Check help text exists
$ ruchy doc --help
Generate documentation from Ruchy source code

Usage: ruchy doc [OPTIONS] <PATH>

Arguments:
  <PATH>  The file or directory to document

Options:
      --output <OUTPUT>  Output directory for generated documentation [default: ./docs]
      --format <FORMAT>  Documentation format (html, markdown, json) [default: html]
      --private          Include private items in documentation
      --open             Open documentation in browser after generation
      --all              Generate documentation for all files in project
      --verbose          Show verbose output
  -h, --help             Print help

# Step 3: Attempt to generate documentation
$ ruchy doc --format markdown tests/extracted/ch01-02-hello-world_example_1.ruchy
Command not yet implemented

# Step 4: Try with directory
$ ruchy doc --format html tests/extracted/
Command not yet implemented

# Step 5: Try JSON output
$ ruchy doc --format json tests/extracted/ch03-00-functions-tdd_example_1.ruchy
Command not yet implemented

# Exit code: 0 (no error, but no functionality)
```

## Expected Behavior

Based on the help text, the tool should:

1. **Parse Source Code**: Extract documentation comments and signatures
2. **Generate Documentation** in multiple formats:
   - **HTML**: Styled web documentation (default)
   - **Markdown**: Simple markdown format
   - **JSON**: Structured data for tooling
3. **Support Features**:
   - Include/exclude private items (`--private` flag)
   - Auto-open in browser (`--open` flag)
   - Project-wide generation (`--all` flag)
   - Verbose output (`--verbose` flag)
4. **Write to Directory**: Save to `--output` path (default: `./docs`)

**Expected Output** (HTML format):
```html
<!DOCTYPE html>
<html>
<head>
  <title>Ruchy Documentation</title>
</head>
<body>
  <h1>Module: hello_world</h1>

  <h2>Functions</h2>

  <div class="function">
    <h3>main()</h3>
    <p>Entry point for the program.</p>
    <pre><code>fun main() {
    println("Hello, World!")
}</code></pre>
  </div>
</body>
</html>
```

**Expected Output** (Markdown format):
```markdown
# Module: hello_world

## Functions

### main()

Entry point for the program.

```ruchy
fun main() {
    println("Hello, World!")
}
```
```

**Expected Output** (JSON format):
```json
{
  "module": "hello_world",
  "functions": [
    {
      "name": "main",
      "signature": "fun main()",
      "doc_comment": "Entry point for the program.",
      "visibility": "public",
      "params": [],
      "return_type": "unit"
    }
  ]
}
```

## Actual Behavior

Returns "Command not yet implemented" immediately with exit code 0.

No documentation is generated.
No files are created.
No output directory is created.

## Impact

**On ruchy-book project**:
- Cannot auto-generate API documentation
- Cannot provide searchable documentation for learners
- Cannot extract doc comments for reference
- Manual documentation maintenance required

**On Ruchy ecosystem**:
- Developers cannot generate project documentation
- Missing standard feature (Rust has `cargo doc`, Go has `godoc`)
- Harder to share API documentation
- No tooling support for documentation generation

## Verification

Tested on **69 Ruchy source files** in ruchy-book project:
- **Result**: 69/69 files (100%) return "Command not yet implemented"
- **Performance**: 3ms avg (fast failure, no actual parsing)
- **Baseline log**: `ruchy-book/logs/TICKET-018-16-baseline.log`
- **Test script**: `ruchy-book/test/tools/test-ruchy-doc.ts`

## Context

**Discovery Method**: Systematic 18-tool validation (TICKET-018)
- TICKET-018-16: Comprehensive `ruchy doc` validation
- Date: 2025-10-31
- Methodology: EXTREME TDD with baseline establishment
- Phase: 1E (Documentation & Execution tools)

**Related Tools**:
- `ruchy ast`: ✅ Works (provides AST, could extract docs)
- `ruchy check`: ✅ Works (parses syntax, has AST)
- `ruchy doc`: ❌ Not implemented (this issue)

## Suggested Implementation Path

The CLI infrastructure already exists, suggesting partial implementation:

1. **Parse Source Code**:
   ```rust
   // Pseudocode
   let ast = parse_file(path)?;
   let doc_items = extract_documentation(&ast)?;
   ```

2. **Extract Documentation Comments**:
   - Parse `/// doc comment` and `/** block comment */` syntax
   - Extract function signatures, params, return types
   - Identify public vs private items

3. **Generate Output**:
   - **HTML**: Use template engine (e.g., Tera, Handlebars)
   - **Markdown**: Simple string formatting
   - **JSON**: Serialize structs with serde

4. **File Generation**:
   ```rust
   // Pseudocode
   let output_dir = args.output.unwrap_or("./docs".into());
   fs::create_dir_all(&output_dir)?;

   match args.format {
       Format::Html => generate_html(&doc_items, &output_dir)?,
       Format::Markdown => generate_markdown(&doc_items, &output_dir)?,
       Format::Json => generate_json(&doc_items, &output_dir)?,
   }

   if args.open {
       open_in_browser(&output_dir)?;
   }
   ```

5. **Project-Wide Documentation**:
   - Walk directory tree with `--all` flag
   - Generate index/navigation
   - Cross-reference modules

## Workaround

**Manual documentation** (not equivalent):
```bash
# Extract doc comments manually
grep -r "///" src/ > docs/comments.txt

# Use external tools
# (none available for Ruchy specifically)
```

**Limitations**:
- No automatic extraction
- No formatting
- No cross-referencing
- No HTML/searchable output

## Example Expected Documentation

**Source Code** (`example.ruchy`):
```ruchy
/// Calculates the sum of two numbers.
///
/// # Arguments
/// * `a` - First number
/// * `b` - Second number
///
/// # Returns
/// The sum of a and b
fun add(a, b) {
    a + b
}

/// Main entry point
fun main() {
    let result = add(5, 3)
    println(result)
}
```

**Expected Command**:
```bash
$ ruchy doc --format markdown --output ./docs example.ruchy
Generating documentation...
✓ Parsed example.ruchy
✓ Extracted 2 functions
✓ Generated markdown documentation
✓ Wrote to ./docs/example.md
```

**Expected Output File** (`docs/example.md`):
```markdown
# example.ruchy

## Functions

### add(a, b)

Calculates the sum of two numbers.

**Arguments:**
- `a` - First number
- `b` - Second number

**Returns:** The sum of a and b

### main()

Main entry point
```

## Integration Status

**Current State**:
- ✅ CLI interface defined
- ✅ Help text documented
- ✅ Multiple output formats specified
- ✅ CI/CD integration prepared
- ✅ Baseline established (0% implementation)
- ❌ Actual documentation generation not implemented

**When Implemented**:
- Re-run test suite: `deno run --allow-read --allow-run test/tools/test-ruchy-doc.ts`
- CI/CD will automatically detect and validate
- Baseline comparison available from TICKET-018-16
- Could generate ruchy-book API documentation automatically

## Evidence

**Help text shows complete interface**:
```bash
$ ruchy doc --help | grep -A 13 "Usage:"
Usage: ruchy doc [OPTIONS] <PATH>

Arguments:
  <PATH>  The file or directory to document

Options:
      --output <OUTPUT>  Output directory for generated documentation [default: ./docs]
      --format <FORMAT>  Documentation format (html, markdown, json) [default: html]
      --private          Include private items in documentation
      --open             Open documentation in browser after generation
      --all              Generate documentation for all files in project
      --verbose          Show verbose output
  -h, --help             Print help
```

**Execution returns placeholder**:
```bash
$ ruchy doc --format json file.ruchy
Command not yet implemented
```

## Priority Justification

**Medium Priority** because:
- ✅ Manual documentation is possible (workaround exists)
- ✅ Teaching examples in ruchy-book have hand-written docs
- ✅ Not blocking core functionality
- ❌ Missing nice-to-have for API documentation
- ❌ Would improve developer experience significantly

**Would be High Priority if**:
- Large projects need auto-generated docs
- Public API documentation is required
- Multiple contributors need consistent documentation format

## Use Cases

**When Implemented, Would Enable**:

1. **Library Authors**:
   ```bash
   ruchy doc --format html --output ./docs --all src/
   # Generate complete library documentation
   ```

2. **API Documentation**:
   ```bash
   ruchy doc --format json --output api.json src/lib.ruchy
   # Extract API for tooling/IDE integration
   ```

3. **Teaching Examples** (ruchy-book):
   ```bash
   ruchy doc --format markdown tests/extracted/*.ruchy --output reference/
   # Auto-generate API reference from examples
   ```

4. **CI/CD Integration**:
   ```bash
   ruchy doc --all --output ./docs
   # Generate docs on every commit
   # Host on GitHub Pages
   ```

## References

- **Discovery Ticket**: TICKET-018-16 (ruchy-book comprehensive validation)
- **Test Infrastructure**: `ruchy-book/test/tools/test-ruchy-doc.ts`
- **Baseline Log**: `ruchy-book/logs/TICKET-018-16-baseline.log`
- **CI Integration**: `.github/workflows/quality-gates.yml` (lines 423-465)
- **Documentation**: `ruchy-book/INTEGRATION.md` (TICKET-018-16 section)

## Reproducibility Checklist

- ✅ Exact version specified (v3.152.0)
- ✅ Commands provided verbatim
- ✅ Expected vs actual behavior documented
- ✅ Example source code provided
- ✅ Multiple format tests included
- ✅ Tested on 69 files (100% consistent)
- ✅ Use cases documented
- ✅ Integration status tracked
