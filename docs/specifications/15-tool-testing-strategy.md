# 15-Tool Testing Strategy for Ruchy Book

**Version**: 1.0
**Status**: Active
**Last Updated**: 2025-10-13

## Overview

This document defines our comprehensive 15-tool testing strategy for the Ruchy Book project, integrating all professional Ruchy compiler tools into our Test-Driven Documentation (TDD) workflow.

## Philosophy: Heavy Dogfooding

**"Eat your own dog food"** - We use ALL Ruchy tools against all book examples to ensure:
1. **Tools Work**: Every tool is validated against real code
2. **Examples Quality**: Examples meet professional standards
3. **Documentation Accuracy**: Tools catch documentation errors
4. **Compiler Validation**: Book serves as comprehensive compiler test suite

## The 15 Professional Ruchy Tools

### Core Development Tools (6)

#### 1. `ruchy check` - Syntax Validation
**Purpose**: Validate syntax without running
**Usage in Book**:
```bash
make dogfood-check
# Tests all .ruchy files for syntax errors
```

**Quality Gate**: 100% pass rate required
**Example**:
```bash
ruchy check example.ruchy
# ✅ Syntax valid
```

#### 2. `ruchy test` - Enhanced Testing
**Purpose**: Run tests with coverage reporting
**Usage in Book**:
```bash
make dogfood-test
# Runs enhanced testing on all examples
```

**Quality Gate**: 100% test execution success
**Example**:
```bash
ruchy test test_example.ruchy
# Running tests with coverage...
# ✅ All tests passed
```

#### 3. `ruchy fmt` - Format Validation
**Purpose**: Format Ruchy source code
**Usage in Book**:
```bash
make dogfood-fmt
# Validates formatting on all examples
```

**Quality Gate**: 100% formatted correctly
**Example**:
```bash
ruchy fmt example.ruchy --check
# ✅ Formatting correct
```

#### 4. `ruchy lint` - Style Analysis
**Purpose**: Lint for issues and style violations
**Usage in Book**:
```bash
make dogfood-lint
# Style analysis on all examples
```

**Quality Gate**: A+ lint score
**Example**:
```bash
ruchy lint example.ruchy
# ✅ No style violations found
```

#### 5. `ruchy run` - Execute Code
**Purpose**: Compile and run Ruchy files
**Usage in Book**:
```bash
ruchy run example.ruchy
# Executes example and shows output
```

**Quality Gate**: Expected output matches
**Example**:
```bash
ruchy run hello.ruchy
# Hello, World!
```

#### 6. `ruchy compile` - Standalone Binary
**Purpose**: Compile to standalone binary
**Usage in Book**:
```bash
ruchy compile example.ruchy -o ./example
./example
```

**Quality Gate**: Compiles and executes successfully

### Quality Analysis Tools (5)

#### 7. `ruchy provability` - Formal Verification
**Purpose**: Formal verification and correctness analysis
**Usage in Book**:
```bash
make dogfood-provability
# Formal verification on all functions
```

**Quality Gate**: 90%+ provability score
**Example**:
```bash
ruchy provability example.ruchy
# Provability Score: 100.0%
# ✅ All functions verifiable
```

#### 8. `ruchy runtime` - Performance Analysis
**Purpose**: Performance analysis and BigO complexity detection
**Usage in Book**:
```bash
make dogfood-runtime
# Performance analysis on all examples
```

**Quality Gate**: O(n log n) or better
**Example**:
```bash
ruchy runtime quicksort.ruchy
# Complexity: O(n log n)
# Optimization Score: 100%
```

#### 9. `ruchy score` - Quality Scoring
**Purpose**: Unified quality scoring
**Usage in Book**:
```bash
make dogfood-score
# Quality scoring on all examples
```

**Quality Gate**: A+ grade (9.5+/10)
**Example**:
```bash
ruchy score example.ruchy
# Quality Score: 1.000/1.000 (A+)
```

