# BENCH-011: Nested Loops (1000x1000 iterations) - Julia

function nested_loops(outer, inner)
    total = 0
    for i in 0:outer-1
        for j in 0:inner-1
            total += i * j
        end
    end
    total
end

result = nested_loops(1000, 1000)
# Expected: 249500250000
