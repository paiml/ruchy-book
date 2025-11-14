static lcg_state: std::sync::LazyLock<std::sync::Mutex<i32>> = std::sync::LazyLock::new(||
std::sync::Mutex::new(0));
static checksum: std::sync::LazyLock<std::sync::Mutex<f64>> = std::sync::LazyLock::new(||
std::sync::Mutex::new(0f64));
static i: std::sync::LazyLock<std::sync::Mutex<i32>> = std::sync::LazyLock::new(|| std::sync::Mutex::new(
    0,
));
fn lcg_seed(seed: &str) {
    *lcg_state.lock().unwrap() = seed;
}
fn lcg_random() -> i32 {
    {
        let mut __guard = lcg_state.lock().unwrap();
        *__guard = ((*__guard * 1103515245) + 12345) % 2147483648i64;
    };
    *lcg_state.lock().unwrap() / 2147483648f64
}
fn create_test_matrix(n: i32, seed: &str) -> i32 {
    lcg_seed(seed);
    {
        let matrix: Vec<_> = vec![];
        {
            let mut i = 0;
            while *i.lock().unwrap() < n {
                {
                    {
                        let row: Vec<_> = vec![];
                        {
                            let mut j = 0;
                            while j < n {
                                {
                                    row.push(lcg_random());
                                    j = j + 1;
                                }
                            }
                            matrix.push(row);
                            {
                                let mut __guard = i.lock().unwrap();
                                *__guard = *__guard + 1;
                            }
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
        let result = {
            {
                let matrix: Vec<_> = vec![];
                {
                    let mut i = 0;
                    while *i.lock().unwrap() < n {
                        {
                            {
                                let row: Vec<_> = vec![];
                                {
                                    let mut j = 0;
                                    while j < n {
                                        {
                                            row.push(0f64);
                                            j = j + 1;
                                        }
                                    }
                                    matrix.push(row);
                                    {
                                        let mut __guard = i.lock().unwrap();
                                        *__guard = *__guard + 1;
                                    }
                                }
                            }
                        }
                    }
                    matrix
                }
            }
        };
        {
            let mut i = 0;
            while *i.lock().unwrap() < n {
                {
                    let mut j = 0;
                    while j < n {
                        {
                            let mut k = 0;
                            while k < n {
                                {
                                    result[*i.lock().unwrap() as usize][j as usize] = result[*i
                                            .lock()
                                            .unwrap() as usize]
                                        .clone()[j as usize]
                                        .clone()
                                        + a[*i.lock().unwrap() as usize].clone()[k as usize].clone()
                                            * b[k as usize].clone()[j as usize].clone();
                                    k = k + 1;
                                }
                            }
                            j = j + 1;
                        }
                    }
                    {
                        let mut __guard = i.lock().unwrap();
                        *__guard = *__guard + 1;
                    }
                }
            }
            result
        }
    }
}
fn main() {
    let n = 100;
    let matrix_a = create_test_matrix(100, 42);
    let matrix_b = create_test_matrix(100, 43);
    let result = matrix_multiply(matrix_a, matrix_b, 100);
    while *i.lock().unwrap() < n {
        {
            let mut j = 0;
            while j < n {
                {
                    {
                        let mut __guard = checksum.lock().unwrap();
                        *__guard = *__guard
                            + result[*i.lock().unwrap() as usize]
                                .clone()[j as usize]
                                .clone();
                    };
                    j = j + 1;
                }
            }
            {
                let mut __guard = i.lock().unwrap();
                *__guard = *__guard + 1;
            }
        }
    }
    println!("{:?}", * checksum.lock().unwrap());
}
