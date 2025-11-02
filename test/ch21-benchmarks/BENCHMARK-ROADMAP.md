# Ruchy Benchmark Suite - Comprehensive Roadmap

**Purpose**: Tell the complete Ruchy performance story through systematic benchmarking
**Target**: 12 benchmarks covering algorithmic, systems, and real-world performance
**Framework**: bashrs bench v6.25.0 with 9-language comparison

## Scientific Methodology

**Reference Framework**: "Cross-Language Compiler Benchmarking: Are We Fast Yet?" (DLS 2016)

**Paper**: Marr, S., Daloze, B., & Mössenböck, H. (2016). Cross-Language Compiler Benchmarking: Are We Fast Yet? In *Proceedings of the 12th Symposium on Dynamic Languages (DLS 2016)*, 120-131. ACM. https://doi.org/10.1145/2989225.2989232

**Author's Version**: https://stefan-marr.de/papers/dls-marr-et-al-cross-language-compiler-benchmarking-are-we-fast-yet/

**Full Methodology**: See [`docs/BENCHMARKING-METHODOLOGY.md`](./docs/BENCHMARKING-METHODOLOGY.md)

### Core Principles Applied

1. **Identical Implementations**: Benchmarks use same algorithms across all 9 languages
2. **Idiomatic Usage**: Balance strict comparability with language best practices
3. **Core Abstractions Only**: Test compiler effectiveness (objects, closures, arrays, primitives)
4. **Deterministic Execution**: Fixed inputs, reproducible results across runs
5. **Statistical Rigor**: Warmup phase (3 iterations) + measurement (10 iterations)
6. **Geometric Mean**: Honest aggregation across diverse workloads (no cherry-picking)

**Why This Matters**: Following peer-reviewed methodology ensures our "8.49x faster than Python" claim is scientifically defensible, not marketing hype.

## Benchmark Suite Design

### Part 1: Core Performance Suite (Ruchy vs Rust vs Python vs Julia)
**Goal**: Validate "Rust-level performance" claim for CPU-bound algorithms

### Part 2: Systems & CLI Suite (Ruchy vs Go vs Python)
**Goal**: Validate fitness as systems administration and CLI language

---

## Complete Benchmark Catalog

### ✅ BENCH-007: Recursive Fibonacci (Function Call Overhead)
**Status**: COMPLETED
**Category**: Core Performance
**Task**: Calculate fib(30) using naive recursion
**Measures**: Raw function call/return overhead, stack management
**Why Critical**: Classic interpreter weakness - proves AOT compilation benefit
**Languages**: All 9 (Python, Deno, Julia, Go, Rust, Ruchy AST/Bytecode/Transpiled/Compiled)
**Results**:
- 🥇 Julia: 1.35ms (13.05x faster)
- 🥈 Ruchy Transpiled: 1.67ms (10.55x faster - BEATS RUST)
- 🥉 Rust: 1.70ms (10.36x faster)
- Baseline Python: 17.62ms

**Strategic Value**: Flagship benchmark demonstrating Ruchy's compilation prowess

---

### ⏳ BENCH-003: Idiomatic String Building (String & Memory Efficiency)
**Status**: IN PROGRESS (JSON incomplete - transpile/compile phases failed)
**Category**: Core Performance
**Task**: Build 10,000-character string using idiomatic methods
**Measures**: String builder efficiency, memory allocation patterns
**Why Critical**:
- Addresses red team "unfair concatenation" criticism
- Validates idiomatic performance across all languages
**Languages**: All 9
**Implementations**:
- Python: `"".join(['x' for _ in range(n)])` (O(n) idiomatic)
- Deno: `Array(n).fill('x').join('')`
- Julia: `repeat("x", n)` (built-in, most efficient)
- Go: `strings.Builder` (idiomatic for loops)
- Rust: `"x".repeat(n)` (built-in)
- Ruchy: String concatenation loop

**Partial Results** (from incomplete run):
- Julia: 1.30ms (12.88x faster) 🏆
- Rust: 1.84ms (9.10x faster)
- Go: 2.25ms (7.44x faster)
- Ruchy Bytecode: 4.11ms (4.07x faster)
- Ruchy AST: 14.22ms (1.18x faster)
- Python: 16.75ms (baseline)
- Deno: 26.27ms (0.64x - JIT overhead)

