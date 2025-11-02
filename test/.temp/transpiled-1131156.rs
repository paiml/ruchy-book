fn lcg_seed(seed: &str) {
    lcg_state = seed;
}
fn lcg_random() -> i32 {
    lcg_state = (lcg_state * 1103515245 + 12345) % 2147483648i64;
    lcg_state / 2147483648f64
}
fn create_matrix(n: i32) -> i32 {
    {
        let matrix = vec![];
        {
            let mut i = 0;
            while i < n {
                {
                    {
                        let row = vec![];
                        {
                            let mut j = 0;
                            while j < n {
                                {
                                    row.push(0f64);
                                    j = j + 1;
                                }
                            }
                            matrix.push(row);
                            i = i + 1;
                        }
                    }
                }
            }
            matrix
        }
    }
}
fn create_test_matrix(n: i32, seed: &str) -> i32 {
    lcg_seed(seed);
    {
        let matrix = vec![];
        {
            let mut i = 0;
            while i < n {
                {
                    {
                        let row = vec![];
                        {
                            let mut j = 0;
                            while j < n {
                                {
                                    row.push(lcg_random());
                                    j = j + 1;
                                }
                            }
                            matrix.push(row);
                            i = i + 1;
                        }
                    }
                }
            }
            matrix
        }
    }
}
fn matrix_multiply(a: &str, b: &str, n: i32) -> i32 {
    {
        let result = create_matrix(n);
        {
            let mut i = 0;
            while i < n {
                {
                    let mut j = 0;
                    while j < n {
                        {
                            let mut k = 0;
                            while k < n {
                                {
                                    result[i as usize][j as usize] = result[i as usize]
                                        .clone()[j as usize]
                                        .clone()
                                        + a[i as usize].clone()[k as usize].clone()
                                            * b[k as usize].clone()[j as usize].clone();
                                    k = k + 1;
                                }
                            }
                            j = j + 1;
                        }
                    }
                    i = i + 1;
                }
            }
            result
        }
    }
}
fn main() {
    let mut lcg_state = 0;
    let n = 100;
    let matrix_a = create_test_matrix(n, 42);
    let matrix_b = create_test_matrix(n, 43);
    let result = matrix_multiply(matrix_a, matrix_b, n);
    let mut checksum = 0f64;
    let mut i = 0;
    while i < n {
        {
            let mut j = 0;
            while j < n {
                {
                    checksum = checksum + result[i as usize].clone()[j as usize].clone();
                    j = j + 1;
                }
            }
            i = i + 1;
        }
    }
    println!("{:?}", checksum);
}
