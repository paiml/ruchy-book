# TICKET-020: Add Debugging Tools as 19th Mandatory Tool (CRITICAL)

**Status**: OPEN
**Priority**: CRITICAL (Essential for production code quality)
**Assigned**: Book Development Team
**Created**: 2025-10-30
**Target**: Sprint Q4 2025 (Immediate)
**Approach**: EXTREME TDD (Test-Driven Development)
**Parent**: TICKET-018 (19-Tool Comprehensive Testing)

## Problem Statement

Debugging tools are CRITICAL to ruchy development and must be tested on ALL examples. Currently testing only 18 tools (3 core + 15 quality), missing the essential debugging infrastructure that ruchy itself relies on.

### Current State
- **Tools tested**: 18/19 (94.7%)
- **Missing**: Debugging tools (ruchydbg, --trace, dataflow:debug)
- **Impact**: Cannot verify examples work with debugging enabled
- **Risk**: Examples may break debugging workflows

### Evidence
From ../ruchyruchy README.md:
- **ruchydbg v3.169.0**: Complete debugging toolkit
- **12 debugging features**: DAP server, breakpoints, time-travel, etc.
- **1.4M+ test executions**: Production-ready debugging infrastructure
- **95%+ bug detection rate**: Critical quality tool

## The 19 Mandatory Tools

### Core Execution Tools (3)
1. **run**: Execute Ruchy code
2. **compile**: Compile to Rust binary
3. **wasm**: Compile to WebAssembly

### Quality Analysis Tools (15)
4. **check**: Syntax validation
5. **test**: Run tests with coverage
6. **fmt**: Format code
7. **lint**: Style analysis
8. **provability**: Formal verification analysis
9. **runtime**: Performance and BigO analysis
10. **score**: Quality scoring (A+ grades)
11. **quality-gate**: Quality gate enforcement
12. **optimize**: Hardware-aware optimization
13. **prove**: Interactive theorem prover
14. **doc**: Documentation generation
15. **bench**: Performance benchmarking
16. **ast**: AST analysis and visualization
17. **coverage**: Coverage reporting
18. **mcp**: MCP server quality analysis

### Debugging Tools (NEW - 1 tool with 3 modes) 🆕
19. **debug**: Comprehensive debugging support
    - **ruchydbg validate**: Validate debugging infrastructure
    - **ruchy --trace**: Execution tracing with type information
    - **ruchy dataflow:debug**: DataFrame pipeline debugging

## Why Debugging is Critical

### 1. Self-Dogfooding
- Ruchy compiler uses ruchyruchy for debugging
- Examples must work with debugging tools ruchy team uses
- Integration testing validates real-world usage

### 2. Educational Value
- Chapter 13 covers debugging and tracing
- Examples demonstrate debugging capabilities
- Students need working debugging examples

### 3. Quality Assurance
- Debugging reveals runtime issues not caught by static analysis
- Trace output validates execution correctness
- Performance profiling identifies bottlenecks

### 4. Bug Discovery
- 95%+ bug detection rate with ruchyruchy tools
- Early detection prevents production issues
- Automated bug filing and reporting

## Acceptance Criteria (Definition of Done)

### Must Have (BLOCKING)
- [ ] All 142 examples tested with `ruchydbg validate`
- [ ] All runnable examples tested with `ruchy --trace`
- [ ] DataFrame examples tested with `ruchy dataflow:debug`
- [ ] Debugging results documented in INTEGRATION.md
- [ ] TICKET-018 updated to reflect 19 tools
- [ ] Pre-commit hook validates debugging

### Should Have
- [ ] Debugging failures categorized and documented
- [ ] Examples that break debugging identified
- [ ] Workarounds or fixes implemented
- [ ] Performance metrics for debugging overhead

### Nice to Have
- [ ] Per-example debugging report
- [ ] Trace output validation
- [ ] Debug visualization screenshots

## Implementation Plan (Extreme TDD)

### Phase 1: Research Available Tools (30 min) ✅
```bash
# Identify all debugging capabilities
ruchydbg --help
ruchy --help | grep -i debug
ruchy --help | grep -i trace
ruchy help dataflow:debug

# Test each tool manually
ruchydbg validate
echo "2 + 2" | ruchy --trace
# Create simple DataFrame example for dataflow:debug
```

**Completed Research**:
- ✅ ruchydbg has 3 commands: run, validate, version
- ✅ ruchy has --trace flag for execution tracing
- ✅ ruchy has dataflow:debug subcommand for DataFrames
- ✅ All tools available in v3.169.0

### Phase 2: Update Testing Infrastructure (1 hour)
```typescript
// scripts/extract-examples.ts additions

interface DebugResults {
  ruchydbg_validate: boolean;
  ruchy_trace: boolean;
  dataflow_debug: boolean;  // Only for DataFrame examples
}

async function testWithDebugging(example: Example): Promise<DebugResults> {
  // Test 1: ruchydbg validation
  const validateResult = await runCommand("ruchydbg", ["validate"]);

  // Test 2: Trace execution
  const traceResult = await runCommand("ruchy", ["--trace", "-e", example.code]);

  // Test 3: DataFrame debugging (if applicable)
  let dataflowResult = null;
  if (example.code.includes("DataFrame") || example.code.includes("dataframe")) {
    dataflowResult = await runCommand("ruchy", ["dataflow:debug", ...]);
  }

  return { ... };
}
```

