// BENCH-002: Matrix Multiplication (100x100) - C
#include <stdio.h>
#include <stdlib.h>

// Simple LCG PRNG for deterministic test data
static unsigned long long lcg_state = 0;

void lcg_seed(unsigned long long seed) {
    lcg_state = seed;
}

double lcg_random() {
    lcg_state = (lcg_state * 1103515245ULL + 12345ULL) % 2147483648ULL;
    return (double)lcg_state / 2147483648.0;
}

double** create_matrix(int n) {
    double** matrix = (double**)malloc(n * sizeof(double*));
    for (int i = 0; i < n; i++) {
        matrix[i] = (double*)malloc(n * sizeof(double));
    }
    return matrix;
}

void free_matrix(double** matrix, int n) {
    for (int i = 0; i < n; i++) {
        free(matrix[i]);
    }
    free(matrix);
}

double** create_test_matrix(int n, unsigned long long seed) {
    lcg_seed(seed);
    double** matrix = create_matrix(n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            matrix[i][j] = lcg_random();
        }
    }
    return matrix;
}

double** matrix_multiply(double** a, double** b, int n) {
    double** result = create_matrix(n);

    // Initialize to zero
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            result[i][j] = 0.0;
        }
    }

    // Naive O(n³) multiplication
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
}

int main() {
    // Generate test matrices (fixed seed for reproducibility)
    int N = 100;
    double** matrix_a = create_test_matrix(N, 42);
    double** matrix_b = create_test_matrix(N, 43);

    // Execute benchmark
    double** result = matrix_multiply(matrix_a, matrix_b, N);

    // Output checksum for verification
    double checksum = 0.0;
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            checksum += result[i][j];
        }
    }
    printf("%.6f\n", checksum);
    // Expected: 248683.505429

    // Cleanup
    free_matrix(matrix_a, N);
    free_matrix(matrix_b, N);
    free_matrix(result, N);

    return 0;
}
