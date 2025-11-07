# Broken Examples - Language Features Not Yet Implemented

These examples are **INTENTIONALLY** in the broken directory because they require
language features that have not been implemented yet.

## Categories

### 1. DataFrame::new (5 examples)
**Missing Feature**: Builder pattern + qualified names (Type::method)
**Files**:
- test/ch18-dataframes/01-dataframe-creation.ruchy
- test/ch18-dataframes/02-dataframe-operations.ruchy  
- test/ch18-dataframes/03-dataframe-analytics.ruchy
- test/dataframe-tests/comprehensive_test.ruchy
- test/dataframe-tests/working_example.ruchy

**Required Implementation**:
- Qualified name resolution (DataFrame::new)
- Builder pattern with method chaining
- DataFrame type and methods

### 2. Module System (2 examples)
**Missing Feature**: mod keyword and module namespacing
**Files**:
- tests/ch04-modules/test_01_basic_module.ruchy
- tests/ch04-modules/test_02_use_statement.ruchy

**Required Implementation**:
- mod keyword parsing
- Namespace resolution (math::add)
- use statements

### 3. File API (2 examples)
**Missing Feature**: File handle methods
**Files**:
- test/ch21-benchmarks/bench-004-binary-tree.ruchy (timeout - deep recursion)
- test/ch21-benchmarks/bench-006-file-processing.ruchy (read_line() method)

**Required Implementation**:
- File.read_line() method
- Performance optimization for deep recursion

### 4. Missing Test Data (1 example)
**Missing Feature**: Large benchmark data file
**Files**:
- test/validate-bench-009.ruchy

**Required**: test-data/sample-benchmark.json with 1000+ users

---

**Status**: These are NOT bugs - they are TODO features tracked in roadmap.
**Validation**: 111/121 working (91.7%) - 10 examples require new features
