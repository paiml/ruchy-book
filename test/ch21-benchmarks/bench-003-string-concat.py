#!/usr/bin/env python3
# BENCH-003: String concatenation (10K operations)
# Python baseline implementation - IDIOMATIC VERSION

def string_concatenation_naive(iterations):
    """
    Naive O(n²) implementation - DO NOT USE IN PRODUCTION

    This approach is included for educational comparison only.
    String concatenation with += has quadratic complexity in Python
    because strings are immutable and must be reallocated on each append.
    """
    result = ""
    for i in range(iterations):
        result += "x"  # ❌ O(n²) - reallocates entire string each iteration
    return result

def string_concatenation(iterations):
    """
    Idiomatic O(n) implementation - PRODUCTION VERSION

    This is the standard, efficient way to build strings in Python.
    Uses list comprehension + join() for linear time complexity.
    """
    # Most common idiom: list comprehension + join
    result = "".join(['x' for _ in range(iterations)])
    return result

# Alternative idiomatic implementations (all O(n)):
# result = "".join('x' * iterations)  # Even faster (single allocation)
# result = 'x' * iterations           # Fastest (built-in string repeat)

def main():
    iterations = 10000

    # Benchmark the IDIOMATIC version (not naive)
    result = string_concatenation(iterations)

    print(f"Concatenated {len(result)} characters")

    # Verify correctness
    assert len(result) == iterations, f"Expected {iterations} chars, got {len(result)}"
    print("✓ Verification passed")

if __name__ == "__main__":
    main()
