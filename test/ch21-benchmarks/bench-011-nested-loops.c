// BENCH-011: Nested Loops (1000x1000 iterations) - C
#include <stdio.h>

long long nested_loops(int outer, int inner) {
    long long total = 0;
    for (int i = 0; i < outer; i++) {
        for (int j = 0; j < inner; j++) {
            total += i * j;
        }
    }
    return total;
}

int main() {
    long long result = nested_loops(1000, 1000);
    // Expected: 249500250000
    return 0;
}
