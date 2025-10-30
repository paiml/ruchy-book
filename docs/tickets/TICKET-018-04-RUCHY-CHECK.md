# TICKET-018-04: Integrate `ruchy check` - Syntax Validation

**Created**: 2025-10-30
**Status**: IN PROGRESS
**Priority**: P0 (Critical - Foundation)
**Parent**: TICKET-018 (Comprehensive 18-Tool Testing)
**Estimated Effort**: 2 hours
**Ruchy Version**: v3.151.0

## Executive Summary

Integrate `ruchy check` syntax validation into the comprehensive testing pipeline. This is the first of 18 tools and establishes the pattern for subsequent integrations. Already showing 69/69 files passing (100% success rate), making this the ideal starting point.

## Current State

### Baseline Testing (Pre-Integration)
```bash
$ cd /home/noah/src/ruchy-book
$ make dogfood-check
```

**Results (v3.151.0)**:
- Files Tested: 69/69
- Syntax Valid: 69/69 (100%)
- Syntax Errors: 0
- Status: ✅ All examples syntactically correct

### What `ruchy check` Does

The `ruchy check` command performs static syntax validation without executing code:
- Parses source code into AST
- Validates syntax correctness
- Detects malformed expressions
- Checks basic type consistency
- Fast feedback (<100ms per file)

**Does NOT**:
- Execute code
- Perform deep type checking
- Validate runtime behavior
- Check performance characteristics

## Objectives

### Primary Goals
1. **Establish Integration Pattern**: Create reproducible approach for remaining 17 tools
2. **Baseline Documentation**: Record 100% syntax correctness state
3. **CI/CD Integration**: Add `ruchy check` to automated pipelines
4. **Quality Gates**: Define acceptance criteria for syntax validation

### Success Criteria
- [ ] All 69 files continue passing `ruchy check`
- [ ] CI/CD pipeline runs `ruchy check` on modified files
- [ ] INTEGRATION.md updated with `ruchy check` results
- [ ] Documentation includes syntax validation insights
- [ ] Pattern established for TICKET-018-05 through TICKET-018-18

## EXTREME TDD Approach

### Phase 1: RED (Document Expected Behavior)

**Expected Behavior**:
- All 69 example files should pass syntax validation
- No syntax errors expected
- Edge cases: Empty files, complex expressions, nested structures

**Test Command**:
```bash
# Run baseline test
make dogfood-check > logs/TICKET-018-04-baseline.log 2>&1

# Verify expectations
grep -q "69/69" logs/TICKET-018-04-baseline.log && echo "✅ Baseline confirmed"
```

**Success Criteria for RED Phase**:
- [x] Baseline results documented (69/69 passing)
- [x] Expected behavior defined (100% pass rate)
- [x] Test command established
- [x] Logging infrastructure ready

### Phase 2: GREEN (Integration Implementation)

**Implementation Tasks**:

1. **Create Test Infrastructure**:
```bash
# Create dedicated test script for ruchy check
cat > test/tools/test-ruchy-check.ts <<'EOF'
// Deno test script for ruchy check validation
import { walk } from "https://deno.land/std/fs/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

interface CheckResult {
  file: string;
  passed: boolean;
  error?: string;
}

async function runRuchyCheck(file: string): Promise<CheckResult> {
  const cmd = new Deno.Command("ruchy", {
    args: ["check", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr } = await cmd.output();

  return {
    file,
    passed: code === 0,
    error: code !== 0 ? new TextDecoder().decode(stderr) : undefined,
  };
}

async function main() {
  const results: CheckResult[] = [];

  // Find all .ruchy files
  for await (const entry of walk("test/extracted-examples", {
    exts: [".ruchy"],
  })) {
    if (entry.isFile) {
      const result = await runRuchyCheck(entry.path);
      results.push(result);

      if (!result.passed) {
        console.error(`❌ ${entry.path}: ${result.error}`);
      } else {
        console.log(`✅ ${entry.path}`);
      }
    }
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const rate = ((passed / total) * 100).toFixed(1);

  console.log(`\n📊 Summary: ${passed}/${total} (${rate}%)`);

  // Exit with appropriate code
  Deno.exit(passed === total ? 0 : 1);
}

main();
EOF
```

2. **Update CI/CD Pipeline**:
```bash
# Add to .github/workflows/test.yml
# (Already exists in pre-commit hook, ensure consistency)
```

3. **Update Makefile**:
```makefile
# Ensure dogfood-check target is properly defined
dogfood-check:
	@echo "🔍 Running syntax validation (ruchy check)..."
	@ruchy check test/extracted-examples/**/*.ruchy
```

4. **Run Integration Test**:
```bash
# Execute the new test infrastructure
deno run --allow-read --allow-run test/tools/test-ruchy-check.ts
```

**Success Criteria for GREEN Phase**:
- [ ] Test script created and operational
- [ ] All 69 files pass validation
- [ ] CI/CD integration verified
- [ ] Makefile target confirmed working

### Phase 3: REFACTOR (Optimize and Document)

**Optimization Opportunities**:
1. Parallel execution for faster validation
2. Caching of unchanged files
3. Incremental validation (only modified files)

**Documentation Updates**:
1. **INTEGRATION.md**: Add `ruchy check` section
   ```markdown
   ### Syntax Validation (ruchy check)
   - **Files Tested**: 69/69
   - **Pass Rate**: 100%
   - **Status**: ✅ All examples syntactically correct
   - **Tool Version**: ruchy v3.151.0
   - **Last Updated**: 2025-10-30
   ```

