// BENCH-005: Array Sum (1 million integers) - C
#include <stdio.h>

long long array_sum(int n) {
    long long sum = 0;
    for (int i = 0; i < n; i++) {
        sum += i;
    }
    return sum;
}

int main() {
    long long result = array_sum(1000000);
    // Expected: 499999500000
    return 0;
}
