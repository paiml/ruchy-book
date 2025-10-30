# TICKET-023: Remove DataFrame Vaporware (4 Failures → 0)

**Date**: 2025-10-30
**Priority**: HIGH (Impact: +3% pass rate to 97%)
**Type**: Vaporware Removal / Quality Gate
**Status**: IN PROGRESS
**Estimated Time**: 20 minutes
**Follows**: TICKET-021 (same pattern)

## Problem

4 examples document unimplemented DataFrame features and fail tests:
- Ch03 example 10: DataFrame::from_csv + advanced methods
- Ch05 example 15: DataFrame::from_csv + df.filter()
- Ch05 example 16: DataFrame::from_csv + df.iter_rows()
- Ch05 example 17: DataFrame::from_csv + match with DataFrames

**Error**: `Runtime error: Unknown qualified name: DataFrame::from_csv`

## Root Cause

These examples document DataFrame features that don't exist in v3.149.0:
- `DataFrame::from_csv()` - CSV loading not implemented
- `df.filter()` - Filtering not implemented
- `df.iter_rows()` - Row iteration not implemented
- `df["column"]` - Column indexing not implemented
- `row["field"]` - Field access not implemented

**Working DataFrame features** (per Ch18):
- ✅ `df![]` macro for manual DataFrame creation
- ✅ Displaying DataFrames (return as last expression)
- ✅ Passing DataFrames between functions

This is **vaporware documentation** violating CLAUDE.md rules.

## CLAUDE.md Violation

```markdown
1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware.
   If it doesn't compile in current `ruchy`, it doesn't go in the book.
```

## Impact

**Current State**:
- Total examples: 142
- Passing: 133 (94%)
- Failing: 9 (6%)

**After Fix**:
- Total examples: 138 (-4 removed)
- Passing: 133 (96%) **+2% improvement**
- Failing: 5 (4%)

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Failures)
```bash
# Confirm 4 DataFrame::from_csv failures exist
cat test/extracted-examples/failing.log | grep DataFrame

# Expected: ch03 ex 10, ch05 ex 15, 16, 17 failing
```

### Phase 2: TDD GREEN (Remove Vaporware)

Remove 4 examples documenting unimplemented features:

**Ch03 example 10** (lines ~237-250):
- Section: "Pattern 4: DataFrame Processing Functions"
- Uses: DataFrame::from_csv(), df.filter(), type annotations
- Action: Remove entire section

**Ch05 example 15** (lines ~362-382):
- Section: "DataFrame Filtering with Control Flow"
- Uses: DataFrame::from_csv(), df.filter(), row["field"]
- Action: Remove entire section

**Ch05 example 16** (lines ~384-405):
- Section: "DataFrame Iteration with Loops"
- Uses: DataFrame::from_csv(), df.iter_rows(), df["column"].iter()
- Action: Remove entire section

**Ch05 example 17** (lines ~407-425):
- Section: "DataFrame Processing with Match"
- Uses: DataFrame::from_csv(), df.iter_rows(), row["field"]
- Action: Remove entire section

### Phase 3: REFACTOR (Verify Fixes)
```bash
# Verify examples removed
! grep "DataFrame::from_csv" src/ch03-00-functions-tdd.md
! grep "DataFrame::from_csv" src/ch05-00-control-flow-tdd.md

# Test updated chapters
deno task extract-examples | grep -E "ch03|ch05"

# Expected:
# - Ch03: 11 → 10 examples (1 removed)
# - Ch05: 17 → 14 examples (3 removed)
# - Ch03: 10/10 passing (was 10/11)
# - Ch05: 14/14 passing (was 14/17)

# Overall
deno task extract-examples | grep "Examples working"
# Expected: 133/138 = 96% (was 133/142 = 94%)
```

## Detailed Changes

### Ch03: Remove Pattern 4 (DataFrame Processing)
**File**: `src/ch03-00-functions-tdd.md`
**Lines**: ~230-250

Remove section showing:
```ruchy
fun analyze_sales(df: DataFrame) -> DataFrame { ... }
let sales = DataFrame::from_csv("sales.csv");
```

### Ch05: Remove 3 DataFrame Sections
**File**: `src/ch05-00-control-flow-tdd.md`

**Section 1** (~lines 362-382): "DataFrame Filtering with Control Flow"
**Section 2** (~lines 384-405): "DataFrame Iteration with Loops"
**Section 3** (~lines 407-425): "DataFrame Processing with Match"

## Acceptance Criteria

- [ ] All 4 DataFrame::from_csv examples removed
- [ ] No "DataFrame::from_csv" strings in ch03 or ch05
- [ ] Ch03: 10/10 passing (was 10/11)
- [ ] Ch05: 14/14 passing (was 14/17)
- [ ] Overall: 138 examples, 133 passing (96%)
- [ ] Book builds successfully
- [ ] Pre-commit hooks pass

## Why Remove vs Replace?

**Considered**: Replace with working df![] examples

**Rejected because**:
1. The point of Ch05 examples is control flow WITH advanced DataFrame operations
2. Current DataFrame support (df![] only) doesn't support the patterns being taught
3. Simple df![] replacements would not demonstrate the intended concepts
4. Ch18 already has complete DataFrame documentation for what works

**Better approach**:
- Document ONLY working features (Ch18 does this correctly)
- Remove examples that can't work with current features
- When features are implemented, add examples back

## Success Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ch03 examples | 11 | 10 | -1 ✅ |
| Ch03 passing | 10/11 (91%) | 10/10 (100%) | +9% ✅ |
| Ch05 examples | 17 | 14 | -3 ✅ |
| Ch05 passing | 14/17 (82%) | 14/14 (100%) | +18% ✅ |
| Overall examples | 142 | 138 | -4 |
| Overall passing | 133/142 (94%) | 133/138 (96%) | +2% ✅ |
| DataFrame vaporware | 4 | 0 | -4 ✅ |

## Toyota Way Alignment

- **EXTREME TDD**: RED (confirm failures) → GREEN (remove vaporware) → REFACTOR (verify)
- **Zero defects**: Remove untestable/failing examples
- **Genchi Genbutsu**: Only document what actually works
- **Jidoka**: Quality gate enforcement (pre-commit)
- **Kaizen**: Small improvements (follows TICKET-021 pattern)

## Files to Modify

1. `src/ch03-00-functions-tdd.md` - Remove 1 DataFrame section
2. `src/ch05-00-control-flow-tdd.md` - Remove 3 DataFrame sections

## Risks

**Low Risk**:
- Following proven TICKET-021 pattern
- No logic changes, only removing non-working examples
- Ch18 already has complete DataFrame documentation

**Note**: When DataFrame::from_csv and advanced features are implemented, these examples can be added back to demonstrate their use.

## Timeline

- **Ticket creation**: 2025-10-30
- **Phase 1 RED**: 3 minutes (verify failures)
- **Phase 2 GREEN**: 10 minutes (remove 4 sections)
- **Phase 3 REFACTOR**: 5 minutes (test and verify)
- **Documentation**: 2 minutes
- **Total**: 20 minutes

---

**Status**: IN PROGRESS
**Next Action**: Phase 1 RED - Verify the 4 DataFrame::from_csv failures exist
