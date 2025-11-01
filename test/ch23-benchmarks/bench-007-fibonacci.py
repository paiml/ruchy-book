#!/usr/bin/env python3
# BENCH-007: Fibonacci recursive (n=30)
# Python baseline implementation

def fibonacci(n):
    """Calculate nth Fibonacci number recursively"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    result = fibonacci(30)
    print(f"fib(30) = {result}")
    assert result == 832040, f"Expected 832040, got {result}"

if __name__ == "__main__":
    main()