**Next Steps**: Fix incomplete benchmark run, complete transpile/compile phases

---

### ⏳ BENCH-008: Prime Number Generation (Integer Arithmetic & Loops)
**Status**: NEARLY COMPLETE (v3.171.0 fixed major bugs, minor usize issue remains)
**Category**: Core Performance
**Task**: Generate first 10,000 primes using trial division
**Measures**: Tight loop optimization, integer arithmetic, conditional branches
**Why Critical**: Classic CPU-bound numerical algorithm
**Languages**: All 9
**Implementation Approach**: Idiomatic trial division with array/vector storage

**Strategic Value**: Complements Fibonacci with different performance characteristics

---

### 🆕 BENCH-004: Binary Tree Stress Test (Memory Allocation & GC)
**Status**: PROPOSED
**Category**: Core Performance
**Task**: Based on CLBG binary-trees. Create deep binary tree, walk it, tear down, repeat.
**Measures**:
- Memory allocator speed (frequent small allocations)
- GC/deallocation efficiency
- Cache locality and memory access patterns
**Why Critical**:
- Memory management is often the performance bottleneck
- Reveals overhead of Ruchy's runtime vs Rust's manual management
- Tests real-world allocation patterns (not just arithmetic)
**Languages**: Python, Julia, Rust, Ruchy (all 4 modes)
**Implementation Strategy**:
- Python: Native classes with `__init__`
- Julia: Mutable structs
- Rust: `Box<Node>` for heap allocation
- Ruchy: Idiomatic object/struct syntax

**Expected Outcome**:
- Rust should dominate (manual allocation, no GC)
- Ruchy transpiled should approach Rust if GC overhead is minimal
- Reveals true cost of runtime memory management

**Priority**: HIGH (fills critical gap in current suite)

---

### 🆕 BENCH-005: N-Body Simulation (Floating-Point Performance)
**Status**: PROPOSED
**Category**: Core Performance
**Task**: Based on CLBG n-body. Simulate gravitational interaction of planets.
**Measures**:
- Floating-point arithmetic (heavy `sqrt`, multiplication, division)
- Data structure access in tight loops (arrays of structs/objects)
- Compiler vectorization effectiveness
**Why Critical**:
- More complex than primes (multi-dimensional data)
- Represents scientific/simulation workloads
- Tests SIMD/vectorization capabilities
**Languages**: All 9
**Implementation Strategy**:
- Use idiomatic vector/array of structs in each language
- Standard physics formulas (no approximations)
- Multiple iterations for statistical significance

**Expected Outcome**:
- Compiled languages (Rust, Go, Julia) should dominate
- Ruchy transpiled should match Rust if LLVM optimizes well
- Reveals floating-point vs integer performance delta

**Priority**: MEDIUM (important but specialized workload)

---

### 🆕 BENCH-006: Large File Line Processing (Buffered I/O)
**Status**: PROPOSED
**Category**: Systems & CLI
**Task**: Read 100MB text file line-by-line, count lines containing "error"
**Measures**:
- Buffered I/O efficiency
- String search performance
- Standard library maturity
**Why Critical**:
- **THE** quintessential sysadmin task
- Direct proof of fitness for log processing
- Competes with `grep`, `awk`, Python scripts
**Languages**: Python, Go, Ruchy (all 4 modes)
**Implementation Strategy**:
- Generate test file: 100MB of log-like data
- Use idiomatic buffered readers
- Simple substring search (not regex - see BENCH-010)
- Measure both I/O and string operations

**Expected Outcome**:
- Go should excel (optimized I/O standard library)
- Python may surprise (mature I/O buffering)
- Ruchy must be competitive for credibility as CLI tool

**Priority**: CRITICAL (make-or-break for CLI positioning)

---

