# Chapter 21 Benchmarking Documentation

This directory contains the scientific methodology and analysis documents for Chapter 21's performance benchmarking suite.

## Quick Links

### Core Documents

- **[BENCHMARKING-METHODOLOGY.md](./BENCHMARKING-METHODOLOGY.md)** - Complete scientific methodology based on "Are We Fast Yet?" (DLS 2016)
- **[../BENCHMARK-ROADMAP.md](../BENCHMARK-ROADMAP.md)** - 12-benchmark suite design and progress tracking
- **[../results/VERIFICATION-V3.172.0-SUMMARY.md](../results/VERIFICATION-V3.172.0-SUMMARY.md)** - Latest verification results

### Reference Material

- **Paper**: Marr, S., Daloze, B., & Mössenböck, H. (2016). "Cross-Language Compiler Benchmarking: Are We Fast Yet?" In *Proceedings of the 12th Symposium on Dynamic Languages (DLS 2016)*, 120-131. ACM.
- **DOI**: https://doi.org/10.1145/2989225.2989232
- **Author's Version**: https://stefan-marr.de/papers/dls-marr-et-al-cross-language-compiler-benchmarking-are-we-fast-yet/

## Key Results (v3.172.0)

**Geometric Mean Performance** (3 benchmarks, 9 execution modes):

| Mode | Speedup vs Python | Status |
|------|-------------------|--------|
| Julia | 12.64x | Reference (JIT+LLVM) |
| Rust | 9.41x | Reference (AOT) |
| **Ruchy Transpiled** | **8.49x** | ✅ Validated |
| Go | 8.26x | Reference (AOT) |
| **Ruchy Compiled** | **7.99x** | ✅ Validated |
| **Ruchy Bytecode** | **4.51x** | ✅ Validated |
| Python | 1.00x | Baseline |
| Ruchy AST | 0.87x | Interpreter mode |
| Deno | 0.63x | Reference (JIT) |

**Key Insight**: Ruchy transpiled mode beats Go, approaching Rust-level performance.

## Performance by Workload

| Workload | Ruchy Transpiled | Insight |
|----------|------------------|---------|
| String concatenation | 5.33x | Moderate performance |
| Recursive computation | 11.12x | Excellent (nearly Julia-level) |
| Startup time | 10.31x | Outstanding (beats Rust + Go) |

**Honest Reporting**: Performance varies by workload type. We report all results, not just the best ones.

## Methodology Highlights

### From "Are We Fast Yet?" Paper

1. **Identical Implementations**: Same algorithms across all languages
2. **Idiomatic Usage**: Language-specific best practices for fair comparison
3. **Core Abstractions**: Test compiler, not library quality
4. **Statistical Rigor**: Warmup + multiple iterations + variance reporting
5. **Geometric Mean**: Mathematically correct aggregation for ratios
6. **Full Transparency**: Raw data, variance, and all results published

### Our Implementation

- **Tool**: bashrs bench v6.25.0 (scientific benchmarking framework)
- **Warmup**: 3 iterations (JIT warm-up, cache priming)
- **Measurement**: 10 iterations (statistical confidence)
- **Metrics**: mean, median, stddev, min, max, raw results
- **Environment**: Captured (CPU, RAM, OS, timestamp) for reproducibility

## Document Index

### Methodology

- `BENCHMARKING-METHODOLOGY.md` - Full scientific methodology
  - Identical implementations requirement
  - Idiomatic usage guidelines
  - Statistical measurement protocol
  - Avoiding common pitfalls
  - Quality gates and validation

### Results

- `../results/VERIFICATION-V3.172.0-SUMMARY.md` - Latest verification
- `../results/geometric-mean-v3.172.0.txt` - Statistical analysis
- `../results/bench-003-results-full.json` - BENCH-003 raw data
- `../results/bench-007-results-full.json` - BENCH-007 raw data (was BENCH-007-results-bashrs.json)
- `../results/bench-012-results-full.json` - BENCH-012 raw data

### Historical

- `../results/BENCH-007-SUMMARY.md` - Initial BENCH-007 analysis
- `../results/RUCHY-V3.171.0-VERIFICATION.md` - Previous version testing
- `../results/TRANSPILER-IMPACT-ASSESSMENT.md` - Transpiler bug impact

## GitHub Issues

- **#114** - Return Type Inference Bug - ✅ FIXED in v3.172.0
- **#115** - usize Casting Issue - ⏳ Open (blocks BENCH-008 transpile/compile)

## Benchmarks Completed

1. ✅ **BENCH-007**: Fibonacci recursive (n=20) - All 9 modes
2. ✅ **BENCH-003**: String concatenation (10K ops) - All 9 modes
3. ✅ **BENCH-012**: Startup time (Hello World) - All 9 modes

**Total**: 3 benchmarks × 9 modes = 27 test results

## Benchmarks In Progress

4. ⏳ **BENCH-008**: Prime generation (10K primes) - Blocked by GitHub #115 (usize casting)
5. ⏳ **BENCH-004**: Binary tree allocation - Implementations ready, needs execution
6. ⏳ **BENCH-009**: JSON parsing (50MB) - Needs Rust Cargo setup
7. ⏳ **BENCH-006**: File I/O (100MB logs) - Needs Ruchy API verification

## Next Steps

1. Wait for GitHub #115 fix (usize casting)
2. Run BENCH-004 (Binary Tree) - all implementations ready
3. Complete BENCH-009 (JSON) - setup Rust dependencies
4. Complete BENCH-006 (File I/O) - verify Ruchy file APIs
5. Implement BENCH-010 (Regex) - P1 priority
6. Update Chapter 21 with validated 8.49x claim

## Quality Standards

### Pre-Commit Checklist

- [x] Methodology documented and peer-reviewed reference cited
- [x] All implementations use identical algorithms
- [x] Statistical rigor (warmup + iterations + variance)
- [x] Geometric mean calculation for cross-benchmark aggregation
- [x] Full transparency (raw data published)
- [x] Honest reporting (all results, not cherry-picked)

### Verification Checklist

- [x] Results reproducible across runs
- [x] Variance < 10% (low noise)
- [x] Environment documented
- [x] GitHub issues filed for blockers
- [x] Committed to version control

## Contact

For questions about benchmarking methodology or results:
- File issue in https://github.com/paiml/ruchy-book
- Reference "Are We Fast Yet?" paper for scientific methodology questions

---

**Last Updated**: 2025-11-02
**Ruchy Version**: v3.172.0
**Status**: 3/12 benchmarks complete, geometric mean = 8.49x