#### 10. `ruchy quality-gate` - Gate Enforcement
**Purpose**: Quality gate enforcement
**Usage in Book**:
```bash
make dogfood-quality-gate
# Enforces quality gates
```

**Quality Gate**: All gates must pass
**Example**:
```bash
ruchy quality-gate example.ruchy
# ✅ All quality gates passed
```

#### 11. `ruchy coverage` - Coverage Reporting
**Purpose**: Generate coverage report
**Usage in Book**:
```bash
make dogfood-coverage
# Coverage analysis on all examples
```

**Quality Gate**: 100% coverage (book examples)
**Example**:
```bash
ruchy coverage example.ruchy
# Coverage: 100%
```

### Advanced Tools (4)

#### 12. `ruchy optimize` - Hardware Optimization
**Purpose**: Hardware-aware optimization analysis
**Usage in Book**:
```bash
make dogfood-optimize
# Hardware optimization analysis
```

**Quality Gate**: Optimal for target platform
**Example**:
```bash
ruchy optimize example.ruchy
# Platform: x86_64
# SIMD: AVX2 available
# ✅ Optimal configuration
```

#### 13. `ruchy prove` - Theorem Prover
**Purpose**: Interactive theorem prover
**Usage in Book**:
```bash
make dogfood-prove
# Theorem proving on all examples (batch mode)
```

**Quality Gate**: All proofs valid
**Example**:
```bash
ruchy prove example.ruchy --batch
# ✅ All theorems proven
```

#### 14. `ruchy doc` - Documentation Generation
**Purpose**: Generate documentation from source
**Usage in Book**:
```bash
make dogfood-doc
# Documentation generation
```

**Quality Gate**: Complete documentation generated
**Example**:
```bash
ruchy doc example.ruchy --output docs/
# ✅ Documentation generated
```

#### 15. `ruchy bench` - Performance Benchmarking
**Purpose**: Benchmark code performance
**Usage in Book**:
```bash
make dogfood-bench
# Performance benchmarking
```

**Quality Gate**: Meets performance targets
**Example**:
```bash
ruchy bench example.ruchy
# Benchmark: 1.234ms (±0.05ms)
# ✅ Performance target met
```

## Testing Workflow Integration

