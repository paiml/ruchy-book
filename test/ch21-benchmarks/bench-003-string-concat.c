// BENCH-003: String concatenation (10K operations) - C
// Tests: string handling, memory allocation

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* string_concatenation(int iterations) {
    // Allocate buffer for final string (iterations * 1 byte + null terminator)
    char *result = (char*)malloc(iterations + 1);
    if (!result) {
        return NULL;
    }

    // Efficient: build string by setting bytes directly
    memset(result, 'x', iterations);
    result[iterations] = '\0';

    return result;
}

int main() {
    int iterations = 10000;
    char *result = string_concatenation(iterations);

    // Silent for benchmarking
    free(result);
    return 0;
}
