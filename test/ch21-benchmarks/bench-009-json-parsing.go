// BENCH-009: JSON parsing (50MB file) - Go
// Parse large JSON and access deeply nested value
package main

import (
	"encoding/json"
	"io"
	"os"
)

type Location struct {
	City        string `json:"city"`
	Country     string `json:"country"`
	Coordinates struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"coordinates"`
}

type Profile struct {
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Age       int      `json:"age"`
	Location  Location `json:"location"`
}

type User struct {
	ID       int     `json:"id"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Profile  Profile `json:"profile"`
}

type Data struct {
	Metadata struct {
		Version    string `json:"version"`
		TotalUsers int    `json:"total_users"`
	} `json:"metadata"`
	Users []User `json:"users"`
}

func parseAndAccess(filename string) (string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	var data Data
	if err := json.Unmarshal(bytes, &data); err != nil {
		return "", err
	}

	// Access deeply nested value
	city := data.Users[500].Profile.Location.City
	return city, nil
}

func main() {
	filename := "test-data/sample-50mb.json"
	if len(os.Args) > 1 {
		filename = os.Args[1]
	}

	city, err := parseAndAccess(filename)
	if err != nil {
		panic(err)
	}

	_ = city
	// Silent for benchmarking
	// Expected: "London" or other city name
}
