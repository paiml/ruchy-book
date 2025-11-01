#!/usr/bin/env python3
# BENCH-008: Prime number generation (first 10K primes)
# Python baseline implementation
# Expected: 10,000th prime is 104,729

def is_prime(n):
    """Check if n is prime using trial division"""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    # Check odd divisors up to sqrt(n)
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def generate_primes(count):
    """Generate first 'count' prime numbers"""
    primes = []
    candidate = 2

    while len(primes) < count:
        if is_prime(candidate):
            primes.append(candidate)
        candidate += 1

    return primes

def main():
    primes = generate_primes(10000)
    print(f"Generated {len(primes)} primes")
    print(f"10,000th prime: {primes[-1]}")

    # Verify correctness
    assert len(primes) == 10000, f"Expected 10000 primes, got {len(primes)}"
    assert primes[-1] == 104729, f"Expected 10,000th prime to be 104729, got {primes[-1]}"
    print("✓ Verification passed")

if __name__ == "__main__":
    main()