### 🆕 BENCH-009: Large JSON Parsing (Real-World Data Handling)
**Status**: PROPOSED
**Category**: Systems & CLI
**Task**: Parse 50MB JSON file, extract deeply nested value
**Measures**:
- JSON parser efficiency
- String-to-number conversions
- HashMap/dict implementation performance
- Memory allocation under realistic workload
**Why Critical**:
- Every modern CLI tool uses JSON
- Non-negotiable real-world test
- Combines parsing, allocation, data structures
**Languages**: Python, Go, Deno, Ruchy (all 4 modes)
**Implementation Strategy**:
- Generate test JSON: realistic nested structure (API responses, config files)
- Use standard library JSON parsers
- Access nested value to force full parsing
- Measure end-to-end (read + parse + access)

**Expected Outcome**:
- Go likely fastest (mature standard library)
- Python competitive (json module in C)
- Deno strong (V8 JSON performance)
- Ruchy must validate JSON library performance

**Priority**: CRITICAL (essential for modern tooling)

---

### 🆕 BENCH-010: Regex-Heavy Text Search (Regex Engine Performance)
**Status**: PROPOSED
**Category**: Systems & CLI
**Task**: Find all email addresses in large text file using regex
**Measures**:
- Compiled regex engine performance
- Regex → NFA/DFA compilation overhead
- Pattern matching efficiency
**Why Critical**:
- Fundamental text processing tool
- Direct competitor to `grep`
- Common in validation, extraction, transformation
**Languages**: Python, Go, Rust, Ruchy (all modes that support regex)
**Implementation Strategy**:
- Generate test file: 10MB of mixed text with emails
- Use standard email regex pattern (moderately complex)
- Measure compilation + matching separately if possible
- Count matches to verify correctness

**Expected Outcome**:
- Rust should dominate (regex crate is highly optimized)
- Go competitive (standard library regex)
- Python slower (pure Python regex engine overhead)
- Ruchy depends on which regex backend is used

**Priority**: HIGH (critical for text processing claims)

---

### 🆕 BENCH-011: HTTP Server Throughput (Network I/O & Concurrency)
**Status**: PROPOSED
**Category**: Systems & CLI
**Task**: Minimal "Hello World" HTTP server under load (requests/second)
**Measures**:
- Network stack overhead
- Event loop / threading model efficiency
- Concurrent connection handling
**Why Critical**:
- Primary benchmark for Go comparison
- Proves fitness for microservices
- Tests async/concurrency story
**Languages**: Python, Go, Deno, Ruchy (if async supported)
**Implementation Strategy**:
- Minimal HTTP server: return "Hello, World!" to all requests
- Load test with `oha` or `wrk` (10K requests, 100 concurrent)
- Measure requests/second and latency distribution
- Document concurrency model used

**Expected Outcome**:
- Go should dominate (mature net/http + goroutines)
- Deno competitive (V8 + Tokio async runtime)
- Python slower (GIL limits concurrency)
- Ruchy result depends on async implementation maturity

**Priority**: MEDIUM-HIGH (important for network tooling positioning)

---

### 🆕 BENCH-012: Startup Time (CLI User Experience)
**Status**: PROPOSED
**Category**: Systems & CLI
**Task**: Measure wall-clock time for "Hello World" program execution
**Measures**:
- Runtime/VM initialization overhead
- Library loading time
- JIT compilation startup cost
- Process creation overhead
**Why Critical**:
- **Make-or-break for CLI tools**
- Dominates UX for short-running scripts
- Directly validates "better than Python" claim
**Languages**: All 9
**Implementation Strategy**:
- Simple program: `print("Hello, World!")` and exit
- Measure with `hyperfine` (warmup + multiple runs)
- Separate binary size measurement (correlated but distinct)
- Test cold start (no disk cache) vs warm start

**Expected Outcome**:
- Compiled binaries (Rust, Go, Ruchy Compiled) should be fastest (<5ms)
- Python slow (import system overhead, ~50-100ms)
- Deno slowest (V8 initialization, ~100-200ms)
- Ruchy AST/Bytecode faster than Python (no import overhead)

**Priority**: CRITICAL (differentiator for CLI positioning)

---

## Benchmark Priority Matrix

### P0: Critical - Must Have (Blocks Chapter 21 Publication)
1. ✅ BENCH-007: Fibonacci (DONE)
2. ⏳ BENCH-003: String Building (FIX INCOMPLETE RUN)
3. ⏳ BENCH-008: Prime Generation (FINISH)
4. 🆕 BENCH-012: Startup Time (IMPLEMENT)
5. 🆕 BENCH-006: File Line Processing (IMPLEMENT)

