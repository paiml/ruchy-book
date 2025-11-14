# Refactoring Bug Tracker

**Purpose**: Track bugs found during extreme TDD refactoring
**Status**: Active
**Last Updated**: 2025-10-13

## Bug Report Template

```markdown
### BUG-XXX: [Title]

**Filed**: [Date]
**Ruchy Version**: vX.Y.Z
**Platform**: [OS and arch]
**Severity**: Critical/High/Medium/Low
**Status**: Open/Investigating/Fixed/Wontfix
**Ticket**: REFACTOR-XXX
**Blocking**: ChXX Section Y

#### Issue Summary
[One-line description]

#### Language Spec Reference
- **Section**: [Section in ruchy-language-spec.md]
- **Expected**: [What spec says should work]

#### Reproduction Steps
```ruchy
// Minimal reproducible example
fun main() {
    // Code that should work but doesn't
}
```

#### Expected Behavior
[What SHOULD happen according to spec]

#### Actual Behavior
[What ACTUALLY happens]

```
Error output here
```

#### Impact on Book
- Chapter X, Section Y
- Blocks N examples
- Affects M% of chapter content

#### Workaround
[If any workaround exists, or "None"]

#### Validation Evidence
```bash
# All 15 tools tested
ruchy check example.ruchy       # PASS/FAIL
ruchy compile example.ruchy     # PASS/FAIL
ruchy run example.ruchy         # PASS/FAIL
ruchy lint example.ruchy        # PASS/FAIL
ruchy score example.ruchy       # PASS/FAIL
# ... etc
```

#### Notebook Test
```bash
curl -X POST http://localhost:8080/api/execute \
  -H "Content-Type: application/json" \
  -d '{"source": "failing_code_here"}'
# Result: PASS/FAIL
```
```

## Active Bugs

<!-- Bugs will be added here as they are discovered -->

### Instructions

1. **When you find a bug**: Copy template above
2. **Assign ID**: Next available BUG-XXX number
3. **Test thoroughly**: All 15 tools + notebook
4. **Cross-reference**: Link to language spec section
5. **Update status**: As bug is investigated/fixed

## Bug Statistics

**Total Bugs Filed**: 0
**Open**: 0
**Fixed**: 0
**Workarounds Available**: 0
**Blocking Tickets**: 0

## Bug Categories

### Syntax/Parser Bugs
<!-- List bugs related to parsing/syntax -->

### Type System Bugs
<!-- List bugs related to type checking/inference -->

### Runtime Bugs
<!-- List bugs related to execution/runtime -->

### Standard Library Bugs
<!-- List bugs related to stdlib functions -->

### Tooling Bugs
<!-- List bugs related to the 15 tools -->

### Notebook Bugs
<!-- List bugs related to notebook execution -->

## Fixed Bugs Archive

<!-- Bugs that have been fixed will be moved here -->

## Notes

- Every bug MUST have minimal reproducible example
- Every bug MUST be tested with all 15 tools
- Every bug MUST be tested in notebook
- Every bug MUST reference language spec
- File issues in Ruchy compiler repo when appropriate
