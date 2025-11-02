# BENCH-005: Array Sum (1 million integers) - Julia

function array_sum(n)
    sum = 0
    for i in 0:n-1
        sum += i
    end
    sum
end

result = array_sum(1000000)
# Expected: 499999500000
