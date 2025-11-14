// BENCH-003: String concatenation (10K operations) - Go
package main

import "strings"

func stringConcatenation(iterations int) string {
	// Idiomatic: strings.Builder (efficient, O(n))
	var builder strings.Builder
	for i := 0; i < iterations; i++ {
		builder.WriteString("x")
	}
	return builder.String()
}

func main() {
	iterations := 10000
	result := stringConcatenation(iterations)
	_ = result
	// Silent for benchmarking
	// Expected: 10000 characters
}
