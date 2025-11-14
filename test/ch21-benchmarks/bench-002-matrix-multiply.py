#!/usr/bin/env python3
# BENCH-002: Matrix Multiplication (100x100)
# Task: Multiply two 100x100 matrices using naive algorithm
# Measures: Nested loop performance, array access patterns, arithmetic ops

# Simple LCG PRNG for deterministic test data (matches C implementation)
lcg_state = 0

def lcg_seed(seed):
    global lcg_state
    lcg_state = seed

def lcg_random():
    global lcg_state
    lcg_state = (lcg_state * 1103515245 + 12345) % 2147483648
    return lcg_state / 2147483648.0

def matrix_multiply(a, b, n):
    """Naive O(n³) matrix multiplication"""
    result = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for j in range(n):
            for k in range(n):
                result[i][j] += a[i][k] * b[k][j]

    return result

def create_test_matrix(n, seed):
    """Create NxN matrix with deterministic random values"""
    lcg_seed(seed)
    return [[lcg_random() for _ in range(n)] for _ in range(n)]

# Generate test matrices (fixed seed for reproducibility - Toyota Way: Jidoka)
N = 100
matrix_a = create_test_matrix(N, seed=42)
matrix_b = create_test_matrix(N, seed=43)

# Execute benchmark
result = matrix_multiply(matrix_a, matrix_b, N)

# Output checksum for verification (sum of all elements)
checksum = sum(sum(row) for row in result)
print(f"{checksum:.6f}")
# Expected: 248683.505429 (deterministic with LCG)
