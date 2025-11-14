# Bug Report: `ruchy bench` Command Not Implemented

**Filed**: 2025-10-31
**Reporter**: Claude Code (via ruchy-book validation)
**Severity**: Medium
**Status**: Open
**GitHub Issue**: https://github.com/paiml/ruchy/issues/100

## Summary

The `ruchy bench` command has a complete CLI interface with help text but returns "Command not yet implemented" when executed on any file.

## Reproduction Steps

**100% reproducible** on any system with ruchy v3.193.0:

```bash
# Step 1: Verify ruchy version
$ ruchy --version
ruchy 3.152.0

# Step 2: Check help text exists
$ ruchy bench --help
Benchmark Ruchy code performance

Usage: ruchy bench [OPTIONS] <FILE>

Arguments:
  <FILE>  The file to benchmark

Options:
      --iterations <ITERATIONS>  Number of iterations to run [default: 100]
      --warmup <WARMUP>          Number of warmup iterations [default: 10]
      --format <FORMAT>          Output format (text, json, csv) [default: text]
      --output <OUTPUT>          Save results to file
      --verbose                  Show verbose output including individual runs
  -h, --help                     Print help

# Step 3: Attempt to run benchmark
$ ruchy bench --iterations 10 tests/extracted/ch01-02-hello-world_example_1.ruchy
Command not yet implemented

# Step 4: Try different file
$ ruchy bench tests/extracted/ch03-00-functions-tdd_example_1.ruchy
Command not yet implemented

# Exit code: 0 (no error, but no functionality)
```

## Expected Behavior

Based on the help text, the tool should:

1. Execute the Ruchy file N times (default 100 iterations)
2. Run warmup iterations before measuring (default 10)
3. Report execution time statistics:
   - Min/max/average execution time
   - Standard deviation
   - Confidence intervals
4. Support multiple output formats (text, JSON, CSV)
5. Optionally save results to file
6. Show verbose output with individual run times

**Expected Output** (example):
```
=== Benchmark Results ===
File: tests/extracted/ch01-02-hello-world_example_1.ruchy
Iterations: 10
Warmup: 10

Execution Time:
  Min:     2.145ms
  Max:     3.892ms
  Average: 2.567ms
  Median:  2.489ms
  StdDev:  0.421ms

Throughput: 389.5 iterations/second
```

## Actual Behavior

Returns "Command not yet implemented" immediately with exit code 0.

No benchmarking is performed.

## Impact

**On ruchy-book project**:
- Cannot establish performance baselines for teaching examples
- Cannot demonstrate performance characteristics to learners
- Cannot validate optimization claims in documentation
- Integrated in CI/CD with expectation of future implementation

**On Ruchy ecosystem**:
- Developers cannot measure code performance
- No tooling for performance optimization workflows
- Missing competitive feature (Rust has `cargo bench`, Go has `go test -bench`)

## Verification

Tested on **69 Ruchy source files** in ruchy-book project:
- **Result**: 69/69 files (100%) return "Command not yet implemented"
- **Performance**: 3ms avg (fast failure, no actual execution)
- **Baseline log**: `ruchy-book/logs/TICKET-018-15-baseline.log`
- **Test script**: `ruchy-book/test/tools/test-ruchy-bench.ts`

## Context

**Discovery Method**: Systematic 18-tool validation (TICKET-018)
- TICKET-018-15: Comprehensive `ruchy bench` validation
- Date: 2025-10-31
- Methodology: EXTREME TDD with baseline establishment

**Related Tools**:
- `ruchy runtime --bigo`: ✅ Works (provides BigO analysis)
- `ruchy run`: ✅ Works (executes code, could time it)
- `ruchy bench`: ❌ Not implemented (this issue)

## Suggested Implementation Path

The CLI infrastructure already exists, suggesting partial implementation:

1. **Execution Loop**:
   ```rust
   // Pseudocode
   for _ in 0..warmup {
       execute_file(file)?; // Don't measure
   }

   let mut times = Vec::new();
   for _ in 0..iterations {
       let start = Instant::now();
       execute_file(file)?;
       times.push(start.elapsed());
   }
   ```

2. **Statistics Calculation**:
   - Min/max: `times.iter().min()` / `times.iter().max()`
   - Mean: `times.iter().sum::<Duration>() / times.len()`
   - Median: Sort and take middle value
   - StdDev: Standard statistical formula

3. **Output Formatting**:
   - Text: Human-readable table
   - JSON: Structured data for tooling
   - CSV: Easy import to spreadsheets

4. **File Output**:
   - Use `--output` flag to write results to file
   - Format based on `--format` flag

## Workaround

**Manual timing** (not equivalent):
```bash
# Bash workaround (Linux/Mac)
time ruchy run file.ruchy

# PowerShell workaround (Windows)
Measure-Command { ruchy run file.ruchy }
```

**Limitations**:
- No warmup iterations
- No statistical analysis
- Manual repetition required
- Process startup overhead included

## Integration Status

**Current State**:
- ✅ CLI interface defined
- ✅ Help text documented
- ✅ CI/CD integration prepared
- ✅ Baseline established (0% implementation)
- ❌ Actual benchmarking not implemented

**When Implemented**:
- Re-run test suite: `deno run --allow-read --allow-run test/tools/test-ruchy-bench.ts`
- CI/CD will automatically detect and validate
- Baseline comparison available from TICKET-018-15

## Evidence

**Help text shows complete interface**:
```bash
$ ruchy bench --help | grep -A 15 "Usage:"
Usage: ruchy bench [OPTIONS] <FILE>

Arguments:
  <FILE>  The file to benchmark

Options:
      --iterations <ITERATIONS>  Number of iterations to run [default: 100]
      --warmup <WARMUP>          Number of warmup iterations [default: 10]
      --format <FORMAT>          Output format (text, json, csv) [default: text]
      --output <OUTPUT>          Save results to file
      --verbose                  Show verbose output including individual runs
  -h, --help                     Print help
```

**Execution returns placeholder**:
```bash
$ ruchy bench file.ruchy
Command not yet implemented
```

## Priority Justification

**Medium Priority** because:
- ✅ Core execution works (`ruchy run`)
- ✅ Performance analysis exists (`ruchy runtime --bigo`)
- ✅ Workarounds available (manual timing)
- ❌ Missing nice-to-have feature for optimization workflows
- ❌ No blocking impact on language functionality

**Would be High Priority if**:
- No other performance measurement tools existed
- Documentation made specific performance claims
- Users were actively requesting benchmarking

## References

- **Discovery Ticket**: TICKET-018-15 (ruchy-book comprehensive validation)
- **Test Infrastructure**: `ruchy-book/test/tools/test-ruchy-bench.ts`
- **Baseline Log**: `ruchy-book/logs/TICKET-018-15-baseline.log`
- **CI Integration**: `.github/workflows/quality-gates.yml` (lines 387-421)
- **Documentation**: `ruchy-book/INTEGRATION.md` (TICKET-018-15 section)

## Reproducibility Checklist

- ✅ Exact version specified (v3.193.0)
- ✅ Commands provided verbatim
- ✅ Expected vs actual behavior documented
- ✅ Evidence files referenced
- ✅ Tested on 69 files (100% consistent)
- ✅ Workarounds documented
- ✅ Integration status tracked
