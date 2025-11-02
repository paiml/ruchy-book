# BENCH-008: Prime generation (first 10K primes) - Julia
function generate_primes(count::Int64)::Vector{Int64}
    primes = Int64[]
    candidate = 2

    while length(primes) < count
        is_prime = true

        # Trial division up to sqrt(candidate)
        for prime in primes
            if prime * prime > candidate
                break
            end
            if candidate % prime == 0
                is_prime = false
                break
            end
        end

        if is_prime
            push!(primes, candidate)
        end
        candidate += 1
    end

    return primes
end

function main()
    count = 10000
    primes = generate_primes(count)
    # Silent for benchmarking
    # Expected: 10000 primes, last one is 104729
end

main()
