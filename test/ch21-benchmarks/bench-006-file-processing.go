// BENCH-006: File line processing (100MB log file) - Go
// Count lines containing "error" (case-insensitive)
package main

import (
	"bufio"
	"os"
	"strings"
)

func countErrorLines(filename string) (int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	count := 0
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()
		if strings.Contains(strings.ToLower(line), "error") {
			count++
		}
	}

	if err := scanner.Err(); err != nil {
		return 0, err
	}

	return count, nil
}

func main() {
	filename := "test-data/sample-100mb.log"
	if len(os.Args) > 1 {
		filename = os.Args[1]
	}

	count, err := countErrorLines(filename)
	if err != nil {
		panic(err)
	}

	_ = count
	// Silent for benchmarking
	// Expected: ~10% of lines contain ERROR
}
