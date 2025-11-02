# PMAT Development Roadmap - Chapter 21: Scientific Benchmarking

## Current Sprint: Python vs Ruchy Scientific Performance Comparison
- **Duration**: 2025-11-01 to 2025-11-08
- **Priority**: P0
- **Quality Gates**: Scientific reproducibility, TDD methodology, bashrs compliance

## Sprint Goal

Create scientifically rigorous, completely reproducible benchmarks comparing:
- **A**: Python standard library
- **B**: Ruchy interpreted AST (`ruchy run`)
- **C**: Ruchy bytecode VM (`ruchy --vm-mode bytecode run`) - experimental, 40-60% faster
- **D**: Ruchy transpiled (`ruchy transpile` → `rustc`)
- **E**: Ruchy compiled binary (`ruchy compile`)

**10 standard library examples** covering common operations.

**Note**: Bytecode mode is experimental and may have limitations with I/O operations.

## Benchmark Categories

### File I/O (2 examples)
- BENCH-001: Read large text file (10MB)
- BENCH-002: Write/append operations (100K writes)

### String Processing (2 examples)
- BENCH-003: String concatenation (10K operations) ⚠️ PARTIAL FIX - v3.171.0 fixed parameters, string return type still blocked ([#113](https://github.com/paiml/ruchy/issues/113))
- BENCH-004: Regex matching (100K patterns)

### Data Structures (2 examples)
- BENCH-005: List/Array operations (1M elements)
- BENCH-006: HashMap/Dict operations (100K entries)

### Mathematics (2 examples)
- BENCH-007: Fibonacci (recursive, n=20) ✅ COMPLETE
- BENCH-008: Prime number generation (first 10K primes) ⚠️ NEARLY COMPLETE - Major bugs FIXED in v3.171.0! Minor usize issue remains ([#113](https://github.com/paiml/ruchy/issues/113))

### System Operations (2 examples)
- BENCH-009: JSON parsing (10K objects)
- BENCH-010: HTTP request handling (mock, 1K requests)

## Tasks

### Infrastructure Tasks
| ID | Description | Status | Complexity | Priority |
|----|-------------|--------|------------|----------|
| INFRA-001 | Create benchmarking framework with bashrs bench v6.25.0 | ✅ complete | 15 | P0 |
| INFRA-002 | Create test data generators | pending | 8 | P0 |
| INFRA-003 | Implement timing harness with bashrs bench | ✅ complete | 10 | P0 |
| INFRA-004 | Create results aggregator | ✅ complete | 12 | P0 |

**INFRA-001 Notes:**
- Created `scripts/benchmark-framework-bashrs.sh` using bashrs bench v6.25.0
- Framework creates temporary wrapper scripts for each execution mode
- Handles compilation outside of timing (transpile/compile modes)
- Properly suppresses stdout to avoid output contamination
- Parses bashrs bench JSON output format (nested under benchmarks[0].statistics)

**INFRA-003 Notes:**
- bashrs bench provides built-in timing harness with:
  - Configurable warmup iterations (default: 3)
  - Configurable measured iterations (default: 10)
  - Statistical analysis (mean, median, stddev, min, max)
  - Determinism verification
  - Quality gates (lint + determinism checks)

**INFRA-004 Notes:**
- Results aggregated from bashrs bench JSON output
- Environment information captured (CPU, RAM, OS, timestamp)
- Raw iteration times preserved for transparency
- Speedup calculations vs Python baseline included

### Benchmark Implementation (TDD)
| ID | Description | Status | Complexity | Priority |
|----|-------------|--------|------------|----------|
| BENCH-001 | File read (10MB text) | pending | 8 | P0 |
| BENCH-002 | File write (100K operations) | pending | 8 | P0 |
| BENCH-003 | String concatenation (10K ops) | ⚠️ partial | 6 | P0 | [#113](https://github.com/paiml/ruchy/issues/113) v3.171.0 |
| BENCH-004 | Regex matching (100K patterns) | pending | 10 | P0 | Retest with v3.171.0 |
| BENCH-005 | List operations (1M elements) | pending | 8 | P0 | Retest with v3.171.0 |
| BENCH-006 | HashMap operations (100K entries) | pending | 8 | P0 | Retest with v3.171.0 |
| BENCH-007 | Fibonacci recursive (n=20) | ✅ complete | 6 | P0 | v3.171.0, bashrs bench v6.25.0 |
| BENCH-008 | Prime generation (10K primes) | ⚠️ nearly | 8 | P0 | [#113](https://github.com/paiml/ruchy/issues/113) v3.171.0 |
| BENCH-009 | JSON parsing (10K objects) | pending | 10 | P0 |
| BENCH-010 | HTTP mock (1K requests) | pending | 12 | P0 |

### Documentation Tasks
| ID | Description | Status | Complexity | Priority |
|----|-------------|--------|------------|----------|
| DOC-001 | Create Chapter 23 structure | pending | 10 | P0 |
| DOC-002 | Document methodology | pending | 8 | P1 |
| DOC-003 | Generate results tables | pending | 6 | P0 |
| DOC-004 | Statistical analysis | pending | 10 | P1 |
| DOC-005 | Update INTEGRATION.md | pending | 5 | P1 |

## Quality Gates (MANDATORY)

### Scientific Rigor
- [ ] All benchmarks run 10+ iterations
- [ ] Statistical significance (p < 0.05)
- [ ] Standard deviation reported
- [ ] Reproducible on any machine
- [ ] Environment documented (CPU, RAM, OS)

### TDD Compliance
- [ ] RED phase: Write failing test first
- [ ] GREEN phase: Implement minimal code
- [ ] REFACTOR phase: Optimize and clean
- [ ] 100% test coverage on benchmark code

### bashrs Compliance
- [ ] All bash scripts use bashrs shebang
- [ ] bashrs lint passes (0 warnings)
- [ ] bashrs score >= 0.9
- [ ] bashrs audit passes
- [ ] bashrs format applied

### Reproducibility
- [ ] Single command runs all benchmarks
- [ ] Results output to CSV/JSON
- [ ] Timestamps and environment recorded
- [ ] Random seeds fixed for reproducibility
- [ ] No manual intervention required

## Execution Modes Explained (ELI5)

**6 ways to run the same code - what's the difference?**

| Mode | How It Works | Speed | Best For |
|------|--------------|-------|----------|
| **Python** | Python interpreter reads code line-by-line | Medium | Baseline comparison |
| **Deno** | TypeScript JIT compiles as it runs | Fast* | Long-running servers |
| **Ruchy AST** | Walk through code tree step-by-step | Slow | Development/debugging |
| **Ruchy Bytecode** | Pre-compiled VM instructions | Fast | Scripts, CLI tools |
| **Ruchy Transpiled** | Convert to Rust → compile | Very Fast | Performance-critical |
| **Ruchy Compiled** | Direct compilation to machine code | Fastest | Production binaries |

*Deno JIT: Slow startup (warmup), fast after warmup

**Key Terms:**
- **AST**: Code represented as a tree (like a flowchart)
- **Bytecode**: Numbered instructions (like LEGO building steps)
- **Transpile**: Translate code to another language (Ruchy → Rust)
- **Compile**: Convert code to machine code (1s and 0s)
- **JIT**: Compile while running (gets faster over time)

See `test/ch23-benchmarks/LEGEND.md` for detailed explanations.

## Methodology

### Benchmark Execution (Updated: bashrs bench v6.25.0)

**NEW**: Using bashrs bench v6.25.0 built-in benchmarking with quality gates!

```bash
#!/usr/bin/env bash

# bashrs bench provides:
# - Warmup iterations (default: 3)
# - Measured iterations (default: 10)
# - Statistical analysis (mean, median, stddev, min, max)
# - JSON output with structured results
# - Quality gates (lint + determinism checking)
# - Reproducibility verification

# Example usage:
bashrs bench \
    --warmup 3 \
    --iterations 10 \
    --output results.json \
    --verify-determinism \
    --strict \
    script.sh

# Framework creates temporary wrapper scripts for each mode:
# - python: python3 script.py
# - ruchy-ast: ruchy run script.ruchy
# - ruchy-bytecode: ruchy --vm-mode bytecode run script.ruchy
# - ruchy-transpile: Pre-compile, then benchmark binary
# - ruchy-compile: Pre-compile, then benchmark binary
```

**Key Improvements:**
- ✅ Built-in statistical analysis (no custom Python scripts needed)
- ✅ Determinism verification (ensures reproducibility)
- ✅ Quality gates (lint checks on benchmark scripts)
- ✅ Structured JSON output (version, environment, statistics)
- ✅ Compilation separated from timing (transpile/compile modes)
- ✅ Stdout suppression (no output contamination)

### Five Execution Modes

**A. Python Standard Library**:
```bash
time python3 benchmark.py
```

**B. Ruchy Interpreted (AST)**:
```bash
time ruchy run benchmark.ruchy
```

**C. Ruchy Bytecode VM (Experimental)**:
```bash
time ruchy --vm-mode bytecode run benchmark.ruchy
```

**D. Ruchy Transpiled**:
```bash
ruchy transpile benchmark.ruchy > benchmark.rs
time rustc -O benchmark.rs && time ./benchmark
```

**E. Ruchy Compiled Binary**:
```bash
time ruchy compile benchmark.ruchy -o benchmark && time ./benchmark
```

## Actual Results (bashrs bench v6.25.0)

### BENCH-007: Fibonacci recursive (n=20)

| Benchmark | Python (ms) | Deno (ms) | Ruchy AST (ms) | Ruchy Bytecode (ms) | Ruchy Transpiled (ms) | Ruchy Compiled (ms) | Best Speedup |
|-----------|-------------|-----------|----------------|---------------------|----------------------|---------------------|--------------|
| Fibonacci (n=20) | 16.65 ± 1.00 | 27.40 ± 1.01 | 149.43 ± 2.21 | 3.69 ± 0.38 | 1.70 ± 0.42 | 1.68 ± 0.20 | **9.91x** (compiled) |

**Key Findings:**
- ⚠️ Deno TypeScript: **0.61x** (1.6x SLOWER than Python - JIT warmup overhead)
- ✅ Ruchy bytecode: **4.51x faster** than Python
- ✅ Ruchy transpiled: **9.79x faster** than Python
- ✅ Ruchy compiled: **9.91x faster** than Python
- ⚠️ Ruchy AST: 0.11x (interpreter overhead - expected)

**Environment:**
- CPU: AMD Ryzen Threadripper 7960X 24-Cores
- RAM: 125Gi
- OS: Linux 6.8.0-85-generic
- Date: 2025-11-02
- Tool: bashrs bench v6.25.0 with determinism verification

## Expected Results Table Format (Remaining Benchmarks)

| Benchmark | Python (ms) | Ruchy AST (ms) | Ruchy Bytecode (ms) | Ruchy Transpiled (ms) | Ruchy Compiled (ms) | Best Speedup vs Python |
|-----------|-------------|----------------|---------------------|----------------------|---------------------|------------------------|
| File Read 10MB | TBD | TBD | TBD | TBD | TBD | TBD |
| String Concat (10K) | TBD | TBD | TBD | Blocked [#113] | Blocked [#113] | TBD |
| ... | ... | ... | ... | ... | ... | ... |

## Definition of Done

- [ ] All 10 benchmarks implemented with TDD
- [ ] All benchmarks pass quality gates
- [ ] Results table generated and documented
- [ ] Statistical analysis completed
- [ ] Chapter 23 written and validated
- [ ] bashrs compliance verified
- [ ] Reproducibility tested on clean machine
- [ ] INTEGRATION.md updated

## Notes

- Use fixed random seeds for reproducibility
- Document all environment variables
- Include CPU/RAM/OS specs in results
- Report both mean and median
- Calculate statistical significance
- Include error bars in visualizations
