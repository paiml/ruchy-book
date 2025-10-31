# TICKET-028: Comprehensive Tool Expansion - ALL Remaining Tools

**Phase**: Phase 2 - Extended Tool Validation
**Status**: 🚀 IN PROGRESS - Expanding from 18 to 50+ validations
**Started**: 2025-10-31
**Target**: Complete validation of ALL Ruchy tools, flags, and debugger

## Overview

Expand tool validation from 18 core quality tools to comprehensive coverage of ALL Ruchy tools:
- **Current**: 18/18 core quality tools (100%)
- **Target**: 50+ total validations including:
  - 16 additional subcommands
  - Key flags (--trace, --vm-mode, --eval)
  - Separate debugger binary (ruchydbg)

## Scope Expansion Analysis

### TICKET-018 Completed (18 tools - Core Quality)
✅ check, lint, score, compile, test, coverage, fmt, quality-gate, ast
✅ runtime, provability, run, repl, prove
⏳ bench (not impl), doc (not impl), optimize (not impl)
🔧 mcp (feature-flagged)

### TICKET-028 Expansion (30+ additional validations)

**Category A: Project Management (4 tools)**
- TICKET-028-01: `ruchy new` - Project creation
- TICKET-028-02: `ruchy build` - Build wrapper
- TICKET-028-03: `ruchy add` - Dependency management
- TICKET-028-04: `ruchy publish` - Package registry

**Category B: Development Tools (4 tools)**
- TICKET-028-05: `ruchy parse` - AST parsing
- TICKET-028-06: `ruchy transpile` - Rust code generation
- TICKET-028-07: `ruchy notebook` - Interactive notebook server
- TICKET-028-08: `ruchy serve` - HTTP server

**Category C: Advanced Debugging (2 tools)**
- TICKET-028-09: `ruchy actor:observe` - Actor introspection
- TICKET-028-10: `ruchy dataflow:debug` - DataFrame debugging

**Category D: Testing Extensions (4 tools)**
- TICKET-028-11: `ruchy property-tests` - Property-based testing
- TICKET-028-12: `ruchy mutations` - Mutation testing
- TICKET-028-13: `ruchy fuzz` - Fuzz testing
- TICKET-028-14: `ruchy replay-to-tests` - REPL conversion

**Category E: Special Platforms (1 tool) - PRIORITY**
- TICKET-028-15: `ruchy wasm` - WebAssembly toolkit ⭐

**Category F: Core Flags (3 flags)**
- TICKET-028-16: `ruchy --trace` - Execution tracing ⭐
- TICKET-028-17: `ruchy --vm-mode` - AST vs bytecode VM
- TICKET-028-18: `ruchy --eval` - One-liner evaluation

**Category G: Debugger Binary (3 commands) - PRIORITY**
- TICKET-028-19: `ruchydbg run` - Debug execution ⭐
- TICKET-028-20: `ruchydbg validate` - Debugger validation
- TICKET-028-21: `ruchydbg version` - Version info

**Category H: Additional Utilities**
- TICKET-028-22: `ruchy help` - Help system validation

## Priority Order (EXTREME TDD Implementation)

### HIGH PRIORITY (Implement First - 5 tickets)
1. **TICKET-028-16**: `--trace` flag (execution tracing) - Debug visibility
2. **TICKET-028-19**: `ruchydbg run` (debugger execution) - Time-travel debugging
3. **TICKET-028-15**: `ruchy wasm` (WebAssembly toolkit) - Platform extension
4. **TICKET-028-06**: `ruchy transpile` (Rust generation) - Core functionality
5. **TICKET-028-05**: `ruchy parse` (AST parsing) - Core functionality

### MEDIUM PRIORITY (Implement Second - 7 tickets)
6. **TICKET-028-11**: `ruchy property-tests` - Advanced testing
7. **TICKET-028-12**: `ruchy mutations` - Test quality
8. **TICKET-028-13**: `ruchy fuzz` - Crash detection
9. **TICKET-028-07**: `ruchy notebook` - Interactive development
10. **TICKET-028-09**: `ruchy actor:observe` - Actor debugging
11. **TICKET-028-10**: `ruchy dataflow:debug` - DataFrame debugging
12. **TICKET-028-20**: `ruchydbg validate` - Debugger validation

### LOW PRIORITY (Implement Last - 10 tickets)
13-22. Project management, utilities, remaining flags

## Roadmap Structure

Each ticket follows EXTREME TDD:

### RED Phase (15 min)
- Discover tool behavior
- Create test infrastructure
- Generate baseline metrics
- Document expected vs actual

### GREEN Phase (15 min)
- Add CI/CD integration
- Update quality gates
- Document status

### REFACTOR Phase (20 min)
- Update INTEGRATION.md
- Update README.md progress
- Commit and push
- Move to next tool

**Total Time per Tool**: ~50 minutes (proven pattern from TICKET-018)

## Success Metrics

### Comprehensive Coverage
- **Total Validations**: 50+ (from 18)
- **Subcommands**: 34/34 (100%)
- **Key Flags**: 3+ validated
- **Debugger**: 3/3 commands
- **All Categories**: A-H complete

### Quality Standards
- Each tool tested with EXTREME TDD
- Baseline established for all tools
- CI/CD integration for each
- Documentation comprehensive
- GitHub issues filed for non-implemented

## Deliverables

### Phase 2A: High Priority (5 tools)
1. `test/tools/test-ruchy-trace.ts` + baseline
2. `test/tools/test-ruchydbg-run.ts` + baseline
3. `test/tools/test-ruchy-wasm.ts` + baseline
4. `test/tools/test-ruchy-transpile.ts` + baseline
5. `test/tools/test-ruchy-parse.ts` + baseline

### Phase 2B: Medium Priority (7 tools)
6-12. Test infrastructure for all medium priority tools

### Phase 2C: Low Priority (10 tools)
13-22. Test infrastructure for remaining tools

### Documentation Updates
- INTEGRATION.md: Comprehensive Phase 2 section
- README.md: Updated progress (18/18 → 50+/50+)
- CI/CD: All tools integrated

## Notes

- **TICKET-018**: Focused on core quality/analysis tools (18/18 ✅)
- **TICKET-028**: Expands to ALL tools for complete coverage
- **Pattern Proven**: 50min per tool with EXTREME TDD
- **Estimated Total**: ~25 hours for all 30 tools (50min × 30)
- **Parallel Work**: Can be done across multiple sessions

## References

- Parent: TICKET-018 (Comprehensive 18-Tool Testing - COMPLETE)
- Related: INTEGRATION.md - Phase 2 expansion
- Tools List: `ruchy --help` (34 subcommands)
- Debugger: `ruchydbg --help` (separate binary)

---

**Status**: Ready to begin Phase 2A - High Priority tools
**First Ticket**: TICKET-028-16 (--trace flag)
**Expected Duration**: 50 minutes per tool
