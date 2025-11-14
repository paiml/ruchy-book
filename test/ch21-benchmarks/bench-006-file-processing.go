// BENCH-006: File Line Processing - Go
package main

import (
	"bufio"
	"fmt"
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
		if strings.Contains(strings.ToLower(scanner.Text()), "error") {
			count++
		}
	}

	if err := scanner.Err(); err != nil {
		return 0, err
	}

	return count, nil
}

func main() {
	result, err := countErrorLines("testdata/bench-006-logs-100mb.txt")
	if err != nil {
		panic(err)
	}
	fmt.Println(result)
	// Expected: 126076
}
