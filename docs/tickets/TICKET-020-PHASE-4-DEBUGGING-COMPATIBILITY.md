# TICKET-020 Phase 4: Debugging Compatibility Matrix

**Date**: 2025-10-30
**Phase**: TDD RED + GREEN (Test debugging on working examples)
**Status**: PLANNED
**Parent**: TICKET-020-DEBUGGING-TOOLS-MANDATORY.md
**Previous**: TICKET-020-PHASE-3-COMPLETE.md

## Objective

Test RUCHY_TRACE=1 debugging on a representative sample of the 129 working book examples to determine:
1. Which types of code work with debugging
2. Which types produce useful trace output
3. Any edge cases or limitations
4. Create comprehensive compatibility matrix

## Why Phase 4 Matters

**Context**: Phase 3 fixed Chapter 13 debugging examples (10/10 passing). Now we need to validate that debugging works across ALL types of Ruchy code throughout the book.

**Value**:
- ✅ Confidence that users can debug ANY working example
- ✅ Documentation of debugging capabilities and limitations
- ✅ Identification of any debugging regressions
- ✅ Comprehensive compatibility matrix for reference

## Methodology (EXTREME TDD)

### Phase 4A: TDD RED (Sample Selection)
Select 10 diverse working examples representing different Ruchy features:

1. **Simple function** (Ch1 or Ch2) - baseline test
2. **Multi-argument function** (Ch3) - parameter tracing
3. **Recursive function** (Ch5 or other) - call stack depth
4. **Array operations** (Ch6) - data structure tracing
5. **String operations** (Ch2 or Ch4) - string type tracing
6. **Float/arithmetic** (Ch2 or Ch4) - numeric type tracing
7. **Control flow** (Ch5) - branch tracing
8. **I/O operations** (Ch10) - side effect tracing
9. **DataFrame operations** (Ch18) - complex type tracing
10. **Struct methods** (Ch19) - object-oriented tracing

### Phase 4B: TDD GREEN (Test Each Example)
For each selected example:
1. Extract the code from chapter
2. Run with `RUCHY_TRACE=1`
3. Document:
   - ✅ Does it produce trace output?
   - ✅ Is the trace output useful?
   - ✅ Are types shown correctly?
   - ✅ Any errors or issues?

### Phase 4C: REFACTOR (Document Findings)
1. Create compatibility matrix table
2. Document any discovered limitations
3. Update INTEGRATION.md with Phase 4 results
4. Create recommendations for users

## Sample Selection Criteria

**Goal**: Maximum diversity to stress-test debugging

**Categories**:
- Simple vs complex
- Pure functions vs I/O
- Primitive types vs complex types (arrays, DataFrames, structs)
- Shallow vs deep recursion
- Short vs long execution

**Selection Method**:
```bash
# Pick one example from each major category
# Examples should be from "passing" list (129 working examples)
# Prioritize examples from high-pass-rate chapters
```

## Expected Outcomes

### Success Criteria
- [ ] 10 diverse examples selected
- [ ] All 10 tested with RUCHY_TRACE=1
- [ ] Compatibility matrix created
- [ ] Results documented in Phase 4 summary
- [ ] INTEGRATION.md updated

### Deliverables
1. **Test script**: `test/test-debugging-compatibility.sh`
2. **Results document**: `docs/tickets/TICKET-020-PHASE-4-RESULTS.md`
3. **Compatibility matrix**: Table showing which features work with debugging
4. **Updated INTEGRATION.md**: Phase 4 findings added

## Compatibility Matrix Template

```markdown
| Feature Category | Example | Chapter | RUCHY_TRACE Works? | Type Info? | Notes |
|------------------|---------|---------|-------------------|------------|-------|
| Simple function  | add()   | Ch3     | ✅                | ✅         | Perfect |
| Recursion        | fib()   | Ch13    | ✅                | ✅         | Full stack |
| Arrays           | map()   | Ch6     | ?                 | ?          | TBD |
| DataFrames       | df![]   | Ch18    | ?                 | ?          | TBD |
| Structs          | Point   | Ch19    | ?                 | ?          | TBD |
| I/O              | read()  | Ch10    | ?                 | ?          | TBD |
| Control flow     | if/else | Ch5     | ?                 | ?          | TBD |
| Strings          | concat  | Ch2     | ?                 | ?          | TBD |
| Floats           | sqrt()  | Ch4     | ?                 | ?          | TBD |
| Multi-arg        | calc()  | Ch3     | ?                 | ?          | TBD |
```

## Implementation Plan

### Step 1: Create Test Script (TDD RED)
```bash
#!/usr/bin/env bash
# test/test-debugging-compatibility.sh
# TICKET-020 Phase 4: Test debugging on diverse working examples

echo "🐛 TICKET-020 Phase 4: Debugging Compatibility Testing"
echo "======================================================"

# Test 10 diverse examples with RUCHY_TRACE=1
# Document results in structured format
# Generate compatibility matrix
```

### Step 2: Run Tests (TDD GREEN)
```bash
# Run the test script
bash test/test-debugging-compatibility.sh

# Document results
# Create compatibility matrix
# Identify any issues
```

### Step 3: Document Results (REFACTOR)
```bash
# Write Phase 4 results document
# Update INTEGRATION.md
# Commit all changes
```

## Risk Assessment

**Low Risk**:
- ✅ We know debugging works (Chapter 13 at 100%)
- ✅ RUCHY_TRACE=1 method is proven
- ✅ No code changes required (documentation only)

**Potential Discoveries**:
- ⚠️ Some code types may not trace (e.g., pure expressions)
- ⚠️ Complex types may have limited trace detail
- ⚠️ I/O operations may not show in trace

**Mitigation**:
- Document limitations clearly
- Provide workarounds where possible
- Set user expectations appropriately

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Examples tested | 10 | Count in test script |
| Categories covered | 10 | Diversity checklist |
| Compatibility documented | 100% | All results in matrix |
| Phase 4 time | <2 hours | Toyota Way efficiency |

## Next Steps After Phase 4

**If all tests pass (expected)**:
- ✅ TICKET-020 complete - debugging validated across book
- ✅ Update INTEGRATION.md with "100% debugging compatible" status
- ✅ Move to next roadmap ticket

**If issues found**:
- 📝 Document limitations in INTEGRATION.md
- 📝 Create user guidance for debugging different code types
- 📝 File issues for any debugging bugs discovered

## Toyota Way Alignment

- **EXTREME TDD**: RED (select examples) → GREEN (test each) → REFACTOR (document)
- **Genchi Genbutsu**: Actually test debugging on real examples
- **Comprehensive testing**: Sample represents ALL major features
- **Zero defects**: Any issues discovered are documented fully

## Timeline

- **Phase 4A (Sample Selection)**: 15 minutes
- **Phase 4B (Testing)**: 45 minutes (10 examples × 4-5 min each)
- **Phase 4C (Documentation)**: 30 minutes
- **Total**: ~90 minutes

---

**Phase 4 Status**: PLANNED
**Next Action**: Create test/test-debugging-compatibility.sh and select 10 examples
