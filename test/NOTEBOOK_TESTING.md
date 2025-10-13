# Notebook Testing (Layer 5 Validation)

Part of the **7-Layer Validation Stack** for extreme TDD refactoring.

## Overview

The notebook testing system validates that all book examples work correctly when executed in the Ruchy notebook environment. This ensures examples work in both compiled and interpreted modes.

## Prerequisites

### 1. Start Ruchy Notebook Server

```bash
# Start notebook server on port 8080
ruchy notebook --port 8080

# Or run in background
ruchy notebook --port 8080 &

# Check server is running
curl http://localhost:8080/api/health
```

## Usage

### Test Single Chapter

```bash
# Test Ch01 in notebook
make test-notebook-ch01

# Test Ch02 in notebook
make test-notebook-ch02

# Test Ch03 in notebook
make test-notebook-ch03

# Test any chapter
make test-notebook CHAPTER=ch04
```

### Direct Script Usage

```bash
# Using deno directly
deno run --allow-all scripts/test-in-notebook.ts ch01

# Or make the script executable and run it
chmod +x scripts/test-in-notebook.ts
./scripts/test-in-notebook.ts ch01
```

## What Gets Tested

The notebook testing script:

1. **Extracts examples** from chapter test scripts (e.g., `test/ch01/test_all_ch01.sh`)
2. **Executes each example** via the notebook API (`POST /api/execute`)
3. **Validates execution** succeeds and produces output
4. **Reports results** with pass/fail counts and pass rate

## Expected Output

```
🧪 Layer 5: Notebook Execution Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Checking notebook server...
✅ Notebook server is running

📂 Testing chapter: ch01
   Script: test/ch01/test_all_ch01.sh

📦 Extracting examples from test script...
   Found 8 examples

🧪 Testing examples in notebook:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📝 Example 1: Basic Hello World
     File: /tmp/ch01-test/ex1.ruchy
     ✅ PASS - Executed successfully
     Output: Hello, World!

  📝 Example 2: Multiple Arguments
     File: /tmp/ch01-test/ex2.ruchy
     ✅ PASS - Executed successfully
     Output: Hello World from Ruchy

  [... 6 more examples ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Notebook Validation Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Examples: 8
Passed: 8
Failed: 0
Pass Rate: 100.0%

✅ SUCCESS: All ch01 examples pass notebook validation!

Layer 5 (Notebook Execution): ✅ COMPLETE
```

## Troubleshooting

### Notebook Server Not Running

```
❌ Notebook server not running!

To start notebook server:
  ruchy notebook --port 8080

Or run in background:
  ruchy notebook --port 8080 &
```

**Solution**: Start the notebook server as shown above.

### Test Script Not Found

```
❌ Test script not found: test/ch02/test_all_ch02.sh
```

**Solution**: Create the chapter test script first using the 7-layer validation template from `test/ch01/test_all_ch01.sh`.

### Example Fails in Notebook

```
  📝 Example 5: String Interpolation
     File: /tmp/ch01-test/ex5.ruchy
     ❌ FAIL - Syntax error: unexpected token
     stderr: Error at line 3: ...
```

**Solution**: This indicates a genuine bug. File a bug report in `docs/bugs/refactoring-bugs.md` with:
- Exact code that failed
- Error message from notebook
- Cross-reference to language spec
- Results from all 15 tools

## Integration with 7-Layer Stack

Notebook testing is **Layer 5** of the validation stack:

1. ✅ **Layer 1**: Syntax validation (`ruchy check`)
2. ✅ **Layer 2**: Compilation (`ruchy compile`)
3. ✅ **Layer 3**: Execution (`ruchy run`)
4. ✅ **Layer 4**: Professional tooling (`make dogfood-full`)
5. ✅ **Layer 5**: Notebook execution (**THIS**)
6. ⏳ **Layer 6**: Language spec cross-reference
7. ⏳ **Layer 7**: Integration test suite

All layers must pass before documentation is considered validated.

## API Reference

The notebook testing script uses these API endpoints:

### Health Check

```bash
GET http://localhost:8080/api/health
```

Returns: `200 OK` if server is running

### Execute Code

```bash
POST http://localhost:8080/api/execute
Content-Type: application/json

{
  "source": "println(\"Hello, World!\")"
}
```

Returns:
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "stdout": "Hello, World!\n",
  "stderr": ""
}
```

## Files

- **Script**: `scripts/test-in-notebook.ts` - Main testing script
- **Makefile**: `Makefile` - Convenience targets (`test-notebook-*`)
- **Test Scripts**: `test/ch*/test_all_ch*.sh` - Source of examples to test
- **Documentation**: `test/NOTEBOOK_TESTING.md` - This file

## Next Steps

After notebook testing passes:

1. ✅ Commit notebook test results to Git
2. ⏳ Cross-reference with language spec (Layer 6)
3. ⏳ Run full integration test suite (Layer 7)
4. ✅ Mark REFACTOR ticket as complete
5. ⏳ Move to next chapter

---

**Toyota Way**: Test in the actual environment (Genchi Genbutsu) - notebook execution proves examples work in interpreted mode, not just compiled.
