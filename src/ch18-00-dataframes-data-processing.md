# Chapter 18: DataFrames & Data Processing

> **Implementation Status (v1.84.0)**: DataFrame support is available in interpreter mode. The builder pattern works for creating DataFrames with multiple columns and data types.

## The Problem

Modern applications deal with structured data at massive scale. Whether analyzing sales metrics, processing log files, or transforming datasets, you need powerful tools that make data manipulation intuitive and performant. DataFrames provide a tabular data structure that combines the ease of spreadsheets with the power of programming.

## Working Examples

### Creating DataFrames

```ruchy
fun create_dataframe() {
    let df = DataFrame::new()
        .column("employee_id", [101, 102, 103, 104])
        .column("name", ["Alice", "Bob", "Charlie", "Diana"])
        .column("department", ["Engineering", "Sales", "Engineering", "HR"])
        .column("salary", [95000, 75000, 105000, 65000])
        .build();
    
    println("Created DataFrame with {} employees", df.rows());
    println(df);  // Display the DataFrame
}
```

### Working with DataFrame Functions

```ruchy
fun analyze_sales(df: DataFrame) {
    println("Analyzing {} sales records", df.rows());
    println("Data has {} columns", df.columns());
}

fun main() {
    let sales = DataFrame::new()
        .column("product", ["Widget", "Gadget", "Gizmo"])
        .column("quantity", [100, 150, 200])
        .column("revenue", [999.00, 1499.00, 1999.00])
        .build();
    
    analyze_sales(sales);
}
```

### Multiple DataFrames

```ruchy
fun work_with_multiple_dataframes() {
    let customers = DataFrame::new()
        .column("customer_id", [1, 2, 3])
        .column("name", ["Alice", "Bob", "Charlie"])
        .column("city", ["New York", "Los Angeles", "Chicago"])
        .build();
    
    let orders = DataFrame::new()
        .column("order_id", [101, 102, 103])
        .column("customer_id", [1, 2, 1])
        .column("amount", [99.99, 149.99, 79.99])
        .build();
    
    println("Customers: {} rows", customers.rows());
    println("Orders: {} rows", orders.rows());
}
```

### DataFrames in Control Flow

```ruchy
fun conditional_processing() {
    let df = DataFrame::new()
        .column("status", ["active", "pending", "closed"])
        .column("value", [1000, 500, 1500])
        .build();
    
    if df.rows() > 0 {
        println("DataFrame contains data");
    }
    
    if df.columns() == 2 {
        println("DataFrame has exactly 2 columns");
    }
    
    for i in 0..df.rows() {
        println("Processing row {}", i);
    }
}
```

## Core DataFrame Operations

Currently supported operations:

- `DataFrame::new()` - Create a new DataFrame builder
- `.column(name, data)` - Add a column with data
- `.build()` - Finalize the DataFrame
- `df.rows()` - Get the number of rows
- `df.columns()` - Get the number of columns
- `println(df)` - Display the DataFrame

## Summary

DataFrames in Ruchy v1.84.0 provide a solid foundation for working with tabular data in interpreter mode. The builder pattern makes it easy to construct DataFrames with multiple columns of different types, and they can be passed to functions and used in control flow structures.