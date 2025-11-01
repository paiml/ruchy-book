#!/usr/bin/env python3
# BENCH-007: Fibonacci recursive (n=20)
# Python baseline implementation
# Note: Reduced from n=30 to n=20 for practical timing in interpreted modes

def fibonacci(n):
    """Calculate nth Fibonacci number recursively"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    result = fibonacci(20)
    print(f"fib(20) = {result}")
    assert result == 6765, f"Expected 6765, got {result}"

if __name__ == "__main__":
    main()
