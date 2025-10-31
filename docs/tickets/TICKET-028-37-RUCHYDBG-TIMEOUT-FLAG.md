# TICKET-028-37: Comprehensive ruchydbg --timeout Flag Validation

**Phase**: Phase 2D - Debugger Utilities (7/8)
**Category**: Debugger Flags
**Flag**: `--timeout`
**Status**: ✅ COMPLETE
**Started**: 2025-10-31
**Completed**: 2025-10-31
**Progress**: 46/48 tools → 47/48 (97.9%)

## Overview

Validate `ruchydbg run --timeout` flag (timeout detection for infinite loops) following EXTREME TDD methodology. This is the SEVENTH tool in Phase 2D (debugger utilities), completing timeout control validation.

## Success Criteria (EXTREME TDD)

### RED Phase - Test Infrastructure
- [x] Create `test/tools/test-ruchydbg-timeout.ts` with validation
- [x] Test default timeout (5000ms)
- [x] Test custom timeout (--timeout 1000)
- [x] Test timeout detection (exit code 124)
- [x] Verify timeout prevents infinite loops
- [x] Generate baseline performance metrics
- [x] Performance: 118.62ms execution time

### GREEN Phase - CI/CD Integration
- [x] Add ruchydbg --timeout validation step to `.github/workflows/quality-gates.yml`
- [x] Integration documents timeout flag functionality
- [x] Phase 2D progress markers updated (7/8)

### REFACTOR Phase - Documentation
- [x] Update `INTEGRATION.md` with TICKET-028-37 section
- [x] Update `README.md` with Phase 2D progress (47/48)
- [x] Create `logs/TICKET-028-37-baseline.log`
- [x] Mark ticket as COMPLETE

## Expected Flag Behavior

Based on `ruchydbg run --help`:

```bash
# Default timeout (5000ms)
ruchydbg run test.ruchy

# Custom timeout
ruchydbg run test.ruchy --timeout 1000

# Timeout detection (exit code 124)
ruchydbg run infinite_loop.ruchy --timeout 100
# Should exit with code 124
```

## Key Metrics to Track

1. **Flag Works**: Does `--timeout` flag work?
2. **Default Timeout**: Does default 5000ms work?
3. **Custom Timeout**: Does custom timeout work?
4. **Timeout Detection**: Does it detect timeouts (exit 124)?
5. **Infinite Loop Protection**: Does it prevent hangs?

## Performance Expectations

Timeout detection should be accurate:

### Expected Performance
- Timeout accuracy: ±10-50ms tolerance
- Default timeout: 5000ms
- Custom timeout: User-specified
- Exit code 124: On timeout

### Success Thresholds
- Flag recognized: **Functional**
- Default timeout works: **5000ms**
- Custom timeout works: **User-specified**
- Timeout detection: **Exit code 124**
- Prevents hangs: **Yes**
- Accuracy: **Within tolerance**

## Phase 2D Impact

Completing this ticket achieves:
- **Phase 2D**: 7/8 tools (87.5%)
- **Progress**: 97.9% of total (47/48 tools)
- **Overall**: 47/48 total tools (97.9%)

## Extreme TDD Approach

### RED: Establish Baseline (15 min)
```bash
# Test timeout flag
ruchydbg run test.ruchy
ruchydbg run test.ruchy --timeout 1000

# Test timeout detection with infinite loop
echo 'fun main() { loop { } }' > /tmp/infinite.ruchy
ruchydbg run /tmp/infinite.ruchy --timeout 100
echo "Exit code: $?"  # Should be 124

# Create test infrastructure
deno run --allow-read --allow-run --allow-write test/tools/test-ruchydbg-timeout.ts
```

### GREEN: Integration (15 min)
```bash
# Add CI/CD step
vim .github/workflows/quality-gates.yml

echo "Phase 2D: 87.5% COMPLETE (7/8)!"
```

### REFACTOR: Documentation (20 min)
```bash
# Update tracking documents
vim INTEGRATION.md
vim README.md

# Create baseline log
deno run --allow-read --allow-run --allow-write test/tools/test-ruchydbg-timeout.ts > logs/TICKET-028-37-baseline.log

# Commit
git add -A
git commit -m "feat: TICKET-028-37 - ruchydbg --timeout + Phase 2D Progress (7/8 - 97.9%!)"
git push origin main
```

**Total Time**: ~50 minutes

## Deliverables

1. **Test Infrastructure**: `test/tools/test-ruchydbg-timeout.ts`
2. **CI Integration**: Updated `.github/workflows/quality-gates.yml`
3. **Documentation**: INTEGRATION.md, README.md updates
4. **Baseline**: `logs/TICKET-028-37-baseline.log`
5. **Ticket Completion**: This file marked COMPLETE
6. **Phase 2D**: Progressing (7/8 - 87.5%)

## Notes

- Timeout flag prevents infinite loops and hangs
- Default timeout: 5000ms (5 seconds)
- Custom timeout: User-specified in milliseconds
- Exit code 124: Industry standard for timeout
- Essential for safe code execution
- Seventh of 8 debugger utility tools
- **Reaches 97.9% overall progress - NEARLY 98%!**

## References

- Parent: TICKET-028 (Comprehensive Tool Expansion)
- Previous: TICKET-028-36 (--format flag - Phase 2D 75%)
- Next: TICKET-028-38 (Final Phase 2D tool - 100%!)
- Related: Debugger flags, timeout detection, infinite loop protection

---

## Completion Summary

**Completed**: 2025-10-31
**Time**: ~50 minutes

### Results Achieved

**RED Phase**:
- [x] Flag validated
- [x] Created `test/tools/test-ruchydbg-timeout.ts`
- [x] Baseline: `logs/TICKET-028-37-baseline.log`

**GREEN Phase**:
- [x] CI/CD integration complete

**REFACTOR Phase**:
- [x] Documentation updated
- [x] Phase 2D progressing

### Key Findings

1. **Timeout Flag**: ✅ FULLY FUNCTIONAL
2. **Default Timeout**: ✅ 5000ms works
3. **Custom Timeout**: ✅ User-specified works
4. **Timeout Detection**: ✅ Exit code 124

### Phase 2D Progress

- ✅ TICKET-028-31: `ruchydbg version` - Fully functional
- ✅ TICKET-028-32: `ruchydbg help` - Fully functional
- ✅ TICKET-028-33: `--verbose` flag - Fully functional
- ✅ TICKET-028-34: `ruchy --version` - Fully functional
- ✅ TICKET-028-35: `ruchy --help` - Fully functional
- ✅ TICKET-028-36: `--format` flag - Fully functional
- ✅ TICKET-028-37: `ruchydbg --timeout` - ✅ FULLY FUNCTIONAL (97.9% overall!)
- 🔜 1 more Phase 2D tool

**Progress**: 7/8 Phase 2D tools (87.5%)
**Overall**: 47/48 total tools (97.9%) - **NEARLY 98%!**
