// BENCH-005: Array Sum (1 million integers) - Go
package main

func arraySum(n int) int {
	sum := 0
	for i := 0; i < n; i++ {
		sum += i
	}
	return sum
}

func main() {
	result := arraySum(1000000)
	_ = result // Expected: 499999500000
}