### 1. Example Extraction Phase
```bash
deno task extract-examples
# Extracts all ```ruchy blocks from markdown
```

### 2. Basic Compilation Phase
```bash
make test-comprehensive
# Tests all examples compile and run
```

### 3. Heavy Dogfooding Phase
```bash
make dogfood-full
# Runs ALL 15 tools against all examples
```

### 4. Results Integration Phase
```bash
make update-integration-docs
# Updates INTEGRATION.md with results
```

## Quality Gates Per Tool

| Tool | Gate | Threshold | Blocking |
|------|------|-----------|----------|
| check | Syntax Valid | 100% | ✅ Yes |
| test | Tests Pass | 100% | ✅ Yes |
| fmt | Formatted | 100% | ⚠️ Advisory |
| lint | Style Clean | A+ | ✅ Yes |
| provability | Verifiable | 90%+ | ⚠️ Advisory |
| runtime | Complexity | O(n log n) | ⚠️ Advisory |
| score | Quality | A+ (9.5+) | ✅ Yes |
| quality-gate | All Gates | 100% | ✅ Yes |
| coverage | Code Coverage | 100% | ✅ Yes |
| optimize | Optimal | Platform-specific | ⚠️ Advisory |
| prove | Proofs Valid | 100% | ⚠️ Advisory |
| doc | Docs Complete | 100% | ⚠️ Advisory |
| bench | Performance | Target-specific | ⚠️ Advisory |
| run | Executes | 100% | ✅ Yes |
| compile | Builds | 100% | ✅ Yes |

## Makefile Integration

### Quick Dogfooding (Essential)
```makefile
dogfood-quick: dogfood-check dogfood-lint dogfood-fmt dogfood-score
```
**Time**: ~1 minute
**Use Case**: Pre-commit checks

### Quality-Focused Dogfooding
```makefile
dogfood-quality: dogfood-check dogfood-lint dogfood-provability dogfood-score dogfood-quality-gate
```
**Time**: ~3 minutes
**Use Case**: Before chapter completion

### Performance-Focused Dogfooding
```makefile
dogfood-performance: dogfood-runtime dogfood-optimize dogfood-bench
```
**Time**: ~2 minutes
**Use Case**: Performance-sensitive examples

### Complete Dogfooding (All 15 Tools)
```makefile
dogfood-full: [all 15 tool targets]
```
**Time**: ~5 minutes
**Use Case**: Version qualification, releases

## Per-Chapter Tool Strategy

### Foundation Chapters (Ch 1-3)
**Essential Tools**:
- ✅ check, run, compile (must work)
- ✅ lint, score (quality)
- ⚠️ fmt (advisory)

**Example**:
```bash
# Ch01 Hello World
make test-ch01
make dogfood-check
make dogfood-lint
make dogfood-score
```

### Core Features (Ch 4-6)
**Add Tools**:
- ✅ provability (functions)
- ✅ runtime (algorithms)
- ✅ coverage (completeness)

### Advanced Chapters (Ch 7+)
**Full Suite**:
- ✅ All 15 tools
- ✅ Comprehensive quality gates
- ✅ Performance benchmarking

## Continuous Integration

### On Every Push
```yaml
- run: deno task extract-examples
- run: deno task test-examples
- run: deno task test-oneliners
- run: make dogfood-quick
- run: make update-integration-docs
```

### On Version Qualification
```yaml
- run: make sync-version
- run: make test-comprehensive
- run: make dogfood-full
- run: make update-integration-docs
- run: git add INTEGRATION.md && git commit && git push
```

### On Release
```yaml
- run: make dogfood-full
- run: make validate
- run: make build
- run: make deploy
```

## Results Tracking

### INTEGRATION.md Format
```markdown
## Dogfooding Results (v3.213.0)

**Date**: 2025-10-13
**Examples Tested**: 381

### Tool Results

| Tool | Pass | Fail | Pass Rate | Grade |
|------|------|------|-----------|-------|
| check | 231 | 150 | 61% | C |
| lint | 231 | 150 | 61% | C |
| score | 200 | 181 | 52% | D |
| provability | 180 | 201 | 47% | F |
| runtime | 190 | 191 | 50% | D |

### Quality Summary

- **Blocking Gates**: 3/5 passing (60%)
- **Advisory Gates**: 2/10 passing (20%)
- **Overall Grade**: D (Need Improvement)

### Action Items

1. Fix syntax errors in 150 examples
2. Improve style compliance
3. Add formal verification annotations
```

## Example Test Suite

### Simple Function (Foundation)
```ruchy
// test/ch03-functions/simple_add.ruchy
fun add(a: i32, b: i32) -> i32 {
    a + b
}

fun main() {
    let result = add(2, 3)
    println(result)  // Expected: 5
}
```

**Tool Results**:
```bash
ruchy check ✅       # Syntax valid
ruchy run ✅         # Output: 5
ruchy lint ✅        # No style issues
ruchy score ✅       # Grade: A+
ruchy provability ✅ # 100% provable
ruchy runtime ✅     # O(1) complexity
```

### Advanced Example (Performance)
```ruchy
// test/ch15-algorithms/quicksort.ruchy
fun quicksort(arr: [i32]) -> [i32] {
    if arr.len() <= 1 {
        arr
    } else {
        let pivot = arr[0]
        let less = arr.filter(|x| x < pivot)
        let greater = arr.filter(|x| x > pivot)
        quicksort(less) + [pivot] + quicksort(greater)
    }
}
```

**Tool Results**:
```bash
ruchy check ✅       # Syntax valid
ruchy runtime ✅     # O(n log n) complexity
ruchy provability ⚠️ # 85% provable (recursive)
ruchy optimize ✅    # Optimal for platform
ruchy bench ✅       # 1.2ms for 1000 elements
```

## Roadmap Integration

### Sprint 1 (CURRENT)
- ✅ BOOK-001: Test infrastructure
- ✅ BOOK-002: Language specification
- ✅ BOOK-003: YAML roadmap
- 🔄 **BOOK-004**: 15-tool testing integration

### New Ticket: BOOK-004a
```yaml
- id: BOOK-004a
  title: "Integrate 15-tool testing into CI/CD"
  priority: high
  status: pending
  requirements:
    - "All 15 tools in dogfood-full target"
    - "Per-chapter tool strategies defined"
    - "CI/CD integration complete"
    - "INTEGRATION.md updated with tool results"
  tests:
    - "test_all_15_tools_execute"
    - "test_results_tracked_in_integration_md"
    - "test_quality_gates_enforced"
  acceptance:
    - "make dogfood-full passes"
    - "All 15 tools tested"
    - "Results in INTEGRATION.md"
