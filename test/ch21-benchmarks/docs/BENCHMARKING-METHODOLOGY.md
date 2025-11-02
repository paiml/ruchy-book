# Benchmarking Methodology

**Reference Framework**: "Cross-Language Compiler Benchmarking: Are We Fast Yet?" (DLS 2016)

**Authors**: Stefan Marr, Benoit Daloze, Hanspeter Mössenböck

**DOI**: [10.1145/2989225.2989232](https://dl.acm.org/doi/10.1145/2989225.2989232)

**Paper URL**: https://stefan-marr.de/papers/dls-marr-et-al-cross-language-compiler-benchmarking-are-we-fast-yet/

## Overview

This document defines the scientific methodology for Chapter 21's performance benchmarking suite. We follow the "Are We Fast Yet?" framework to ensure rigorous, reproducible, and honest cross-language performance comparisons.

## Core Principles

### 1. Identical Implementations

**Rule**: Benchmarks must be "as identical as possible between languages"

**Application**:
- Use same algorithms across all 9 execution modes
- Same data structures (arrays, objects with fields)
- Same control flow patterns (while loops, if statements)
- Same computational complexity (O-notation)

**Example** (BENCH-007 Fibonacci):
```ruchy
// Ruchy implementation
fun fibonacci(n) {
    if n <= 1 { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

```python
# Python implementation (identical structure)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### 2. Idiomatic Usage

**Rule**: Balance strict comparability with "idiomatic use of language"

**Application**:
- Use language-specific best practices for performance
- Example: Python's `str.join()` vs `+=` for string concatenation
- Example: Rust's `String::repeat()` for efficient allocation
- Document when idioms diverge from strict identity

**BENCH-003 String Concatenation**:
- ✅ Python: `"".join()` (idiomatic + fast)
- ✅ Rust: `String::repeat()` (idiomatic + fast)
- ✅ Ruchy: `result = result + "x"` (fundamental operation test)

**Rationale**: Testing Ruchy's fundamental string handling, not library optimizations

### 3. Core Language Abstractions Only

**Required Features** (from "Are We Fast Yet?"):
- Objects with fields (structs, dicts)
- Polymorphic methods
- Closures with lexical scope
- Fixed-size arrays
- Primitive types (int, float, string)
- Automatic memory management

**Excluded Features**:
- ❌ Built-in hash tables (HashMap, dict with hash keys)
- ❌ Identity-based hashing
- ❌ Non-local returns
- ❌ Flow control shortcuts (break/continue outside iterators)

**Application**:
- BENCH-004 (Binary Tree): Uses plain objects/structs, not collections
- BENCH-008 (Primes): Uses arrays, not sets
- BENCH-009 (JSON): Tests parsing library (different goal - see below)

### 4. Deterministic Execution

**Rule**: Programs must take identical code paths across all runs

**Application**:
- Fixed input sizes (n=20 for Fibonacci, 10K iterations for strings)
- No random number generation without fixed seed
- No time-dependent behavior
- Reproducible results across machines (modulo clock speed)

**Verification**:
```bash
# Run same benchmark twice - should get <5% variance
bashrs bench --iterations 10 --warmup 3 script.py
bashrs bench --iterations 10 --warmup 3 script.py
```

### 5. Well-Typed Behavior

**Rule**: Avoid initializations that suppress optimizations

**Application**:
- Use type-appropriate defaults (0 for int, "" for string)
- Don't initialize with `null` then overwrite
- Enable JIT type inference with consistent types

**Example**:
```ruchy
// ✅ Good - enables type inference
let mut result = ""  // String type from start
result = result + "x"

// ❌ Bad - would confuse type inference
let mut result = null  // Unknown type
result = ""  // Type changes
```

## Measurement Methodology

### Statistical Rigor

**Warmup Phase**:
- **Purpose**: Allow JIT compilation, cache warming, branch prediction
- **Standard**: 3 warmup iterations (skipped from results)
- **Tool**: `bashrs bench --warmup 3`

**Measurement Phase**:
- **Iterations**: 10 runs per benchmark
- **Metrics Collected**: mean, median, stddev, min, max
- **Raw Data**: All 10 individual results saved for analysis

**Statistical Aggregation**:
- **Per-benchmark**: Median preferred over mean (robust to outliers)
- **Cross-benchmark**: Geometric mean for speedup ratios
- **Rationale**: Arithmetic mean of ratios is misleading (see paper §3.3)

### Language-Agnostic Metrics

**From "Are We Fast Yet?" Paper**:
- Executed lines of code
- Method calls (mono/polymorphic)
- Closure applications
- Maximum stack depth
- Loop activations
- Object allocations
- Array operations

**Our Implementation** (via bashrs bench):
- Wall-clock time (ms precision)
- Environment capture (CPU, RAM, OS, timestamp)
- Speedup ratios vs Python baseline
- Geometric mean across benchmarks

### Experimental Control

**Environment Consistency**:
```json
{
  "cpu": "AMD Ryzen Threadripper 7960X 24-Cores",
  "ram": "125Gi",
  "os": "Linux 6.8.0-85-generic",
  "timestamp": "2025-11-02T13:24:03+01:00"
}
```

**Process Isolation**:
- Each run in fresh process (no state carryover)
- No background processes during benchmarking
- CPU governor set to "performance" mode

**Compilation Control**:
- Go: `-O2` optimization level
- Rust: `--release` mode
- Ruchy: Default transpiler/compiler settings

## Benchmark Categories

### Category A: Compiler Effectiveness (Core Abstractions)

**Goal**: Measure compiler optimization quality, not library performance

**Examples**:
- BENCH-007 (Fibonacci): Recursion, function calls, stack management
- BENCH-008 (Primes): Loops, arithmetic, array operations
- BENCH-004 (Binary Tree): Object allocation, pointer chasing, GC

**Characteristics**:
- Use only core language features
- No standard library calls (except basic I/O)
- Identical implementations across languages
- Tests compiler, not library quality

### Category B: Systems Performance (Standard Library)

**Goal**: Measure real-world performance including library implementations

**Examples**:
- BENCH-009 (JSON Parsing): Tests parsing library + runtime
- BENCH-006 (File I/O): Tests file system APIs + buffering
- BENCH-010 (Regex): Tests regex engine implementation

**Characteristics**:
- Use standard library implementations
- Idiomatic code per language
- Tests complete ecosystem, not just compiler
- Important for CLI tool positioning

**Rationale**: Both categories matter. Category A isolates compiler quality, Category B measures real-world performance.

## Avoiding Common Pitfalls

### Pitfall 1: Cherry-Picking Benchmarks

**Problem**: Selecting only benchmarks where your language wins

**Solution**:
- Define complete suite upfront (see BENCHMARK-ROADMAP.md)
- Run ALL benchmarks, report ALL results
- Use geometric mean (no benchmark can dominate average)
- Show variation across workload types

**Our Approach**:
```
String operations: 5.33x  (slower than recursion)
Recursive computation: 11.12x  (strong)
Startup time: 10.31x  (strong)
Geometric mean: 8.49x  (honest average)
```

### Pitfall 2: Unfair Comparisons

**Problem**: Comparing optimized vs unoptimized implementations

**Solution**:
- Document optimization flags for each language
- Use idiomatic best practices per language
- Compile-time languages: Release builds
- JIT languages: Include warmup phase

**Example** (BENCH-003 String Concatenation):
- Python: Use `"".join()` (idiomatic, fast)
- Rust: Use `String::repeat()` (idiomatic, fast)
- Ruchy: Use `+=` (tests fundamental string handling)
- All are "fair" because they test what users will actually write

### Pitfall 3: Ignoring Variance

**Problem**: Reporting single numbers without error bars

**Solution**:
- Always report stddev, min, max alongside mean/median
- Show raw results array for reproducibility
- Flag high-variance benchmarks for investigation

**Example Output**:
```json
{
  "mean_ms": 16.89,
  "median_ms": 16.66,
  "stddev_ms": 1.02,
  "min_ms": 15.27,
  "max_ms": 18.73,
  "raw_results": [18,18,16,16,16,16,19,15,18,17]
}
```

### Pitfall 4: Misleading Aggregation

**Problem**: Using arithmetic mean for speedup ratios

**Solution**: Geometric mean is mathematically correct for ratios

**From Paper**: "Arithmetic mean of speedup ratios is statistically meaningless"

**Example**:
```python
# ❌ Wrong - arithmetic mean
speedups = [2x, 4x, 16x]
avg = (2 + 4 + 16) / 3 = 7.33x  # Dominated by outlier

# ✅ Correct - geometric mean
avg = (2 * 4 * 16)^(1/3) = 5.04x  # Balanced contribution
```

### Pitfall 5: Ignoring Language Philosophy

**Problem**: Forcing unnatural patterns to achieve "identical" code

**Solution**:
- Recognize that languages have different philosophies
- Balance identity with idiomatic usage
- Document semantic mappings when necessary

**Example**: Python vs Rust error handling
- Python: Exceptions are idiomatic
- Rust: Result<T, E> is idiomatic
- Both are valid - don't force Python-style exceptions in Rust

## Quality Gates

### Pre-Run Checklist

- [ ] All implementations use same algorithm
- [ ] Compilation/optimization flags documented
- [ ] Input sizes fixed and documented
- [ ] Warmup iterations configured (3 minimum)
- [ ] Measurement iterations configured (10 minimum)
- [ ] Environment info captured (CPU, RAM, OS)

### Post-Run Validation

- [ ] Stddev < 10% of mean (low variance)
- [ ] Min/max within 2x of median (no outliers)
- [ ] Results reproducible across runs
- [ ] Geometric mean calculated for cross-benchmark aggregation
- [ ] Raw data saved for transparency

### Reporting Requirements

- [ ] Show individual benchmark results (not just average)
- [ ] Report variance (stddev, min, max)
- [ ] Include all benchmarks (no cherry-picking)
- [ ] Cite "Are We Fast Yet?" methodology
- [ ] Provide raw JSON results for reproducibility
- [ ] Document deviations from strict identity

## References

### Primary Reference

Marr, S., Daloze, B., & Mössenböck, H. (2016). **Cross-Language Compiler Benchmarking: Are We Fast Yet?** In Proceedings of the 12th Symposium on Dynamic Languages (DLS 2016), 120-131. ACM. https://doi.org/10.1145/2989225.2989232

### Related Work

- Computer Language Benchmarks Game: https://benchmarksgame-team.pages.debian.net/benchmarksgame/
- Renaissance Benchmark Suite: https://renaissance.dev/
- DaCapo Benchmark Suite: https://www.dacapobench.org/

### Tools

- **bashrs bench v6.25.0**: Our benchmarking framework
  - Repository: https://github.com/paiml/bashrs
  - Features: Warmup, statistical analysis, JSON output, quality gates

## Conclusion

Following the "Are We Fast Yet?" methodology ensures our benchmarks are:

1. **Scientific**: Reproducible, statistically rigorous results
2. **Honest**: No cherry-picking, transparent variance reporting
3. **Fair**: Comparable implementations, documented trade-offs
4. **Comprehensive**: Diverse workloads, geometric mean aggregation
5. **Useful**: Both compiler effectiveness + real-world performance

This methodology enables us to make defensible claims like:

> "Ruchy delivers 8.49x average speedup over Python (geometric mean across 3 diverse benchmarks: string operations, recursive computation, and startup time)."

This is an **honest, scientifically validated claim** backed by rigorous methodology.
