# TICKET-021: Remove Vaporware Documentation

**Date**: 2025-10-30
**Priority**: HIGH (Blocking commits)
**Type**: Quality Gate / Technical Debt
**Status**: IN PROGRESS
**Estimated Time**: 15 minutes

## Problem

Pre-commit hook is blocking commits due to vaporware documentation in `src/ch19-00-structs-oop.md`:

```bash
# GATE 5: No vaporware documentation
! grep -r "coming soon\|not yet implemented\|TODO" src/ || {
    echo "❌ BLOCKED: Vaporware documentation found"
    exit 1
}
```

**Found**:
```
src/ch19-00-structs-oop.md:230:*Note: Pattern matching for structs is planned but not yet implemented in v3.169.0*
```

## CLAUDE.md Rules Violated

From `CLAUDE.md`:
```markdown
1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware.
   If it doesn't compile in current `ruchy`, it doesn't go in the book.

## Non-Goals (What NOT to Document)
- **Theoretical features**: Only what ships
```

## Impact

- **Blocking**: Cannot commit any changes (pre-commit hook fails)
- **Quality**: Violates zero-tolerance vaporware policy
- **Trust**: Book should only document working features

## Root Cause

Chapter 19 has a section titled "Pattern Matching with Structs (Planned)" that documents a feature not yet implemented. The section includes:
- Vaporware note mentioning v3.169.0 (outdated version)
- Code with `<!-- skip-test: planned-feature -->` tag
- Examples that don't compile

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Issue)
```bash
# Confirm vaporware exists
grep -r "not yet implemented\|coming soon\|TODO" src/

# Confirm pre-commit fails
git commit --allow-empty -m "test" # Should fail at GATE 5
```

### Phase 2: TDD GREEN (Remove Vaporware)
```bash
# Remove the entire "Pattern Matching with Structs (Planned)" section
# from src/ch19-00-structs-oop.md (lines ~228-245)
```

### Phase 3: REFACTOR (Verify Fix)
```bash
# Verify no vaporware remains
! grep -r "not yet implemented\|coming soon\|TODO" src/

# Verify pre-commit passes
git add src/ch19-00-structs-oop.md
git commit -m "test" # Should pass all gates

# Run chapter test
deno task extract-examples # Should still show Ch19 at 100%
```

## Acceptance Criteria

- [ ] No vaporware strings in any src/*.md files
- [ ] Pre-commit hook GATE 5 passes
- [ ] Chapter 19 still has 8/8 examples passing (no regression)
- [ ] Book builds successfully with mdbook

## Alternative Considered

**Test if pattern matching is implemented in v3.169.0:**
- Could test if the feature now works
- If it works, remove the vaporware note and enable the example
- If it doesn't work, remove the section entirely

**Decision**: Remove the section entirely (faster, safer)
- Version note is outdated (v3.169.0 vs v3.169.0)
- No evidence the feature is now implemented
- Follows zero-tolerance vaporware policy

## Files to Modify

1. `src/ch19-00-structs-oop.md` - Remove lines ~228-245 (pattern matching section)

## Testing Plan

```bash
# Before fix
grep "not yet implemented" src/ch19-00-structs-oop.md # Should find it

# Apply fix (remove section)

# After fix
grep "not yet implemented" src/ch19-00-structs-oop.md # Should find nothing
! grep -r "not yet implemented\|coming soon\|TODO" src/ # Should pass

# Verify chapter still works
deno task extract-examples | grep "ch19" # Should show 8/8 passing
```

## Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Vaporware instances | 1 | 0 | 0 |
| Pre-commit gate 5 | ❌ Fail | ✅ Pass | Pass |
| Ch19 examples | 8/8 | 8/8 | 8/8 |
| Commit capability | Blocked | Unblocked | Unblocked |

## Toyota Way Alignment

- **Zero defects**: Remove quality gate violation
- **Genchi Genbutsu**: Verify actual feature status, don't document theory
- **Kaizen**: Small incremental fix (15 minutes)
- **Jidoka**: Automated quality gate working as intended

## Timeline

- **Ticket creation**: 2025-10-30
- **Fix application**: 5 minutes
- **Testing**: 5 minutes
- **Documentation**: 5 minutes
- **Total**: 15 minutes

---

**Status**: IN PROGRESS
**Next Action**: Remove pattern matching section from ch19-00-structs-oop.md
