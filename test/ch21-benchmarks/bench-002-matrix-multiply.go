// BENCH-002: Matrix Multiplication (100x100) - Go
package main

import "fmt"

// Simple LCG PRNG for deterministic test data
var lcgState uint64

func lcgSeed(seed uint64) {
	lcgState = seed
}

func lcgRandom() float64 {
	lcgState = (lcgState*1103515245 + 12345) % 2147483648
	return float64(lcgState) / 2147483648.0
}

func matrixMultiply(a, b [][]float64, n int) [][]float64 {
	result := make([][]float64, n)
	for i := range result {
		result[i] = make([]float64, n)
	}

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			for k := 0; k < n; k++ {
				result[i][j] += a[i][k] * b[k][j]
			}
		}
	}

	return result
}

func createTestMatrix(n int, seed uint64) [][]float64 {
	lcgSeed(seed)
	matrix := make([][]float64, n)
	for i := range matrix {
		matrix[i] = make([]float64, n)
		for j := range matrix[i] {
			matrix[i][j] = lcgRandom()
		}
	}
	return matrix
}

func main() {
	// Generate test matrices (fixed seed for reproducibility)
	N := 100
	matrixA := createTestMatrix(N, 42)
	matrixB := createTestMatrix(N, 43)

	// Execute benchmark
	result := matrixMultiply(matrixA, matrixB, N)

	// Output checksum for verification
	checksum := 0.0
	for i := range result {
		for j := range result[i] {
			checksum += result[i][j]
		}
	}
	fmt.Printf("%.6f\n", checksum)
	// Expected: 248683.505429
}
