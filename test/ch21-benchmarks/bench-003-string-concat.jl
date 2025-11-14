# BENCH-003: String concatenation (10K operations) - Julia
function string_concatenation(iterations::Int64)::String
    # Idiomatic: repeat function (most efficient)
    return repeat("x", iterations)
end

function main()
    iterations = 10000
    result = string_concatenation(iterations)
    # Silent for benchmarking
    # Expected: 10000 characters
end

main()
