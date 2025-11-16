# TICKET-018: 18-Tool Comprehensive Testing (MANDATORY)

**Status**: OPEN (Long-term Enhancement)
**Priority**: MEDIUM (Future Work)
**Assigned**: Book Development Team
**Created**: 2025-10-30
**Updated**: 2025-11-02
**Target**: Sprint Q1 2026

**Note**: TICKET-020 (Debugging Tools) completed 2025-11-02 as part of this initiative. Debugging tools now validated and documented.

## Problem Statement

Currently, book examples are only tested with `ruchy run` (1 tool). This is insufficient for comprehensive quality validation. We need to enforce testing with ALL 18 Ruchy tools to ensure examples meet professional quality standards.

## The 18 Mandatory Tools

### Core Execution (3 tools)
1. **ruchy run** - Interpreter execution (current)
2. **ruchy compile** - Transpile to Rust binary
3. **ruchy wasm** - Compile to WebAssembly

### Quality Analysis (15 tools)
4. **ruchy check** - Syntax validation
5. **ruchy test** - Test execution with coverage
6. **ruchy fmt** - Format validation
7. **ruchy lint** - Style and issue detection
8. **ruchy provability** - Formal verification analysis
9. **ruchy runtime** - Performance and BigO complexity
10. **ruchy score** - Unified quality scoring
11. **ruchy quality-gate** - Quality gate enforcement
12. **ruchy optimize** - Hardware-aware optimization
13. **ruchy prove** - Interactive theorem prover
14. **ruchy doc** - Documentation generation
15. **ruchy bench** - Performance benchmarking
16. **ruchy ast** - AST analysis and visualization
17. **ruchy coverage** - Coverage reporting
18. **ruchy mcp** - MCP server quality analysis

### Debugging (Bonus - Not Counted)
- **ruchy --trace** - Type-aware execution tracing (optional for debugging)

## Requirements

### Acceptance Criteria
- [ ] All 18 tools run on every book example
- [ ] Results tracked per tool per example
- [ ] Pre-commit hook enforces 18-tool testing
- [ ] INTEGRATION.md reports all 18 tool results
- [ ] Failing examples clearly show which tool(s) failed
- [ ] Pass rate calculated per tool (18 separate metrics)

### Quality Gates (BLOCKING)
```bash
# Pre-commit hook MUST verify:
1. ALL 18 tools execute on changed examples
2. Results logged to test/extracted-examples/
3. Summary shows pass/fail per tool
4. No commit allowed if infrastructure broken
```

### Expected Output Format
```json
{
  "example": "ch01_example_1",
  "tools": {
    "run": { "passed": true, "time_ms": 150 },
    "compile": { "passed": true, "time_ms": 4500 },
    "wasm": { "passed": true, "time_ms": 3200 },
    "check": { "passed": true },
    "test": { "passed": true, "coverage": 100 },
    "fmt": { "passed": false, "reason": "formatting needed" },
    "lint": { "passed": true },
    "provability": { "passed": true, "score": 95 },
    "runtime": { "passed": true, "complexity": "O(1)" },
    "score": { "passed": true, "grade": "A+", "score": 1.0 },
    "quality-gate": { "passed": true },
    "optimize": { "passed": true },
    "prove": { "passed": true },
    "doc": { "passed": true },
    "bench": { "passed": true },
    "ast": { "passed": true },
    "coverage": { "passed": true, "percent": 100 },
    "mcp": { "passed": true }
  },
  "overall_pass": false,
  "tools_passed": 17,
  "tools_failed": 1
}
```

### Reporting Requirements

**Per Example:**
- 18 tool results (pass/fail)
- Execution time for each tool
- Detailed failure reasons
- Overall pass (all 18 must pass)

**Aggregate:**
- Per-tool pass rates (e.g., "fmt: 45/142 = 32%")
- Per-chapter tool analysis
- Trends over time
- Tool reliability metrics

## Implementation Plan

