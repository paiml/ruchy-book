# Experiment Template

Copy this template when creating new experiments.

```ruchy
#!/usr/bin/env ruchy
// Experiment: {NUMBER}_{FEATURE}
// Version: ruchy {VERSION}
// Date: {ISO_DATE}
// Author: Ruchy Book Test Suite
// Status: FAILING/PASSING/PARTIAL

// PURPOSE:
// Test {specific feature} functionality in Ruchy {version}

// HYPOTHESIS:
// {What we expect to work}

// METHOD:
fun run_experiment() {
    println("🧪 Experiment {NUMBER}: {FEATURE}")
    println("=" * 50)

    // Test Case 1: {Description}
    println("\nTest 1: {What we're testing}")
    // {test code}

    // Expected: {expected output}
    // Actual: {actual output or error}
}

fun main() {
    println("Ruchy Scientific Experiment Report")
    println("Version: " + get_version())  // If available
    println("Timestamp: " + get_timestamp())  // If available

    run_experiment()

    // RESULTS SUMMARY:
    println("\n📊 Results Summary:")
    println("✗ Test 1: FAILED - {reason}")
    println("✓ Test 2: PASSED")

    // CONCLUSION:
    println("\n📝 Conclusion:")
    println("{Feature} is not fully implemented in Ruchy {version}")
    println("Impact: {How this affects users}")

    // RECOMMENDATION:
    println("\n💡 Recommendation:")
    println("{What needs to be fixed}")
}

main()
```

## Experiment Metadata

- **Filed**: {Date}
- **Priority**: Critical/High/Medium/Low
- **Category**: {testing/dataframes/error_handling/etc}
- **GitHub Issue**: #{issue_number} (if filed)

## Reproduction Steps

1. Save this file as `experiment_{NUMBER}_{FEATURE}.ruchy`
2. Run: `ruchy experiment_{NUMBER}_{FEATURE}.ruchy`
3. Observe the error/output

## Expected vs Actual

### Expected Output:
```
{what should happen}
```

### Actual Output:
```
{what actually happens}
```

## Impact Assessment

- **Users Affected**: {who this impacts}
- **Workaround Available**: Yes/No
- **Workaround**: {if available}

## Related Experiments

- experiment_{NUMBER}_{FEATURE}.ruchy
- experiment_{NUMBER}_{FEATURE}.ruchy