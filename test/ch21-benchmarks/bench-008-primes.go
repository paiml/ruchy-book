// BENCH-008: Prime generation (first 10K primes) - Go
package main

func generatePrimes(count int) []int {
	primes := make([]int, 0, count)
	candidate := 2

	for len(primes) < count {
		isPrime := true

		// Trial division up to sqrt(candidate)
		for _, prime := range primes {
			if prime*prime > candidate {
				break
			}
			if candidate%prime == 0 {
				isPrime = false
				break
			}
		}

		if isPrime {
			primes = append(primes, candidate)
		}
		candidate++
	}

	return primes
}

func main() {
	count := 10000
	primes := generatePrimes(count)
	_ = primes
	// Silent for benchmarking
	// Expected: 10000 primes, last one is 104729
}
