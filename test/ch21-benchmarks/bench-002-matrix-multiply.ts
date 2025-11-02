#!/usr/bin/env -S deno run --allow-read
// BENCH-002: Matrix Multiplication (100x100) - Deno TypeScript

function matrixMultiply(a: number[][], b: number[][], n: number): number[][] {
    const result: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
}

function createTestMatrix(n: number, seed: number): number[][] {
    // Simple deterministic PRNG (LCG) - using Math.imul for 32-bit int math
    let state = seed;
    const next = () => {
        // Use Math.imul for proper 32-bit integer multiplication
        state = Math.imul(state, 1103515245);
        state = (state + 12345) | 0;  // | 0 converts to 32-bit int
        state = state >>> 0;  // Convert to unsigned 32-bit
        state = state % 2147483648;  // Apply modulo
        return state / 2147483648;
    };

    return Array.from({ length: n }, () =>
        Array.from({ length: n }, () => next())
    );
}

// Generate test matrices (fixed seed for reproducibility)
const N = 100;
const matrixA = createTestMatrix(N, 42);
const matrixB = createTestMatrix(N, 43);

// Execute benchmark
const result = matrixMultiply(matrixA, matrixB, N);

// Output checksum for verification
const checksum = result.reduce((sum, row) =>
    sum + row.reduce((rowSum, val) => rowSum + val, 0), 0
);
console.log(checksum.toFixed(6));
// Expected: 248683.505429
