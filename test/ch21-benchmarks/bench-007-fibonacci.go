// BENCH-007: Fibonacci recursive (n=20) - Go
package main

func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
	result := fibonacci(20)
	_ = result
	// Silent for benchmarking
	// Expected: 6765
}
