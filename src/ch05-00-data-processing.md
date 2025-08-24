# Data Processing  

<!-- DOC_STATUS_START -->
**Chapter Status**: 🚧 NOT IMPLEMENTED - Future Feature

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | No support yet |
| ⚠️ Not Implemented | All | Entire feature planned |
| ❌ Broken | 0 | N/A |
| 📋 Planned | All | Target: v2.5+ |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.9.2*
<!-- DOC_STATUS_END -->

## ⚠️ IMPORTANT: Feature Not Yet Implemented

**Data processing and pipelines is a planned feature for Ruchy v2.5+**. This chapter describes the intended design but **none of these examples currently work**.

## What You Can Do Today

Instead of waiting for this feature, you can:
- Use the working features documented in TDD chapters
- Contribute to the implementation at [github.com/paiml/ruchy](https://github.com/paiml/ruchy)
- See the [roadmap](../appendix-roadmap.md) for timeline

## Original Content (For Reference Only)

⚠️ The content below is aspirational and does not work in current Ruchy:

---



*"The day I realized I could automate data analysis was the day I stopped being afraid of Excel files. I had 10,000 rows of customer data to analyze manually. Instead, I wrote a 20-line script that did it in 3 seconds. That script saved me 40 hours of work and taught me the real power of programming."* - Noah Gift

## The Problem

You've built command-line tools, but real-world work involves data - CSV files, JSON APIs, log files, and datasets. How do you read, process, analyze, and transform data efficiently?

Most people use spreadsheet software for data tasks, but that doesn't scale to large datasets or repeatable processes. In Ruchy, data processing should be as straightforward as working with the data manually, but infinitely more powerful.

## Quick Example

Here's a simple but powerful data processor in Ruchy:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// File: sales_analyzer.ruchy
// Analyzes sales data from CSV file

println("=== Sales Data Analyzer ===")

// Read CSV data (simplified - in practice you'd use CSV parser)
let sales_data = [
    ["Date", "Product", "Amount", "Region"],
    ["2024-01-15", "Laptop", "1299", "North"],
    ["2024-01-16", "Mouse", "25", "South"], 
    ["2024-01-17", "Keyboard", "79", "North"],
    ["2024-01-18", "Laptop", "1299", "East"],
    ["2024-01-19", "Monitor", "399", "West"]
]

// Process data
let total_sales = 0
let product_counts = {}
let region_sales = {}

for row in sales_data[1..] {  // Skip header
    let product = row[1]
    let amount = row[2].to_f()
    let region = row[3]
    
    // Calculate totals
    total_sales += amount
    
    // Count products
    product_counts[product] = product_counts.get(product, 0) + 1
    
    // Sum by region
    region_sales[region] = region_sales.get(region, 0) + amount
}

// Display results
println("Total Sales: $" + total_sales.to_s())
println("Average Sale: $" + (total_sales / (sales_data.len() - 1)).to_s())

println("\nTop Products:")
for product, count in product_counts.items() {
    println("  " + product + ": " + count.to_s() + " sales")
}

println("\nSales by Region:")
for region, amount in region_sales.items() {
    println("  " + region + ": $" + amount.to_s())
}






```

Output:
```
=== Sales Data Analyzer ===
Total Sales: $3101
Average Sale: $620.20

Top Products:
  Laptop: 2 sales
  Mouse: 1 sales
  Keyboard: 1 sales
  Monitor: 1 sales

Sales by Region:
  North: $1378
  South: $25
  East: $1299
  West: $399
```

That's real data analysis! Scales to thousands of rows easily.

## Core Concepts

### Data Structures for Analysis

Use appropriate structures for different data types:
```ruchy
// Status: ❌ BROKEN

// Arrays for sequences
let sales_amounts = [1299, 25, 79, 1299, 399]
let monthly_revenue = [45000, 52000, 48000, 61000]

// Dictionaries for key-value mapping  
let customer_orders = {
    "alice@email.com": 5,
    "bob@email.com": 2,
    "carol@email.com": 8
}

// Arrays of dictionaries for structured records
let transactions = [
    {"id": 1001, "amount": 1299, "customer": "alice@email.com"},
    {"id": 1002, "amount": 25, "customer": "bob@email.com"},
    {"id": 1003, "amount": 79, "customer": "alice@email.com"}
]







```

### Data Aggregation

Common patterns for summarizing data:
```ruchy
// Status: ⚠️ NOT IMPLEMENTED

// Sum and averages
let total = numbers.sum()
let average = numbers.sum() / numbers.len()
let maximum = numbers.max()
let minimum = numbers.min()

// Grouping and counting
fun group_by_field(records, field) {
    let groups = {}
    for record in records {
        let key = record[field]
        if !groups.has_key(key) {
            groups[key] = []
        }
        groups[key].push(record)
    }
    return groups
}

// Filtering and transformation
let high_value = transactions.filter(|t| t.amount > 100)
let customer_ids = transactions.map(|t| t.customer)
let amounts_only = transactions.map(|t| t.amount)






// Error: ✗ Compilation failed: Compilation failed:

```

### File Format Processing

Handle common data formats:
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// CSV-like processing (simplified)
fun parse_csv_line(line) {
    return line.split(",").map(|field| field.trim())
}

fun load_csv(filename) {
    let lines = read_lines(filename)
    let header = parse_csv_line(lines[0])
    let data = []
    
    for line in lines[1..] {
        let fields = parse_csv_line(line)
        let record = {}
        for i, field in fields.enumerate() {
            record[header[i]] = field
        }
        data.push(record)
    }
    
    return data
}






```

## Practical Data Tools

### Customer Analytics Tool

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// File: customer_analytics.ruchy
// Analyzes customer purchase patterns

println("=== Customer Analytics Tool ===")

// Sample customer data (in practice, load from file)
let customers = [
    {"name": "Alice", "email": "alice@email.com", "orders": 5, "total_spent": 2500, "signup_date": "2023-06-15"},
    {"name": "Bob", "email": "bob@email.com", "orders": 2, "total_spent": 150, "signup_date": "2024-01-20"},
    {"name": "Carol", "email": "carol@email.com", "orders": 8, "total_spent": 4200, "signup_date": "2023-03-10"},
    {"name": "David", "email": "david@email.com", "orders": 1, "total_spent": 75, "signup_date": "2024-02-01"}
]

// Calculate key metrics
let total_customers = customers.len()
let total_revenue = customers.map(|c| c.total_spent).sum()
let average_order_value = total_revenue / customers.map(|c| c.orders).sum()
let average_customer_value = total_revenue / total_customers

println("Customer Base: " + total_customers.to_s() + " customers")
println("Total Revenue: $" + total_revenue.to_s())
println("Average Order Value: $" + average_order_value.to_s())
println("Average Customer Value: $" + average_customer_value.to_s())

// Segment customers
let vip_customers = customers.filter(|c| c.total_spent > 1000)
let new_customers = customers.filter(|c| c.signup_date.starts_with("2024"))
let frequent_buyers = customers.filter(|c| c.orders > 5)

println(f"\nCustomer Segments:")
println("VIP Customers (>$1000): " + vip_customers.len().to_s())
println("New Customers (2024): " + new_customers.len().to_s())
println("Frequent Buyers (>5 orders): " + frequent_buyers.len().to_s())

// Top customers by spending
let top_spenders = customers.sort_by(|c| -c.total_spent)[..3]
println(f"\nTop Spenders:")
for i, customer in top_spenders.enumerate() {
    println("  " + (i+1).to_s() + ". " + customer.name + ": $" + customer.total_spent.to_s() + " (" + customer.orders.to_s() + " orders)")
}






```

### Log File Analyzer

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// File: advanced_log_analyzer.ruchy
// Comprehensive log file analysis

println("=== Advanced Log Analyzer ===")

// Sample log entries (in practice, read from file)
let log_entries = [
    "2024-08-19 10:15:32 INFO User login: alice@email.com",
    "2024-08-19 10:16:45 ERROR Database connection failed", 
    "2024-08-19 10:17:12 INFO User login: bob@email.com",
    "2024-08-19 10:18:33 WARN Slow query detected: 2.5s",
    "2024-08-19 10:19:44 ERROR 404 Not Found: /api/users/999",
    "2024-08-19 10:20:15 INFO User logout: alice@email.com"
]

// Parse log entries
fun parse_log_entry(entry) {
    let parts = entry.split(" ")
    return {
        "date": parts[0],
        "time": parts[1], 
        "level": parts[2],
        "message": parts[3..].join(" ")
    }
}

let parsed_logs = log_entries.map(parse_log_entry)

// Analyze by level
let level_counts = {}
for log in parsed_logs {
    let level = log.level
    level_counts[level] = level_counts.get(level, 0) + 1
}

println("Log Level Summary:")
for level, count in level_counts.items() {
    let emoji = match level {
        "INFO" => "ℹ️",
        "WARN" => "⚠️", 
        "ERROR" => "❌",
        _ => "📝"
    }
    println("  " + emoji + " " + level + ": " + count.to_s() + " entries")
}

// Find errors and warnings
let issues = parsed_logs.filter(|log| log.level == "ERROR" || log.level == "WARN")
println("\nIssues Found (" + issues.len().to_s() + "):")
for issue in issues {
    println("  " + issue.time + " " + issue.level + ": " + issue.message)
}

// Extract user activity
let user_actions = parsed_logs.filter(|log| log.message.contains("User"))
println("\nUser Activity (" + user_actions.len().to_s() + " actions):")
for action in user_actions {
    println("  " + action.time + ": " + action.message)
}

// Time-based analysis
let hours = parsed_logs.map(|log| log.time.split(":")[0])
let hour_counts = {}
for hour in hours {
    hour_counts[hour] = hour_counts.get(hour, 0) + 1
}

let busiest_hour = hour_counts.max_by_value()
println("\nBusiest Hour: " + busiest_hour.key + ":xx (" + busiest_hour.value.to_s() + " entries)")






```

### Financial Data Processor

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// File: finance_processor.ruchy
// Processes financial transactions and generates reports

println("=== Financial Data Processor ===")

// Transaction data structure
let transactions = [
    {"date": "2024-01-15", "type": "income", "category": "salary", "amount": 5000, "description": "Monthly salary"},
    {"date": "2024-01-16", "type": "expense", "category": "rent", "amount": 1200, "description": "Apartment rent"},
    {"date": "2024-01-17", "type": "expense", "category": "groceries", "amount": 85, "description": "Weekly shopping"},
    {"date": "2024-01-18", "type": "expense", "category": "utilities", "amount": 150, "description": "Electricity bill"},
    {"date": "2024-01-20", "type": "income", "category": "freelance", "amount": 800, "description": "Web design project"}
]

// Calculate totals
let total_income = transactions.filter(|t| t.type == "income").map(|t| t.amount).sum()
let total_expenses = transactions.filter(|t| t.type == "expense").map(|t| t.amount).sum()
let net_income = total_income - total_expenses

println(f"Financial Summary:")
println("Total Income: $" + total_income.to_s())
println("Total Expenses: $" + total_expenses.to_s())
println("Net Income: $" + net_income.to_s())
println("Savings Rate: " + (net_income * 100 / total_income).to_s() + "%")

// Expense breakdown by category
let expense_categories = {}
for transaction in transactions.filter(|t| t.type == "expense") {
    let category = transaction.category
    expense_categories[category] = expense_categories.get(category, 0) + transaction.amount
}

println(f"\nExpense Breakdown:")
for category, amount in expense_categories.items() {
    let percentage = (amount * 100) / total_expenses
    println("  " + category.capitalize() + ": $" + amount.to_s() + " (" + percentage.to_s() + "%)")
}

// Budget analysis
let budget_limits = {
    "rent": 1500,
    "groceries": 400, 
    "utilities": 200,
    "entertainment": 300
}

println(f"\nBudget Analysis:")
for category, limit in budget_limits.items() {
    let spent = expense_categories.get(category, 0)
    let remaining = limit - spent
    let status = if remaining >= 0 { "✅ Under budget" } else { "❌ Over budget" }
    println("  " + category.capitalize() + ": $" + spent.to_s() + "/$" + limit.to_s() + " - " + status)
}

// Monthly trend (if we had multiple months of data)
println("\nTransaction History (" + transactions.len().to_s() + " transactions):")
for transaction in transactions.sort_by(|t| t.date) {
    let emoji = if transaction.type == "income" { "💰" } else { "💸" }
    println("  " + transaction.date + " " + emoji + " $" + transaction.amount.to_s() + " - " + transaction.description)
}






```

## Data Visualization (Text-based)

Create simple charts for console output:

```ruchy
// Status: ⚠️ NOT IMPLEMENTED
// Error: ✗ Compilation failed: Compilation failed:
// Simple bar chart function
fun draw_bar_chart(data, title) {
    println("\n" + title)
    println("=" * title.len())
    
    let max_value = data.values().max()
    let max_bar_width = 50
    
    for key, value in data.items() {
        let bar_width = (value * max_bar_width) / max_value
        let bar = "█" * bar_width.to_i()
        println(key + " │" + bar + " " + value.to_s())
    }
}

// Usage example
let monthly_sales = {
    "January": 45000,
    "February": 52000,
    "March": 48000,
    "April": 61000,
    "May": 58000
}

draw_bar_chart(monthly_sales, "Monthly Sales Report")






```

Output:
```
Monthly Sales Report
====================
January     │████████████████████████████████████ 45000
February    │██████████████████████████████████████████████ 52000
March       │█████████████████████████████████████████ 48000
April       │██████████████████████████████████████████████████ 61000
May         │████████████████████████████████████████████████ 58000
```

## Generated Code Insight

See how Ruchy's data processing becomes efficient compiled operations:

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
// Status: ❌ BROKEN

let sales_data = load_csv("sales.csv")
let total = sales_data.map(|row| row.amount.to_f()).sum()
let average = total / sales_data.len()
println("Average sale: $" + average.to_s())






// Error: ✗ Compilation failed: Compilation failed:

```

Becomes this optimized Rust:
```rust
use std::collections::HashMap;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let sales_data = load_csv("sales.csv")?;
    let total: f64 = sales_data.iter()
        .map(|row| row.amount.parse::<f64>().unwrap_or(0.0))
        .sum();
    let average = total / sales_data.len() as f64;
    println!("Average sale: ${:.2}", average);
    Ok(())
}
```

**What's happening:**
- Data processing uses efficient iterators with zero-cost abstractions
- Memory allocation is optimized by the compiler
- Number parsing and arithmetic operations are highly optimized
- Large datasets are processed with minimal memory overhead

**Performance Benefits:**
- Processing speed comparable to C++ with STL
- Memory usage scales linearly with data size
- Iterator chains are optimized into tight loops
- No garbage collection pauses during processing

</details>

**The Bottom Line:** Write expressive data processing code, get high-performance analytics automatically.

## Try It Yourself

Time to become a data processing expert! Process some real data:

```bash
$ ruchy repl
>>> # Start with simple data operations
>>> let numbers = [10, 25, 30, 15, 40, 35, 20]
>>> let total = numbers.sum()
>>> let average = total / numbers.len()
>>> println("Average: " + average.to_s())
>>> 
>>> # Work with structured data
>>> let products = [
>>>     {"name": "Laptop", "price": 1299, "category": "Electronics"},
>>>     {"name": "Book", "price": 25, "category": "Education"}
>>> ]
>>> let electronics = products.filter(|p| p.category == "Electronics")
>>> println("Electronics: " + electronics.len().to_s() + " items")
```

**Your Data Processing Challenges:**

1. **Personal Data Analysis**:
   - Analyze your own data (expenses, time tracking, habits)
   - Process your email/message history
   - Analyze your music listening patterns
   - Track and visualize your fitness data

2. **Business Intelligence Tools**:
   - Sales performance analyzer
   - Customer segmentation tool
   - Inventory level monitor
   - Revenue forecasting calculator

3. **Research and Analysis**:
   - Survey response processor
   - A/B test result analyzer
   - Market research data parser
   - Academic grade analyzer

4. **Data Cleaning and Transformation**:
   - Duplicate record finder/remover
   - Data format converter (CSV ↔ JSON)
   - Missing data detector/filler
   - Outlier detection system

**Example Complete Tool - Expense Tracker:**

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// expense_tracker.ruchy - Track and analyze personal expenses

let EXPENSES_FILE = "expenses.csv"

fun save_expense(date, category, amount, description) {
    let entry = date + "," + category + "," + amount.to_s() + "," + description + "\n"
    append_file(EXPENSES_FILE, entry)
}

fun load_expenses() {
    if !file_exists(EXPENSES_FILE) {
        // Create header if file doesn't exist
        write_file(EXPENSES_FILE, "Date,Category,Amount,Description\n")
        return []
    }
    
    let lines = read_lines(EXPENSES_FILE)[1..]  // Skip header
    let expenses = []
    
    for line in lines {
        let parts = line.split(",")
        expenses.push({
            "date": parts[0],
            "category": parts[1], 
            "amount": parts[2].to_f(),
            "description": parts[3]
        })
    }
    
    return expenses
}

fun analyze_expenses(expenses) {
    let total = expenses.map(|e| e.amount).sum()
    let average = total / expenses.len()
    
    // Category breakdown
    let categories = {}
    for expense in expenses {
        categories[expense.category] = categories.get(expense.category, 0) + expense.amount
    }
    
    println("\n💰 Expense Analysis (" + expenses.len().to_s() + " transactions)")
    println("Total Spent: $" + total.to_s())
    println("Average Transaction: $" + average.to_s())
    
    println(f"\n📊 Spending by Category:")
    for category, amount in categories.items().sort_by(|item| -item.value) {
        let percentage = (amount * 100) / total
        println("  " + category + ": $" + amount.to_s() + " (" + percentage.to_s() + "%)")
    }
    
    // Recent transactions
    let recent = expenses.sort_by(|e| -e.date)[..5]  // Last 5
    println(f"\n🕒 Recent Transactions:")
    for expense in recent {
        println("  " + expense.date + " $" + expense.amount.to_s() + " " + expense.category + " " + expense.description)
    }
}

fun main_menu() {
    println("\n=== Personal Expense Tracker ===")
    println("1. Add expense")
    println("2. View analysis") 
    println("3. Export data")
    println("4. Quit")
    
    let choice = input("\nChoose option: ")
    
    match choice {
        "1" => {
            let date = input("Date (YYYY-MM-DD): ")
            let category = input("Category: ")
            let amount = input("Amount: $").to_f()
            let description = input("Description: ")
            
            save_expense(date, category, amount, description)
            println("✅ Expense added!")
        }
        "2" => {
            let expenses = load_expenses()
            if expenses.is_empty() {
                println("📝 No expenses recorded yet")
            } else {
                analyze_expenses(expenses)
            }
        }
        "3" => {
            println("📁 Data exported to: " + EXPENSES_FILE)
            println("Open in spreadsheet application for advanced analysis")
        }
        "4" => {
            println("💸 Happy budgeting!")
            return false
        }
        _ => {
            println("❌ Invalid choice")
        }
    }
    
    return true
}

// Main program loop
while main_menu() {
    // Continue until user quits
}






```

Build data processors that solve YOUR analytical needs - that's where programming becomes insight!

## Summary

- Data processing transforms raw information into actionable insights
- Use arrays, dictionaries, and structured records for different data types
- Common patterns: filter, map, reduce, group by, sort
- Handle CSV, JSON, and log file formats with parsing functions
- Create visualizations using text-based charts for console output
- Always validate and clean data before analysis
- Build reusable functions for common data operations
- Test your analysis with known datasets to verify results

You can now process and analyze data efficiently! Next, let's learn how to work with files and build more sophisticated file-handling applications.