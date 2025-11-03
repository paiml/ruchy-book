// BENCH-002: Matrix Multiplication (100x100) - Rust
// Task: Multiply two 100x100 matrices using naive algorithm
// Measures: Nested loop performance, array access patterns, arithmetic ops

// Simple LCG PRNG for deterministic test data
struct Lcg {
    state: u64,
}

impl Lcg {
    fn new(seed: u64) -> Self {
        Lcg { state: seed }
    }

    fn next(&mut self) -> f64 {
        // LCG parameters (same as C/Python/Ruchy)
        self.state = (self.state * 1103515245 + 12345) % 2147483648;
        (self.state as f64) / 2147483648.0
    }
}

fn create_test_matrix(n: usize, seed: u64) -> Vec<Vec<f64>> {
    let mut lcg = Lcg::new(seed);
    let mut matrix = Vec::with_capacity(n);

    for _ in 0..n {
        let mut row = Vec::with_capacity(n);
        for _ in 0..n {
            row.push(lcg.next());
        }
        matrix.push(row);
    }

    matrix
}

fn matrix_multiply(a: &Vec<Vec<f64>>, b: &Vec<Vec<f64>>, n: usize) -> Vec<Vec<f64>> {
    let mut result = vec![vec![0.0; n]; n];

    for i in 0..n {
        for j in 0..n {
            for k in 0..n {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    result
}

fn main() {
    const N: usize = 100;

    // Generate test matrices (fixed seed for reproducibility)
    let matrix_a = create_test_matrix(N, 42);
    let matrix_b = create_test_matrix(N, 43);

    // Execute benchmark
    let result = matrix_multiply(&matrix_a, &matrix_b, N);

    // Output checksum for verification (sum of all elements)
    let checksum: f64 = result.iter()
        .flat_map(|row| row.iter())
        .sum();

    println!("{:.6}", checksum);
    // Expected: 248683.505429 (deterministic with LCG)
}
