// BENCH-011: Nested Loops (1000x1000 iterations) - Go
package main

func nestedLoops(outer, inner int) int {
	total := 0
	for i := 0; i < outer; i++ {
		for j := 0; j < inner; j++ {
			total += i * j
		}
	}
	return total
}

func main() {
	result := nestedLoops(1000, 1000)
	_ = result // Expected: 249500250000
}
