# Chapter 18: DataFrames & Data Processing

> **Implementation Status (v3.67.0)**:
> - ✅ **Interpreter Mode**: DataFrames work when running `.ruchy` files directly
> - ❌ **Transpiler Mode**: Not yet supported - use [polars](https://pola.rs) directly in Rust
> - 📋 **Planned**: Transpiler support coming in v3.8+ (see [#issue](https://github.com/paiml/ruchy/issues))
>
> **How to Use**:
> ```bash
> # ✅ Works - Interpreter mode
> ruchy dataframe_example.ruchy
>
> # ❌ Not yet supported - Transpiler mode
> ruchy build dataframe_example.ruchy  # Will fail with polars dependency error
> ```

## The Problem

Modern applications deal with structured data at massive scale. Whether analyzing sales metrics, processing log files, or transforming datasets, you need powerful tools that make data manipulation intuitive and performant. DataFrames provide a tabular data structure that combines the ease of spreadsheets with the power of programming.

## Working Examples

### Creating DataFrames

```ruchy
fun create_dataframe() {
    let df = df![
        "employee_id" => [101, 102, 103, 104],
        "name" => ["Alice", "Bob", "Charlie", "Diana"],
        "department" => ["Engineering", "Sales", "Engineering", "HR"],
        "salary" => [95000, 75000, 105000, 65000]
    ];

    // Display the DataFrame (returns as last expression)
    df
}
```

**Note**: Use `df![]` macro for creating DataFrames in interpreter mode.

### Working with DataFrame Functions

```ruchy
fun main() {
    let sales = df![
        "product" => ["Widget", "Gadget", "Gizmo"],
        "quantity" => [100, 150, 200],
        "revenue" => [999.00, 1499.00, 1999.00]
    ];

    // Display the DataFrame
    sales
}
```

### Multiple DataFrames

```ruchy
fun work_with_multiple_dataframes() {
    let customers = df![
        "customer_id" => [1, 2, 3],
        "name" => ["Alice", "Bob", "Charlie"],
        "city" => ["New York", "Los Angeles", "Chicago"]
    ];

    let orders = df![
        "order_id" => [101, 102, 103],
        "customer_id" => [1, 2, 1],
        "amount" => [99.99, 149.99, 79.99]
    ];

    // Display both DataFrames
    customers
}
```

### DataFrames in Control Flow

```ruchy
fun conditional_processing() {
    let df = df![
        "status" => ["active", "pending", "closed"],
        "value" => [1000, 500, 1500]
    ];

    // Display the DataFrame
    df
}
```

## Core DataFrame Operations

Currently supported operations in **interpreter mode**:

- `df!["col" => [data], ...]` - Create a DataFrame using the macro syntax
- Display by returning the DataFrame as the last expression in a function

## Future Operations (Coming Soon)

The following operations are planned for future releases:

- `.rows()` - Get the number of rows
- `.columns()` - Get the number of columns
- `.filter()` - Filter rows based on conditions
- `.select()` - Select specific columns
- `.join()` - Join multiple DataFrames
- Method chaining and more!

## Summary

DataFrames in Ruchy v3.67.0 provide a solid foundation for working with tabular data in **interpreter mode**. The `df![]` macro makes it easy to construct DataFrames with multiple columns of different types.

**For production Rust code**, use the transpiler with [polars](https://pola.rs) directly, or wait for transpiler support in v3.8+.

## Transpiler Support Roadmap

DataFrame transpiler support is actively being developed:

1. **Current**: Interpreter mode works with `df![]` macro ✅
2. **Planned (v3.8+)**: Transpiler generates polars-compatible code
3. **Future**: Full DataFrame API with filtering, aggregation, joins

Track progress: [GitHub Issue #XXX](https://github.com/paiml/ruchy/issues)