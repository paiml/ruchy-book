# BENCH-006: File line processing (100MB log file) - Julia
# Count lines containing "error" (case-insensitive)

function count_error_lines(filename::String)::Int64
    count = 0
    open(filename, "r") do file
        for line in eachline(file)
            if occursin("error", lowercase(line))
                count += 1
            end
        end
    end
    return count
end

function main()
    filename = length(ARGS) > 0 ? ARGS[1] : "test-data/sample-100mb.log"
    count = count_error_lines(filename)
    # Silent for benchmarking
    # Expected: ~10% of lines contain ERROR
end

main()
