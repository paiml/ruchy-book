// BENCH-002: Matrix Multiplication (100x100) - Rust

// Simple LCG PRNG for deterministic test data
struct LCG {
    state: u64,
}

impl LCG {
    fn new(seed: u64) -> Self {
        LCG { state: seed }
    }

    fn next(&mut self) -> f64 {
        self.state = (self.state.wrapping_mul(1103515245).wrapping_add(12345)) % 2147483648;
        self.state as f64 / 2147483648.0
    }
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

fn create_test_matrix(n: usize, seed: u64) -> Vec<Vec<f64>> {
    let mut rng = LCG::new(seed);
    (0..n)
        .map(|_| (0..n).map(|_| rng.next()).collect())
        .collect()
}

fn main() {
    // Generate test matrices (fixed seed for reproducibility)
    let n = 100;
    let matrix_a = create_test_matrix(n, 42);
    let matrix_b = create_test_matrix(n, 43);

    // Execute benchmark
    let result = matrix_multiply(&matrix_a, &matrix_b, n);

    // Output checksum for verification
    let checksum: f64 = result.iter()
        .flat_map(|row| row.iter())
        .sum();
    println!("{:.6}", checksum);
    // Expected: 248683.505429
}
