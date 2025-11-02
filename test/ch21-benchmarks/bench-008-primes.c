// BENCH-008: Prime generation (first 10K primes) - C
// Tests: tight loops, integer arithmetic, array operations

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

bool is_prime(int n) {
    if (n < 2) {
        return false;
    }
    if (n == 2) {
        return true;
    }
    if (n % 2 == 0) {
        return false;
    }

    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) {
            return false;
        }
    }

    return true;
}

int* generate_primes(int count, int *out_count) {
    int *primes = (int*)malloc(count * sizeof(int));
    if (!primes) {
        *out_count = 0;
        return NULL;
    }

    int primes_count = 0;
    int candidate = 2;

    while (primes_count < count) {
        if (is_prime(candidate)) {
            primes[primes_count] = candidate;
            primes_count++;
        }
        candidate++;
    }

    *out_count = primes_count;
    return primes;
}

int main() {
    int count = 10000;
    int primes_count;
    int *primes = generate_primes(count, &primes_count);

    // Silent for benchmarking
    free(primes);
    return 0;
}
