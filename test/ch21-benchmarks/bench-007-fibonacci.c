// BENCH-007: Fibonacci recursive (n=20) - C
// Tests: function call overhead, stack management

#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(20);
    // Silent for benchmarking
    return 0;
}
