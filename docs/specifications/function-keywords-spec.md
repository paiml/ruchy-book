# Function Keywords Specification - `fun` vs `fn`

**Document Version**: 1.0  
**Ruchy Version**: v0.11.3  
**Date**: August 22, 2025

## Design Decision

Ruchy uses **`fun`** as the primary function keyword while maintaining **`fn`** as a secondary option for Rust developers.

## Rationale

### Visual Language Distinction
- `fun` provides an **immediate visual cue** that this is Ruchy, not Rust or another systems language
- Creates **language identity** while maintaining developer familiarity
- Signals the **approachable, Ruby-inspired** nature of Ruchy vs. systems programming complexity

### Developer Experience Strategy
1. **Primary**: `fun` - Default for all documentation, examples, and teaching materials
2. **Secondary**: `fn` - Accepted by parser to ease Rust developer transition
3. **Future**: `fn` will generate linter warnings to encourage `fun` usage

## Implementation Rules

### Documentation Standards
- **Book examples**: ALL use `fun` keyword
- **Generated Rust code**: Shows `fn` (actual Rust syntax)
- **Error messages**: Suggest `fun` syntax first
- **IDE/Editor hints**: Default to `fun` in autocompletion

### Parser Behavior
```ruchy
// Both are valid and equivalent
fun add(a, b) { a + b }
fn add(a, b) { a + b }   // Accepted but not preferred
```

### Linter Behavior (v0.12.0+)
```bash
$ ruchy lint code.ruchy
warning: Use 'fun' instead of 'fn' for Ruchy functions
  --> code.ruchy:1:1
   |
 1 | fn calculate() {}
   | ^^ help: replace with: `fun`
```

## Examples

### ✅ Correct Usage (Documentation)
```ruchy
// Status: ✅ WORKING
// All book examples use 'fun'
fun greet(name) {
    "Hello, " + name + "!"
}

fun main() {
    println(greet("World"))
}
```

### ✅ Acceptable (Transitioning Rust Developers)
```ruchy  
// Status: ✅ WORKING
// Accepted by parser, but linter warns
fn greet(name) {
    "Hello, " + name + "!"
}
```

### ✅ Generated Rust Code
```rust
// Rust transpilation target uses 'fn'
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}
```

## Migration Strategy

### Phase 1 (v0.11.3) - Documentation Update ✅
- [x] All 348 function examples updated to use `fun`
- [x] Rust code examples properly use `fn`  
- [x] CLAUDE.md guidance updated
- [x] Book maintains 43% compatibility

### Phase 2 (v0.12.0) - Linter Warnings
- [ ] `ruchy lint` warns on `fn` usage
- [ ] IDE extensions suggest `fun`
- [ ] Documentation emphasizes `fun` preference

### Phase 3 (v1.0.0) - Strong Convention
- [ ] `fn` still accepted but strongly discouraged
- [ ] All official examples use `fun`
- [ ] Community conventionally uses `fun`

## Compatibility

### Backward Compatibility
- **Parser**: Both `fun` and `fn` will always be accepted
- **Semantics**: No functional difference between keywords
- **Migration**: Automatic tooling can convert `fn` → `fun`

### Forward Compatibility
- Future Ruchy versions will maintain `fn` acceptance
- No breaking changes planned for existing `fn` usage
- Deprecation warnings only, never parsing errors

## Benefits

### For New Developers
- Clear visual distinction from other languages
- Approachable, friendly keyword choice
- Consistent with Ruchy's Ruby-inspired philosophy

### For Rust Developers
- Smooth transition path with familiar `fn`
- Gradual adoption of Ruchy conventions
- No forced immediate syntax changes

### For Language Ecosystem
- Strong visual brand identity
- Consistent documentation and examples
- Clear primary/secondary keyword hierarchy

## Testing Impact

Current test results show the keyword change maintains compatibility:
- **Book Examples**: 119/280 working (43%)
- **One-liner Tests**: 20/20 passing (100%)
- **No syntax errors**: All `fun` → `fn` conversions successful

## References

- [CLAUDE.md - Rule #7](../CLAUDE.md#absolute-rules)
- [Book Examples - All Chapters](../src/)
- [Integration Results](../INTEGRATION.md)
- [Parser Implementation](https://github.com/paiml/ruchy)