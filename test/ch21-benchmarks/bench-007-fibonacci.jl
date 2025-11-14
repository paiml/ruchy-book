# BENCH-007: Fibonacci recursive (n=20) - Julia
function fibonacci(n::Int64)::Int64
    if n <= 1
        return n
    else
        return fibonacci(n - 1) + fibonacci(n - 2)
    end
end

function main()
    result = fibonacci(20)
    # Silent for benchmarking
    # Expected: 6765
end

main()