2. **README.md**: Update quality metrics
   ```markdown
   - Syntax Validation: 69/69 files (100%)
   ```

3. **Create Insights Document**: `docs/insights/syntax-validation.md`
   - Common syntax patterns
   - Edge cases handled correctly
   - Recommendations for future examples

**Success Criteria for REFACTOR Phase**:
- [ ] INTEGRATION.md updated with results
- [ ] README.md metrics updated
- [ ] Insights documented
- [ ] Code cleaned and optimized
- [ ] Pattern documented for future tools

## Acceptance Criteria

### Functional Requirements
- [x] `ruchy check` runs successfully on all 69 files
- [x] 100% pass rate maintained (69/69)
- [ ] CI/CD pipeline includes `ruchy check`
- [ ] Test failures block commits (pre-commit hook)
- [ ] Results logged and tracked

### Quality Requirements
- [ ] Zero regressions from current state
- [ ] Execution time < 5 seconds for all files
- [ ] Reproducible results (deterministic)
- [ ] Clear error messages on failures
- [ ] Documentation complete and accurate

### Documentation Requirements
- [ ] INTEGRATION.md updated with results
- [ ] Syntax validation insights documented
- [ ] Edge cases identified and documented
- [ ] Integration pattern documented for future tools
- [ ] Commit message references TICKET-018-04

## Risk Assessment

### Risks (Low)
- ✅ **Syntax Correctness**: Already 69/69 passing
- ✅ **Tool Stability**: `ruchy check` is mature
- ✅ **Integration Complexity**: Simple command-line tool
- ⚠️ **CI/CD Resources**: May increase build time slightly

### Mitigation Strategies
- Parallel execution for speed
- Incremental validation for efficiency
- Caching for unchanged files
- Early exit on first failure in development

## Timeline

### Hour 1: Integration
- Minutes 0-15: Create test infrastructure
- Minutes 15-30: Update CI/CD pipeline
- Minutes 30-45: Run and verify tests
- Minutes 45-60: Fix any issues discovered

### Hour 2: Documentation
- Minutes 0-20: Update INTEGRATION.md
- Minutes 20-40: Document insights
- Minutes 40-50: Update README.md
- Minutes 50-60: Commit and push

**Total Estimated Time**: 2 hours

## Success Metrics

### Quantitative
- **Files Validated**: 69/69 (100%)
- **Execution Time**: < 5 seconds
- **CI/CD Impact**: < +30 seconds to pipeline
- **Error Rate**: 0 false positives

### Qualitative
- **Developer Experience**: Fast feedback on syntax errors
- **Integration Pattern**: Reusable for 17 remaining tools
- **Documentation Quality**: Clear and comprehensive
- **Confidence Level**: High (baseline already passing)

## Dependencies

### Prerequisites (Completed ✅)
- ✅ Ruchy v3.151.0 installed
- ✅ 100% pass rate achieved (135/135 examples)
- ✅ Test infrastructure operational
- ✅ INTEGRATION.md established

### Blockers (None)
- No known blockers

### Downstream Impact
- Establishes pattern for TICKET-018-07 (ruchy lint)
- Validates approach for remaining 17 tools
- Proves feasibility of 18-tool integration

## Testing Strategy

### Test Scenarios

1. **Happy Path**: All files pass validation
   ```bash
   make dogfood-check
   # Expected: 69/69 passing
   ```

2. **Syntax Error Detection**: Intentional syntax error
   ```bash
   echo 'fun broken(' > test/broken.ruchy
   ruchy check test/broken.ruchy
   # Expected: Syntax error detected
   rm test/broken.ruchy
   ```

3. **Empty File Handling**:
   ```bash
   touch test/empty.ruchy
   ruchy check test/empty.ruchy
   # Expected: Valid (empty programs are valid)
   rm test/empty.ruchy
   ```

4. **Complex Expression Validation**:
   ```bash
   # Already tested in existing examples
   # Ch11, Ch15 have complex syntax
   ```

### Validation Commands

```bash
# Pre-integration baseline
make dogfood-check > baseline.log

# Post-integration verification
make dogfood-check > verification.log

# Compare (should be identical)
diff baseline.log verification.log
```

## Next Steps After Completion

1. **Mark TICKET-018-04 complete**
2. **Create TICKET-018-07**: `ruchy lint` integration (also already passing 69/69)
3. **Apply learned patterns** to accelerate remaining 16 tools
4. **Update master ticket** (TICKET-018) with progress

## Related Tickets

- **Parent**: TICKET-018 (Comprehensive 18-Tool Testing)
- **Predecessor**: TICKET-027 (Last ticket before 100% achievement)
- **Successor**: TICKET-018-07 (ruchy lint integration)

## Notes

### Why Start Here?
- ✅ Already 100% passing (low risk)
- ✅ Simple integration (establishes pattern)
- ✅ Fast execution (good developer experience)
- ✅ Clear success criteria (deterministic)
- ✅ Foundation for remaining tools

### Lessons Learned (To Be Filled)
- TBD after completion

### Recommendations for Future Tools (To Be Filled)
- TBD after completion

---

**Status**: 🚀 Ready to begin RED phase
**Risk Level**: Low (already passing baseline)
**Expected Outcome**: 100% success, pattern established for 17 remaining tools