```

## Performance Targets

### Per-Tool Execution Time
- check: <5s per example
- test: <10s per example
- fmt: <2s per example
- lint: <5s per example
- provability: <30s per example
- runtime: <10s per example
- score: <5s per example
- quality-gate: <10s per example
- coverage: <15s per example
- optimize: <10s per example
- prove: <60s per example
- doc: <5s per example
- bench: <30s per example
- run: <5s per example
- compile: <10s per example

**Total Time (381 examples)**: ~30 minutes for complete suite

## Optimization Strategies

### Parallel Execution
```makefile
dogfood-parallel:
	@parallel -j4 ruchy check ::: $(RUCHY_FILES)
	@parallel -j4 ruchy lint ::: $(RUCHY_FILES)
	@parallel -j4 ruchy score ::: $(RUCHY_FILES)
```

### Incremental Testing
```makefile
dogfood-incremental:
	@git diff --name-only HEAD~1 | grep '\.ruchy$$' | xargs -I {} ruchy check {}
```

### Caching
```bash
# Cache tool results
CACHE_DIR=.ruchy-cache
ruchy check example.ruchy --cache $CACHE_DIR
```

## Failure Recovery

### When check Fails
1. Fix syntax errors immediately
2. Re-run: `make dogfood-check`
3. Update chapter documentation
4. Commit fix

### When lint Fails
1. Run: `ruchy fmt example.ruchy`
2. Review style violations
3. Fix manually if needed
4. Re-test

### When quality-gate Fails
1. Check which gate failed
2. Fix underlying issue
3. Re-run full suite
4. Document resolution

## Success Metrics

### Current (v3.213.0)
- check: 231/381 (61%)
- lint: 231/381 (61%)
- score: TBD

### Target (v3.213.0)
- check: 381/381 (100%) ✅
- lint: 381/381 (100%) ✅
- score: 381/381 A+ ✅
- provability: 350/381 (92%) ✅
- runtime: 381/381 optimal ✅

### Ultimate Goal
**ALL 15 tools at 100% pass rate on ALL examples**

## Tool Versions

Track tool versions for reproducibility:
```yaml
tools:
  ruchy: 1.84.0
  ruchy-coverage: 1.0.0

versions:
  check: built-in
  test: built-in
  fmt: built-in
  lint: built-in
  provability: built-in
  runtime: built-in
  score: built-in
  quality-gate: built-in
  coverage: external
  optimize: built-in
  prove: built-in
  doc: built-in
  bench: built-in
  run: built-in
  compile: built-in
```

## Conclusion

This 15-tool testing strategy ensures:

1. **Comprehensive Validation**: Every example tested with all tools
2. **Professional Quality**: A+ grades across all metrics
3. **Compiler Validation**: Book serves as comprehensive test suite
4. **Documentation Accuracy**: Tools catch errors automatically
5. **Continuous Improvement**: Metrics tracked over time

**Remember**: If it isn't tested with all 15 tools, it isn't production-ready!
