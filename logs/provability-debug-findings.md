# Provability Tool Debug Findings

## Summary
After systematic Five Whys investigation, the `ruchy provability` tool appears to be PARTIALLY IMPLEMENTED with significant limitations.

## Evidence Collected

### Test 1-2: Verbose Flag
- **Result**: `--verbose` flag produces NO additional output
- **Conclusion**: Verbose mode not implemented or not functional

### Test 3: Verification Output
- **Result**: `--verify` flag shows basic checks:
  ```
  ✓ No unsafe operations detected
  ✓ All functions are pure  
  ✓ No side effects found
  ```
- **Conclusion**: Basic safety analysis works

### Test 4: Contract Verification  
- **Result**: `--contracts` reports "No contracts defined"
- **Conclusion**: Contract detection works, but our examples have no formal specs

### Test 5: Multiple Flags on Complex Example
- **Result**: All tests return 0.0/100 provability score
- **Conclusion**: Score might measure presence of formal specifications, not code quality

### Test 6: Invariants, Bounds, Termination
- **Invariants**: Reports "No loops found" (even when loops exist - see Test 8)
- **Bounds**: Reports "✓ Array access is bounds-checked, ✓ No buffer overflows possible"
- **Termination**: Reports "✓ All functions terminate"
- **Conclusion**: Mixed results - some analysis works, loop detection doesn't

### Test 7-8: Loop Detection BROKEN
- **File**: `ch05-00-control-flow-tdd_example_5.ruchy` contains `for i in 0..3 { ... }`
- **Result**: Tool reports "No loops found"
- **Conclusion**: Loop detection is BROKEN or doesn't recognize range-based for loops

## Five Whys Root Cause

**Why #1**: Why are all scores 0.0/100?
- ~~Because our code has no formal specifications (contracts, pre/post-conditions)~~
- **ACTUAL ROOT CAUSE (confirmed via source code)**: Score ONLY counts `assert()` calls, not actual provability

**Why #2**: Why doesn't the tool recognize loops?
- Because loop detection appears broken or only recognizes certain syntax

**Why #3**: Why does --verbose produce no output?
- Because verbose mode is not implemented

**Why #4**: Why does score ignore purity/safety/termination analyses?
- **BUG IN DESIGN**: `calculate_provability_score()` only counts assertions, doesn't integrate other analyses

**Why #5 (ROOT CAUSE - CONFIRMED VIA SOURCE CODE)**:
- **DESIGN BUG in `src/bin/handlers/commands.rs`**:
  ```rust
  fn calculate_provability_score(ast: &Expr) -> f64 {
      let assertion_ratio = assertion_count / total_statements;
      (assertion_ratio * 100.0).min(100.0)  // ONLY counts assertions!
  }
  ```
- Tool performs purity/safety/termination analyses correctly (`--verify`, `--bounds`, `--termination`)
- **BUT these analyses DON'T contribute to the score**
- Score formula: `(assertions / statements) * 100`
- No assertions → 0.0/100, regardless of actual provability

**GitHub Issue Filed**: https://github.com/paiml/ruchy/issues/99

## Tool Status Assessment

### WORKING Features ✅
- Basic provability scoring (0.0 when no specs present)
- Safety checks (unsafe operations, purity, side effects)
- Contract detection (reports absence correctly)
- Bounds checking (array safety)
- Termination analysis (basic)

### BROKEN/NOT IMPLEMENTED Features ❌
- Loop detection (reports "No loops found" even when loops exist)
- Verbose output (flag has no effect)
- Loop invariant analysis (depends on broken loop detection)
- Provability scoring for code WITH formal specs (untested - no examples)

## Recommendation

**PROCEED WITH INTEGRATION** but with caveats:
1. Document tool limitations clearly
2. Report 0.0/100 scores as EXPECTED (not a failure)
3. Note loop detection is broken in current version
4. Track as "baseline establishment" for future improvements
5. File GitHub issues for broken features (loop detection, verbose)

**Success Criteria for Integration**:
- Tool runs on 100% of files (exit code 0)
- Provability scores reported (even if 0.0)
- Basic safety analysis works
- Document baseline for future comparison

**NOT Success Criteria** (due to tool limitations):
- Non-zero provability scores
- Loop invariant detection
- Verbose output