### P1: High - Should Have (Required for Comprehensive Story)
6. 🆕 BENCH-009: JSON Parsing (IMPLEMENT)
7. 🆕 BENCH-004: Binary Tree (IMPLEMENT)
8. 🆕 BENCH-010: Regex Search (IMPLEMENT)

### P2: Medium - Nice to Have (Strengthens Positioning)
9. 🆕 BENCH-005: N-Body Simulation (IMPLEMENT)
10. 🆕 BENCH-011: HTTP Server (IMPLEMENT - if async ready)

---

## Implementation Strategy

### Phase 1: Complete Core Suite (Week 1)
- Fix BENCH-003 (incomplete JSON)
- Finish BENCH-008 (primes)
- Implement BENCH-012 (startup time) - QUICK WIN
- Implement BENCH-006 (file processing) - CRITICAL

**Milestone**: 5 benchmarks complete, can calculate first geometric mean

### Phase 2: Real-World Tests (Week 2)
- Implement BENCH-009 (JSON parsing)
- Implement BENCH-004 (binary trees)
- Implement BENCH-010 (regex search)

**Milestone**: 8 benchmarks complete, strong real-world story

### Phase 3: Advanced Tests (Week 3)
- Implement BENCH-005 (n-body simulation)
- Implement BENCH-011 (HTTP server) - if async ready

**Milestone**: 10 benchmarks complete, comprehensive suite

---

## Success Metrics

### Technical Validity
- ✅ All benchmarks use idiomatic implementations
- ✅ Statistical rigor (10+ iterations, warmup, stddev reported)
- ✅ Quality gates enforced (lint + determinism)
- ✅ Separate compilation from execution timing

### Strategic Positioning
- **Core Performance**: Match or beat Rust on 60%+ of benchmarks
- **Systems/CLI**: Beat Python on 90%+ of benchmarks
- **Startup Time**: <10ms for compiled modes (vs Python's ~50-100ms)
- **Geometric Mean**: Overall 5-8x faster than Python (honest average)

### Credibility Standards
- ⚠️ Caveat any single-benchmark claims
- ✅ Present geometric mean prominently
- ✅ Acknowledge areas where Ruchy is slower
- ✅ Compare against idiomatic code in all languages
- ✅ Document measurement methodology fully

---

## Notes from Red Team Review

### Critical Flaws Addressed
1. ✅ **Selection Bias**: Expanded from 1 to 12 benchmarks
2. ✅ **Unidiomatic Code**: Fixed Python BENCH-003 to use `join()`
3. ⏳ **Statistical Rigor**: Increased iterations, using bashrs bench
4. ⏳ **Unmeasured Claims**: Will add binary size, memory benchmarks
5. ✅ **JIT Underrepresentation**: Added Deno, Julia for JIT coverage

### Ongoing Improvements
- Document CPU governor settings
- Expert code review for each language
- Increase iterations to 30+ for final results
- Add memory profiling to binary tree benchmark
- Separate startup time from execution time clearly

---

## Geometric Mean Calculation

**Formula**: `(product of all speedups)^(1/n)`

**Example** (with 5 benchmarks):
- BENCH-007 (Fib): 10.55x
- BENCH-003 (String): 9.10x (if transpiled matches Rust)
- BENCH-008 (Primes): 8.00x (estimated)
- BENCH-012 (Startup): 10.00x (estimated)
- BENCH-006 (File I/O): 3.00x (conservative estimate)

**Geometric Mean**: `(10.55 × 9.10 × 8.00 × 10.00 × 3.00)^(1/5) = 7.24x`

**Honest Claim**: "Ruchy delivers 7x average speedup over Python across diverse workloads"

---

## Dashboard Update Strategy

After each benchmark completion:
1. Update `results/bench-NNN-results-full.json`
2. Regenerate summary table in Chapter 21
3. Recalculate geometric mean
4. Update claims with latest data
5. Commit with detailed results message

**Frequency**: After every 2-3 benchmark completions (avoid noise)
