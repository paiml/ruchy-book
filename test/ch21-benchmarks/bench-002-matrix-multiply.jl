#!/usr/bin/env julia
# BENCH-002: Matrix Multiplication (100x100) - Julia

# Simple LCG PRNG for deterministic test data
mutable struct LCG
    state::UInt64
end

function lcg_next(rng::LCG)
    rng.state = (rng.state * 1103515245 + 12345) % 2147483648
    return rng.state / 2147483648.0
end

function matrix_multiply(a, b, n)
    result = zeros(Float64, n, n)

    for i in 1:n
        for j in 1:n
            for k in 1:n
                result[i, j] += a[i, k] * b[k, j]
            end
        end
    end

    return result
end

function create_test_matrix(n, seed)
    rng = LCG(seed)
    matrix = zeros(Float64, n, n)
    for i in 1:n
        for j in 1:n
            matrix[i, j] = lcg_next(rng)
        end
    end
    return matrix
end

# Generate test matrices (fixed seed for reproducibility)
N = 100
matrix_a = create_test_matrix(N, 42)
matrix_b = create_test_matrix(N, 43)

# Execute benchmark
result = matrix_multiply(matrix_a, matrix_b, N)

# Output checksum for verification
checksum = sum(result)
println(@sprintf("%.6f", checksum))
# Expected: 248683.505429
