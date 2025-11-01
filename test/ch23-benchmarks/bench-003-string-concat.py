#!/usr/bin/env python3
# BENCH-003: String concatenation (1M operations)
# Python baseline implementation
# Note: Started with 10K ops, will scale based on performance

def string_concatenation(iterations):
    """Concatenate strings in a loop"""
    result = ""
    for i in range(iterations):
        result += "x"
    return result

def main():
    iterations = 10000  # Start with 10K, scale to 1M if fast enough
    result = string_concatenation(iterations)

    print(f"Concatenated {len(result)} characters")

    # Verify correctness
    assert len(result) == iterations, f"Expected {iterations} chars, got {len(result)}"
    print("✓ Verification passed")

if __name__ == "__main__":
    main()