### Phase 1: Infrastructure (Week 1-2)
- [ ] Update `extract-examples.ts` to run all 18 tools
- [ ] Create tool result data structures
- [ ] Implement parallel tool execution (performance)
- [ ] Add timeout handling per tool (30s each)

### Phase 2: Reporting (Week 3)
- [ ] Update JSON output format
- [ ] Create per-tool summary reports
- [ ] Update INTEGRATION.md template
- [ ] Add HTML dashboard with tool breakdown

### Phase 3: Enforcement (Week 4)
- [ ] Create pre-commit hook script
- [ ] Add quality gate validation
- [ ] Update CLAUDE.md with requirements
- [ ] Document tool failure patterns

### Phase 4: Analysis (Week 5-6)
- [ ] Baseline current pass rates per tool
- [ ] Identify common failure patterns
- [ ] Create tool-specific fix recommendations
- [ ] Track improvement over time

## Expected Baseline (v3.213.0)

Based on current dogfooding results:
- **run**: ~91% (129/142)
- **check**: ~100% (69/69 tested)
- **lint**: ~100% (69/69 tested)
- **fmt**: ~0% (known issue)
- **compile**: Unknown (not tested)
- **wasm**: Unknown (not tested)
- **test**: Unknown (not all examples have tests)
- **Other tools**: Unknown

**Realistic Target**: 50-70% pass rate across all 18 tools initially

## Benefits

### Quality Improvements
1. **Comprehensive validation** - Not just "does it run" but "is it high quality"
2. **Early issue detection** - Find problems before users do
3. **Tool reliability testing** - Validate Ruchy tools themselves
4. **Professional standards** - Match industry best practices

### Developer Experience
1. **Clear quality metrics** - Know exactly what needs fixing
2. **Automated feedback** - No manual tool running
3. **Trend analysis** - Track quality over time
4. **Tool-specific fixes** - Target improvements effectively

### Documentation Quality
1. **Verified examples** - Every example is comprehensively tested
2. **Production-ready code** - Examples meet all quality standards
3. **Teaching quality** - Show best practices, not just working code
4. **Future-proof** - Examples work with all Ruchy features

## Technical Considerations

### Performance
- Run tools in parallel where possible
- Cache results between runs
- Skip unchanged examples
- Target: <5 minutes for full suite

### Reliability
- Handle tool crashes gracefully
- Timeout protection (30s per tool)
- Clear error messages
- Retry logic for transient failures

### Maintainability
- Modular tool runner design
- Easy to add new tools
- Configuration-driven
- Well-documented

## Success Metrics

### Sprint Success
- [ ] All 18 tools integrated
- [ ] Pre-commit hook enforcing
- [ ] Baseline measurements complete
- [ ] First improvement sprint planned

### Long-term Success
- Per-tool pass rates improving over time
- Clear documentation of tool requirements
- Examples meeting 80%+ pass rate across all tools
- Automated quality feedback loop

## Dependencies

- Ruchy v3.213.0 or later (all 18 tools available)
- Updated test infrastructure (Deno/TypeScript)
- Pre-commit hook system
- Adequate CI/CD resources (18x testing load)

## Risks and Mitigations

### Risk: Performance Impact
**Mitigation**: Parallel execution, caching, incremental testing

### Risk: False Positives
**Mitigation**: Tool-specific pass/fail criteria, grace periods for new tools

### Risk: Developer Friction
**Mitigation**: Clear documentation, helpful error messages, quick feedback

### Risk: Infrastructure Complexity
**Mitigation**: Modular design, comprehensive tests, good logging

## Next Steps

1. Review and approve ticket
2. Assign to sprint
3. Create implementation branch
4. Begin Phase 1 development
5. Weekly progress reviews

## References

- INTEGRATION.md (current testing status)
- CLAUDE.md (development protocol)
- Makefile (dogfooding commands)
- DEBUGGER_RESEARCH_v3.213.0.md (tool documentation)

---

**MANDATORY REQUIREMENT**: This ticket is BLOCKING for achieving professional-grade documentation quality. No exceptions.