### Phase 3: Test All Examples with Debugging (2 hours)
```bash
# Run comprehensive debugging tests
deno task extract-examples --with-debugging

# Analyze results
cat test/extracted-examples/debugging.json
cat test/extracted-examples/debugging-failures.log
```

### Phase 4: Document and Fix Issues (1 hour)
```bash
# Document debugging failures
echo "## Debugging Test Results" >> INTEGRATION.md
echo "- ruchydbg validate: X/142 passing" >> INTEGRATION.md
echo "- ruchy --trace: Y/142 passing" >> INTEGRATION.md
echo "- dataflow:debug: Z/4 passing (DataFrame examples only)" >> INTEGRATION.md

# Fix critical failures
# File bugs for debugging tool issues
# Update examples that break debugging
```

### Phase 5: Update TICKET-018 and Documentation (30 min)
- Update TICKET-018 title: "18-Tool" → "19-Tool Comprehensive Testing"
- Update all references to 18 tools → 19 tools
- Document debugging as critical 19th tool
- Update pre-commit hook to include debugging validation

## Test Fixtures

### Fixture 1: Simple Expression (all 3 debugging modes)
```ruchy
2 + 2
```
**Test ruchydbg**: `ruchydbg validate` (should pass infrastructure checks)
**Test trace**: `echo "2 + 2" | ruchy --trace` (should show execution trace)
**Expected trace**:
```
4
```

### Fixture 2: Function with Tracing
```ruchy
fun square(x) {
    x * x
}
square(5)
```
**Test trace**: `ruchy --trace -e '...'`
**Expected trace**:
```
TRACE: → square(5: integer)
TRACE: ← square = 25: integer
25
```

### Fixture 3: DataFrame with Pipeline Debugging
```ruchy
let df = DataFrame::new()
    .add_column("x", vec![1, 2, 3])
    .filter(|row| row["x"] > 1);
```
**Test dataflow:debug**: `ruchy dataflow:debug --config ...`
**Expected**: Interactive pipeline debugger UI

## Success Metrics

### Sprint Success (Immediate)
- [ ] All 142 examples tested with debugging
- [ ] 19-tool testing framework complete
- [ ] Debugging results documented in INTEGRATION.md
- [ ] TICKET-018 updated to reflect 19 tools

### Long-term Success
- [ ] Debugging tests integrated into CI/CD
- [ ] Pre-commit hook validates debugging
- [ ] Chapter 13 examples all debuggable
- [ ] Zero examples break debugging tools

## Risks and Mitigations

### Risk: Examples break with --trace flag
**Mitigation**: Document which examples are trace-compatible, file bugs for broken ones

### Risk: ruchydbg validate expects specific setup
**Mitigation**: Research ruchydbg requirements, document setup in README

### Risk: dataflow:debug requires interactive mode
**Mitigation**: Use --format json or --export flags for automation

### Risk: Debugging adds significant overhead to testing
**Mitigation**: Run debugging tests separately, optimize for speed

## Dependencies

- ruchyruchy v3.169.0 (installed via cargo)
- ruchy v3.169.0 (current version with --trace)
- deno runtime (for TypeScript test infrastructure)
- TICKET-018 (parent ticket for comprehensive testing)

## References

- TICKET-018: 18-Tool Comprehensive Testing
- ../ruchyruchy/README.md: Complete debugging tools documentation
- src/ch13-00-debugging-tracing-tdd.md: Debugging chapter
- docs/DEBUGGER_RESEARCH_v3.169.0.md: v3.169.0 debugging features

## Integration with TICKET-018

This ticket EXTENDS TICKET-018 to include the critical 19th tool:

| Ticket | Tools | Status |
|--------|-------|--------|
| TICKET-018 Original | 18 tools (3 core + 15 quality) | In Progress |
| **TICKET-020 Addition** | **+1 debugging tool** | **New** |
| **TICKET-018 Updated** | **19 tools total** | **Enhanced** |

## TDD Workflow Summary

```
1. RED:   Test examples with debugging (expect some failures)
2. GREEN: Fix infrastructure to make tests pass
3. REFACTOR: Optimize debugging test performance
4. DOCUMENT: Update INTEGRATION.md with results
5. INTEGRATE: Merge into TICKET-018 framework
6. ENFORCE: Add to pre-commit hook validation
```

**EXTREME TDD**: Test debugging on ALL examples, document ALL results, fix ALL issues.

---

**CRITICAL**: Debugging is not optional - it's how ruchy itself is developed. Must validate all examples work with the tools ruchy developers use daily.
