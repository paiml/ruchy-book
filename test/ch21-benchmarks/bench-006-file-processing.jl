#!/usr/bin/env julia
# BENCH-006: File Line Processing - Julia

function count_error_lines(filename)
    count = 0
    for line in eachline(filename)
        if occursin("error", lowercase(line))
            count += 1
        end
    end
    return count
end

result = count_error_lines("testdata/bench-006-logs-100mb.txt")
println(result)
# Expected: 126076
