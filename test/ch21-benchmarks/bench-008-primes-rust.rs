// BENCH-008: Prime generation (first 10K primes) - Rust
fn generate_primes(count: usize) -> Vec<i32> {
    let mut primes = Vec::with_capacity(count);
    let mut candidate = 2;

    while primes.len() < count {
        let mut is_prime = true;

        // Trial division up to sqrt(candidate)
        for &prime in &primes {
            if prime * prime > candidate {
                break;
            }
            if candidate % prime == 0 {
                is_prime = false;
                break;
            }
        }

        if is_prime {
            primes.push(candidate);
        }
        candidate += 1;
    }

    primes
}

fn main() {
    let count = 10000;
    let primes = generate_primes(count);
    let _ = primes;
    // Silent for benchmarking
    // Expected: 10000 primes, last one is 104729
}
