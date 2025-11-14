// BENCH-008: Prime generation (first 10K primes) - Deno TypeScript
function generatePrimes(count: number): number[] {
    const primes: number[] = [];
    let candidate = 2;

    while (primes.length < count) {
        let isPrime = true;

        // Trial division up to sqrt(candidate)
        for (const prime of primes) {
            if (prime * prime > candidate) break;
            if (candidate % prime === 0) {
                isPrime = false;
                break;
            }
        }

        if (isPrime) {
            primes.push(candidate);
        }
        candidate++;
    }

    return primes;
}

function main(): void {
    const count = 10000;
    const primes = generatePrimes(count);
    // Silent for benchmarking
    // Expected: 10000 primes, last one is 104729
}

main();
