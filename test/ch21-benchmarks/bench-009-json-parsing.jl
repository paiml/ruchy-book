# BENCH-009: JSON parsing (50MB file) - Julia
# Parse large JSON and access deeply nested value

using JSON

function parse_and_access(filename::String)::String
    contents = read(filename, String)
    data = JSON.parse(contents)

    # Access deeply nested value
    city = data["users"][501]["profile"]["location"]["city"]  # Julia is 1-indexed
    return city
end

function main()
    filename = length(ARGS) > 0 ? ARGS[1] : "test-data/sample-50mb.json"
    city = parse_and_access(filename)
    # Silent for benchmarking
    # Expected: "London" or other city name
end

main()
