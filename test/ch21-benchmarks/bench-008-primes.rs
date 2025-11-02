fn is_prime(n: i32) -> i32 {
    if n < 2 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }
    let mut i = 3;
    while i * i <= n {
        {
            if n % i == 0 {
                return false;
            }
            i = i + 2;
        }
    }
    true
}
fn generate_primes(count: &str) -> i32 {
    let mut primes = vec![];
    let mut candidate = 2;
    while primes.len() < count {
        {
            if is_prime(candidate.clone()) {
                primes.push(candidate)
            }
            candidate = candidate + 1;
        }
    }
    primes
}
fn main() {
    let primes = generate_primes(10000);
}
