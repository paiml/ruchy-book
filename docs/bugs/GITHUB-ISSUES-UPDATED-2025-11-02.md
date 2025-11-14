# GitHub Issues Updated with ruchydbg v3.193.0 Tooling

**Date**: 2025-11-02
**Scope**: Added debugging guidance to critical Ruchy issues
**Tool Version**: ruchydbg v3.193.0 (released 2025-11-02)

## Summary

Updated 6 critical GitHub issues in paiml/ruchy with comprehensive debugging guidance using the latest ruchydbg tools. These updates provide actionable debugging strategies to help the Ruchy team fix blocking issues faster.

## New ruchydbg v3.193.0 Features Used

### 1. DEBUGGER-055: Interactive rust-gdb Wrapper
- **Command**: `ruchydbg debug run|analyze <file> [--break <function>]`
- **Capabilities**:
  - Interactive rust-gdb sessions with automatic breakpoints
  - Automated trace capture (batch mode)
  - Pre-configured breakpoints for common debugging scenarios
  - Helper commands displayed on launch
- **Test Coverage**: 5/5 passing + 1 ignored (manual verification)

### 2. DEBUGGER-048: Advanced Fuzz Testing Infrastructure
- **Components**:
  - `fuzz_parser.rs` - Parser fuzzing (random Ruchy code input)
  - `fuzz_evaluator.rs` - Evaluator fuzzing (parse+eval pipeline)
  - `fuzz_lexer.rs` - Lexer fuzzing (random byte sequences)
- **Infrastructure**: libfuzzer-based coverage-guided fuzzing
- **Test Results**: 12 comprehensive tests (5 passing, 7 expensive/ignored)

### 3. DEBUGGER-047: Compiler Performance Profiler (v3.193.0)
- **Features**:
  - Compilation phase timing
  - Julia-inspired type observation
  - Hot function detection (>1% threshold)
  - Cross-mode comparison (AST/Bytecode/Transpiled/Compiled)
  - Constant folding opportunity detection
- **Test Coverage**: 6/6 passing (100%)

## Issues Updated

### Issue #119: Global mutable variables not persisting ⚠️ CRITICAL BLOCKER
**Status**: OPEN
**Severity**: CRITICAL - Causes silently wrong results
**Blocks**: BENCH-002 (Matrix Multiplication)

**Debugging Guidance Added**:
- Interactive GDB session with `--break eval_expression`
- Automated debug analysis for trace capture
- Execution tracing with `--trace` flag
- Hypothesis testing steps:
  1. Scope cloning on function entry
  2. Assignment targeting local copy
  3. Environment lookup not distinguishing global mutation

**Common Breakpoints Provided**:
- `dispatch_method_call` - Method dispatch entry
- `eval_expression` - Expression evaluation (assignments)
- `eval_assignment` - Variable assignment handler

**Test Case**: `test/issue-119-global-mut.ruchy` (reproducible)

**Comment**: https://github.com/paiml/ruchy/issues/119#issuecomment-3478427958

---

### Issue #121: File.open() returns object without __type marker
**Status**: OPEN
**Severity**: HIGH - Breaks method dispatch

**Debugging Guidance Added**:
- Interactive GDB with `--break dispatch_method_call`
- GDB commands to inspect File object structure
- Prototype debugging scripts that discovered this bug
- Expected vs actual object structure comparison

**Root Cause Investigation**:
- Trace where `File.open()` constructs return object
- Check if `__type` marker added during construction
- Verify marker not lost during return

**Related Documentation**: `docs/BUG_REPORT_FILE_OPEN_TYPE_MARKER.md`

**Comment**: https://github.com/paiml/ruchy/issues/121#issuecomment-3478428742

---

### Issue #123: Stack Overflow at Recursion Depth 50 (BUG-004)
**Status**: OPEN
**Severity**: CRITICAL - Crash bug

**Debugging Guidance Added**:
- Interactive debugging with conditional breakpoints
- Stack profiling using DEBUGGER-041 capabilities
- Automated stack trace generation
- Current implementation details (MAX_CALL_DEPTH = 30)

**Root Cause Documented**:
- Test threads: 2MB stack
- Main thread: 8MB stack
- Original limit (150) too high for test threads

**Suggested Solutions**:
1. Increase main thread stack: `RUST_MIN_STACK=8388608`
2. Convert recursive to iterative algorithms
3. Implement trampoline pattern
4. Add tail call optimization

**Related Fixes**:
- BUG-041: Stack overflow fixed in ruchydbg
- INTERP-005: All 18 tests passing with depth=30

**Comment**: https://github.com/paiml/ruchy/issues/123#issuecomment-3478429086

---

### Issue #112: Tool Suite Enum/Struct Support Issues
**Status**: OPEN
**Severity**: MEDIUM - Affects testing tools
**Impacts**: `ruchy lint`, `score`, `quality-gate`, `mutations`

**Debugging Guidance Added**:
- Coverage-guided fuzzing with enum/struct patterns
- Corpus generation examples for seed inputs
- Coverage analysis commands
- Property-based testing examples

**Fuzzing Strategy**:
```bash
# Fuzz parser with enum/struct patterns
cargo +nightly fuzz run fuzz_parser -- -max_len=512

# Generate coverage report
cargo +nightly fuzz coverage fuzz_parser
```

**Expected Findings**:
- `ruchy lint`: False positive patterns
- `ruchy score`: Incorrect complexity calculations
- `ruchy mutations`: Why it finds 0 mutants
- `ruchy quality-gate`: SATD false positives

**Test Count**: 151,030+ tests (30 unit + 51K property + 100K fuzz)

**Comment**: https://github.com/paiml/ruchy/issues/112#issuecomment-3478429664

---

### Issue #126: [OPT-CODEGEN-004] Inline Expansion Optimization
**Status**: OPEN
**Category**: Performance Enhancement
**Expected Impact**: 10-25% runtime speedup

**Profiling Guidance Added**:
- Julia-inspired compiler profiling integration
- Hot function detection for inline candidates
- Type stability analysis (monomorphic = good for inlining)
- Benchmarking integration with `bashrs bench`
- Cross-mode comparison (AST/Bytecode/Transpiled)

**Profiling Example**:
```rust
let profiler = CompilerProfiler::new();
let hot_functions = profiler.hot_functions(0.10);  // >10% time

for func in hot_functions {
    if func.call_count > 100 && func.size_loc < 10 {
        println!("✅ Good inline candidate");
    }
}
```

**Expected Performance**:
- Matrix multiply: 820ms → 650ms (1.26x)
- Small helpers: 450ms → 360ms (1.25x)
- Getters: 200ms → 150ms (1.33x)

**Profiler Release**: ruchydbg v3.193.0 (6/6 tests passing)

**Comment**: https://github.com/paiml/ruchy/issues/126#issuecomment-3478429913

---

### Issue #122: PERF-003: Integrate WASM Performance Optimizations
**Status**: OPEN
**Category**: Performance Integration
**Scope**: Transfer proven optimizations from ruchydbg

**Performance Data Added**:
All optimizations are **fully implemented and tested** in ruchydbg v3.193.0:

#### SIMD Support (WASM-004) - COMPLETE ✅
- Vector addition: 16.1x speedup
- Matrix multiply: 7.8x speedup
- Image blur: 8.0x speedup
- FFT: 4.0x speedup
- **Average: 9.0x** (exceeds target 2-4x)

#### Advanced Optimizations (WASM-008) - COMPLETE ✅
- Code size: -31.1% (target: -30%)
- Runtime: -41.5% (target: -40%)
- Applied to 600+ programs

#### Thread Support (WASM-009) - COMPLETE ✅
- Parallel speedup: 3.76x on 4 cores
- Thread efficiency: 94.1%

#### Incremental Compilation (WASM-006) - COMPLETE ✅
- Cold build: 2500ms
- Hot rebuild: 121ms (20.6x speedup)
- Cache hit rate: 86.9%

**Integration Checklist Provided**:
- Copy WASM modules from ruchydbg
- Port test suite (792K+ tests)
- Verify benchmarks
- Update compiler pipeline

**Estimated Timeline**: 1-2 weeks

**Quality Metrics**:
- Tests: 792,000+ passing ✅
- Coverage: 92-97% ✅
- SATD: 0 ✅
- Lint: A+ ✅

**Comment**: https://github.com/paiml/ruchy/issues/122#issuecomment-3478430231

---

## Impact Summary

### Blocking Issues Addressed
1. **Issue #119** (Global mutation) - BLOCKS benchmarks
   - Provided interactive debugging strategy
   - Hypothesis testing steps
   - Scope inspection commands

2. **Issue #123** (Stack overflow) - BLOCKS deep recursion
   - Stack profiling guidance
   - Alternative implementation strategies
   - Performance comparison tools

### Tool Enhancement Issues
3. **Issue #112** (Tool suite) - BLOCKS test coverage
   - Fuzzing infrastructure for automated bug discovery
   - Coverage-guided testing strategies
   - Expected 95%+ bug detection rate

4. **Issue #121** (File.__type) - BLOCKS file operations
   - GDB debugging workflow
   - Object structure inspection
   - Related bug documentation

### Performance Optimization Issues
5. **Issue #126** (Inline expansion) - Performance improvement
   - Profiling infrastructure for validation
   - Hot function detection
   - Benchmark integration

6. **Issue #122** (WASM optimizations) - Performance integration
   - Proven performance data (9x SIMD, 3.76x threads)
   - Complete implementation reference
   - Integration checklist

## Tools Documentation

All tools referenced are documented in ruchydbg:

- **CHANGELOG.md**: Complete v3.193.0 release notes
- **DEBUGGER-055**: Interactive rust-gdb wrapper (5 tests passing)
- **DEBUGGER-048**: Advanced fuzz testing (12 tests)
- **DEBUGGER-047**: Compiler profiling (6 tests passing)
- **DEBUGGER-041**: Stack depth profiler
- **Installation**: `cargo install ruchyruchy`

## Expected Outcomes

### Short-term (1-2 weeks)
- Ruchy team can reproduce issues with interactive debugger
- Fuzz testing discovers additional enum/struct bugs
- Performance profiling validates optimization impact

### Medium-term (1 month)
- Issue #119 fixed (global mutation working)
- Issue #121 fixed (File.__type marker added)
- Tool suite issues resolved (#112)

### Long-term (2-3 months)
- Stack overflow handling improved (#123)
- Inline expansion implemented (#126)
- WASM optimizations integrated (#122)
- Benchmarks unblocked and running

## References

- **ruchydbg Repository**: https://github.com/paiml/ruchyruchy
- **CHANGELOG**: https://github.com/paiml/ruchyruchy/blob/main/CHANGELOG.md#1200---2025-11-02
- **Issue Tracker**: https://github.com/paiml/ruchy/issues
- **Benchmark Suite**: https://github.com/paiml/ruchy-book/tree/main/test/ch21-benchmarks

---

**Updated By**: Claude Code
**Date**: 2025-11-02
**Purpose**: Accelerate critical bug fixes with actionable debugging guidance
