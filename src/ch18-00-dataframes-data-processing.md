# Chapter 18: DataFrames & Data Processing

## The Problem

Modern applications deal with structured data at massive scale. Whether analyzing sales metrics, processing log files, or transforming datasets, you need powerful tools that make data manipulation intuitive and performant. DataFrames provide a tabular data structure that combines the ease of spreadsheets with the power of programming.

## Quick Example

```ruchy
// Load and analyze sales data
let sales = DataFrame::from_csv("sales.csv");
let top_products = sales
    .group_by("product")
    .agg("revenue", "sum")
    .sort_by("revenue_sum", descending: true)
    .head(10);
println("Top 10 products by revenue: {}", top_products);
```

## Core Concepts

### What is a DataFrame?

A DataFrame is a two-dimensional, size-mutable, heterogeneous tabular data structure with labeled axes (rows and columns). Think of it as:
- A table in a relational database
- A spreadsheet with programming capabilities
- An in-memory analytics engine

### Key Properties

1. **Columnar Storage**: Data organized by columns for efficient operations
2. **Type Safety**: Each column has a consistent data type
3. **Label-Based Access**: Reference data by column names and row indices
4. **Vectorized Operations**: Operations apply to entire columns at once
5. **Missing Data Handling**: Built-in support for null/missing values

## Creating DataFrames

### From Scratch

```ruchy
fun create_employee_dataframe() {
    let df = DataFrame::new()
        .column("employee_id", [101, 102, 103, 104])
        .column("name", ["Alice", "Bob", "Charlie", "Diana"])
        .column("department", ["Engineering", "Sales", "Engineering", "HR"])
        .column("salary", [95000, 75000, 105000, 65000])
        .column("start_date", ["2020-01-15", "2019-06-01", "2018-03-20", "2021-09-10"])
        .build();
    
    println("Created DataFrame with {} employees", df.rows());
    df.show(); // Display the DataFrame
}
```

### From CSV Files

```ruchy
fun load_csv_data() {
    // From file
    let df = DataFrame::from_csv("data/customers.csv");
    
    // With options
    let df_custom = DataFrame::from_csv("data/sales.csv")
        .delimiter(';')
        .has_header(true)
        .parse_dates(["order_date", "ship_date"])
        .load();
    
    // From string (useful for embedded data)
    let csv_string = "name,age,city
John,28,Boston
Jane,32,Seattle
Bob,45,Austin";
    
    let df_inline = DataFrame::from_csv_string(csv_string);
    println("Loaded {} records", df_inline.rows());
}
```

### From JSON

```ruchy
fun load_json_data() {
    // Array of objects
    let json_array = r#"[
        {"product": "Laptop", "price": 999.99, "stock": 15},
        {"product": "Mouse", "price": 29.99, "stock": 150},
        {"product": "Keyboard", "price": 79.99, "stock": 75}
    ]"#;
    
    let df = DataFrame::from_json(json_array);
    
    // Nested JSON with flattening
    let complex_json = r#"[
        {"user": {"name": "Alice", "age": 30}, "orders": 5},
        {"user": {"name": "Bob", "age": 25}, "orders": 3}
    ]"#;
    
    let df_flat = DataFrame::from_json(complex_json)
        .flatten_nested()
        .load();
    
    // Now columns are: user_name, user_age, orders
    df_flat.show();
}
```

## Data Selection and Access

### Column Selection

```ruchy
fun select_columns() {
    let df = load_sales_data();
    
    // Single column (returns Series)
    let prices = df["price"];
    
    // Multiple columns (returns DataFrame)
    let subset = df.select(["product", "price", "quantity"]);
    
    // Column slicing
    let first_three = df.columns(0..3);
    
    // Conditional column selection
    let numeric_cols = df.select_numeric();
    let text_cols = df.select_text();
}
```

### Row Selection

```ruchy
fun select_rows() {
    let df = load_customer_data();
    
    // By index
    let first_row = df.row(0);
    let last_row = df.row(-1);
    
    // By range
    let first_ten = df.rows(0..10);
    
    // By condition (filtering)
    let vip_customers = df.filter(|row| row["total_purchases"] > 10000);
    
    // Random sampling
    let sample = df.sample(100); // 100 random rows
    let sample_pct = df.sample_frac(0.1); // 10% of rows
}
```

### Cell Access

```ruchy
fun access_cells() {
    let df = load_data();
    
    // Single cell
    let value = df.get("column_name", row_index);
    
    // Update cell
    df.set("column_name", row_index, new_value);
    
    // Conditional update
    df.update_where(
        |row| row["status"] == "pending",
        "status", 
        "processed"
    );
}
```

## Data Transformation

### Adding Columns

```ruchy
fun add_calculated_columns() {
    let df = DataFrame::new()
        .column("price", [10.0, 20.0, 30.0])
        .column("quantity", [5, 3, 2])
        .build();
    
    // Simple calculation
    let with_total = df.with_column("total", |row| {
        row["price"] * row["quantity"]
    });
    
    // Complex calculation with multiple columns
    let with_tax = with_total.with_column("total_with_tax", |row| {
        let subtotal = row["total"];
        let tax_rate = if subtotal > 50.0 { 0.10 } else { 0.05 };
        subtotal * (1.0 + tax_rate)
    });
    
    // Using external data
    let tax_rates = HashMap::from([
        ("CA", 0.0725),
        ("TX", 0.0625),
        ("NY", 0.08)
    ]);
    
    let with_state_tax = df.with_column("tax", |row| {
        let state = row["state"];
        let amount = row["amount"];
        amount * tax_rates.get(state).unwrap_or(&0.0)
    });
}
```

### Modifying Columns

```ruchy
fun transform_columns() {
    let mut df = load_data();
    
    // Apply function to column
    df.transform("price", |val| val * 1.1); // 10% increase
    
    // String transformations
    df.transform("name", |val| val.to_lowercase());
    
    // Type conversion
    df.cast("age", DataType::Float64);
    
    // Rename columns
    df.rename("old_name", "new_name");
    df.rename_all(|name| name.to_uppercase());
    
    // Drop columns
    df.drop("unnecessary_column");
    df.drop_many(["col1", "col2", "col3"]);
}
```

## Filtering and Querying

### Basic Filtering

```ruchy
fun filter_examples() {
    let df = load_product_data();
    
    // Simple condition
    let in_stock = df.filter(|row| row["quantity"] > 0);
    
    // Multiple conditions
    let popular_items = df.filter(|row| {
        row["rating"] >= 4.0 && row["reviews"] > 100
    });
    
    // String matching
    let electronics = df.filter(|row| {
        row["category"].contains("Electronics")
    });
    
    // Date filtering
    let recent = df.filter(|row| {
        row["date"] >= "2024-01-01"
    });
}
```

### Advanced Queries

```ruchy
fun advanced_queries() {
    let df = load_sales_data();
    
    // SQL-like query syntax
    let result = df.query("
        SELECT product, SUM(revenue) as total_revenue
        WHERE date >= '2024-01-01'
        GROUP BY product
        HAVING total_revenue > 10000
        ORDER BY total_revenue DESC
    ");
    
    // Chain operations
    let analysis = df
        .filter(|row| row["region"] == "West")
        .group_by("product")
        .agg("quantity", "sum")
        .agg("revenue", "mean")
        .sort_by("quantity_sum", descending: true)
        .head(20);
}
```

## Aggregation and Grouping

### Basic Aggregations

```ruchy
fun aggregate_data() {
    let df = load_numeric_data();
    
    // Column-wise aggregations
    let sum = df["sales"].sum();
    let mean = df["price"].mean();
    let median = df["quantity"].median();
    let std = df["rating"].std();
    let min = df["cost"].min();
    let max = df["revenue"].max();
    
    // Multiple aggregations
    let stats = df.describe(); // Summary statistics
    
    // Custom aggregations
    let custom = df.agg({
        "sales": ["sum", "mean", "count"],
        "price": ["min", "max", "median"],
        "rating": ["mean", "std"]
    });
}
```

### Group By Operations

```ruchy
fun group_operations() {
    let df = load_sales_data();
    
    // Single column grouping
    let by_category = df
        .group_by("category")
        .agg("revenue", "sum");
    
    // Multiple column grouping
    let by_region_product = df
        .group_by(["region", "product"])
        .agg("quantity", "sum")
        .agg("revenue", "mean");
    
    // Multiple aggregations per column
    let detailed = df
        .group_by("department")
        .agg_many("salary", ["mean", "median", "std", "count"]);
    
    // Custom aggregation functions
    let custom_agg = df
        .group_by("store")
        .agg_custom("prices", |values| {
            // Calculate price range
            values.max() - values.min()
        });
}
```

### Window Functions

```ruchy
fun window_functions() {
    let df = load_time_series_data();
    
    // Rolling statistics
    let with_ma = df
        .sort_by("date")
        .rolling_mean("value", window: 7); // 7-day moving average
    
    let with_rolling = df
        .rolling_window("price", 5)
        .apply(|window| window.std()); // 5-period rolling std
    
    // Cumulative operations
    let cumsum = df
        .sort_by("date")
        .cumsum("daily_sales");
    
    // Ranking
    let with_rank = df
        .rank("score", method: "dense", ascending: false);
    
    // Lead/Lag
    let with_prev = df
        .sort_by("date")
        .lag("price", 1); // Previous day's price
}
```

## Joining and Merging

### Join Operations

```ruchy
fun join_dataframes() {
    let customers = DataFrame::from_csv("customers.csv");
    let orders = DataFrame::from_csv("orders.csv");
    
    // Inner join
    let customer_orders = customers
        .join(orders, on: "customer_id");
    
    // Left join
    let all_customers = customers
        .left_join(orders, on: "customer_id");
    
    // Multiple keys
    let detailed = products
        .join(inventory, on: ["product_id", "warehouse_id"]);
    
    // Different column names
    let merged = df1
        .join(df2, left_on: "id", right_on: "customer_id");
}
```

### Concatenation and Appending

```ruchy
fun combine_dataframes() {
    let jan_sales = DataFrame::from_csv("jan_sales.csv");
    let feb_sales = DataFrame::from_csv("feb_sales.csv");
    let mar_sales = DataFrame::from_csv("mar_sales.csv");
    
    // Vertical concatenation (union)
    let q1_sales = DataFrame::concat([jan_sales, feb_sales, mar_sales]);
    
    // Horizontal concatenation
    let combined = DataFrame::concat_horizontal([df1, df2]);
    
    // Append rows
    let mut df = load_data();
    df.append_row({
        "product": "New Item",
        "price": 49.99,
        "quantity": 100
    });
}
```

## Data Cleaning

### Handling Missing Data

```ruchy
fun handle_missing_data() {
    let mut df = load_messy_data();
    
    // Check for missing values
    let missing_count = df.null_count();
    let has_nulls = df.has_nulls();
    
    // Drop rows with any missing values
    let clean = df.dropna();
    
    // Drop rows where specific columns are null
    let filtered = df.dropna(subset: ["critical_column"]);
    
    // Fill missing values
    df.fillna(0); // Fill with constant
    df.fillna_forward(); // Forward fill
    df.fillna_backward(); // Backward fill
    
    // Column-specific filling
    df.fillna_column("price", df["price"].mean());
    df.fillna_column("category", "Unknown");
    
    // Interpolation
    df.interpolate("temperature", method: "linear");
}
```

### Data Validation

```ruchy
fun validate_data() {
    let df = load_data();
    
    // Check data types
    let dtypes = df.dtypes();
    
    // Validate ranges
    let invalid_prices = df.filter(|row| {
        row["price"] < 0 || row["price"] > 10000
    });
    
    // Check for duplicates
    let duplicates = df.duplicated(subset: ["id"]);
    let unique = df.drop_duplicates(subset: ["id"]);
    
    // Validate patterns
    let invalid_emails = df.filter(|row| {
        !row["email"].matches(r"^[\w\.-]+@[\w\.-]+\.\w+$")
    });
    
    // Data consistency checks
    let inconsistent = df.filter(|row| {
        row["end_date"] < row["start_date"]
    });
}
```

## Performance Optimization

### Efficient Operations

```ruchy
fun optimize_performance() {
    let df = load_large_dataset();
    
    // Use vectorized operations instead of loops
    // Good: Vectorized
    let result = df["price"] * df["quantity"];
    
    // Avoid: Row-by-row iteration
    // for row in df.iter_rows() {
    //     row["total"] = row["price"] * row["quantity"];
    // }
    
    // Use lazy evaluation for complex chains
    let lazy_result = df
        .lazy()
        .filter(|row| row["value"] > 100)
        .group_by("category")
        .agg("amount", "sum")
        .collect(); // Execute only at the end
    
    // Chunked processing for huge datasets
    let chunks = df.read_csv_chunked("huge_file.csv", chunk_size: 10000);
    for chunk in chunks {
        process_chunk(chunk);
    }
}
```

### Memory Management

```ruchy
fun manage_memory() {
    // Use appropriate data types
    let df = DataFrame::from_csv("data.csv")
        .dtype_backend("pyarrow") // More memory efficient
        .parse_dates(["date"])
        .downcast_integers() // Use smallest int type
        .load();
    
    // Release memory when done
    let temp_df = compute_intermediate();
    let result = process(temp_df);
    drop(temp_df); // Explicit cleanup
    
    // Use views instead of copies
    let view = df.view(["col1", "col2"]); // No data copy
    let slice = df.slice(0..1000); // Lightweight slice
}
```

## Real-World Example: Sales Analytics Dashboard

```ruchy
fun sales_analytics_pipeline() {
    // Load and combine data sources
    let sales = DataFrame::from_csv("sales_2024.csv");
    let products = DataFrame::from_csv("products.csv");
    let regions = DataFrame::from_csv("regions.csv");
    
    // Data cleaning
    let clean_sales = sales
        .dropna(subset: ["product_id", "amount"])
        .filter(|row| row["amount"] > 0)
        .drop_duplicates(subset: ["order_id"]);
    
    // Enrich with product information
    let enriched = clean_sales
        .join(products, on: "product_id")
        .join(regions, on: "region_id");
    
    // Calculate metrics
    let with_metrics = enriched
        .with_column("revenue", |row| {
            row["quantity"] * row["unit_price"]
        })
        .with_column("profit", |row| {
            row["revenue"] - (row["quantity"] * row["unit_cost"])
        })
        .with_column("margin", |row| {
            row["profit"] / row["revenue"] * 100.0
        });
    
    // Monthly summary
    let monthly = with_metrics
        .with_column("month", |row| {
            row["date"].month()
        })
        .group_by(["month", "region_name"])
        .agg("revenue", "sum")
        .agg("profit", "sum")
        .agg("margin", "mean")
        .agg("quantity", "sum")
        .sort_by(["month", "revenue_sum"], descending: [false, true]);
    
    // Top products by region
    let top_products = with_metrics
        .group_by(["region_name", "product_name"])
        .agg("revenue", "sum")
        .sort_by("revenue_sum", descending: true)
        .group_by("region_name")
        .head(5); // Top 5 per region
    
    // Export results
    monthly.to_csv("monthly_summary.csv");
    top_products.to_json("top_products.json");
    
    // Generate report
    println("Sales Analytics Report");
    println("======================");
    println("Total Revenue: ${:.2}", with_metrics["revenue"].sum());
    println("Total Profit: ${:.2}", with_metrics["profit"].sum());
    println("Average Margin: {:.1}%", with_metrics["margin"].mean());
    println("\nTop Performing Region:");
    println("{}", monthly.head(1));
}
```

## Common Pitfalls

1. **Modifying During Iteration**: Don't modify DataFrame while iterating
   ```ruchy
   // Wrong
   for row in df.iter_rows() {
       df.drop_row(row.index); // Modifies during iteration
   }
   
   // Right
   let indices_to_drop = df
       .filter(|row| condition)
       .indices();
   df.drop_rows(indices_to_drop);
   ```

2. **Chained Assignment**: Use proper methods for updates
   ```ruchy
   // Wrong
   df[df["x"] > 5]["y"] = 10; // Might not update original
   
   // Right
   df.update_where(|row| row["x"] > 5, "y", 10);
   ```

3. **Memory Bloat**: Be mindful of copies
   ```ruchy
   // Inefficient: Creates multiple copies
   let df2 = df.copy();
   let df3 = df2.copy();
   
   // Efficient: Use views or modify in place
   let view = df.view();
   df.transform_inplace("col", |v| v * 2);
   ```

## Transpilation Insight

<details>
<summary>Generated Rust (click to expand)</summary>

```rust
// Ruchy DataFrame operations transpile to efficient Rust code
// leveraging the polars library for performance

use polars::prelude::*;

fn sales_analytics_pipeline() -> Result<()> {
    // Load data using polars lazy frames
    let sales = LazyFrame::scan_csv("sales_2024.csv", Default::default())?;
    let products = LazyFrame::scan_csv("products.csv", Default::default())?;
    
    // Chain operations are optimized by polars query planner
    let result = sales
        .filter(col("amount").gt(0))
        .drop_nulls(Some(&["product_id", "amount"]))
        .join(products, ["product_id"], ["product_id"], JoinType::Inner)
        .with_column((col("quantity") * col("unit_price")).alias("revenue"))
        .group_by([col("month"), col("region")])
        .agg([
            col("revenue").sum().alias("revenue_sum"),
            col("profit").sum().alias("profit_sum"),
        ])
        .sort(["month", "revenue_sum"], [false, true])
        .collect()?; // Lazy evaluation executes here
    
    Ok(())
}
```

</details>

## Exercises

1. **Data Cleaning Challenge**: Load a messy CSV file with missing values, duplicates, and inconsistent formatting. Clean it to produce a report-ready DataFrame.

2. **Time Series Analysis**: Create a DataFrame with hourly temperature readings for a week. Calculate rolling averages, detect anomalies, and identify trends.

3. **Join Operations**: Given customer, order, and product DataFrames, create a comprehensive sales report showing customer lifetime value and product performance.

## Summary

- DataFrames provide powerful tabular data manipulation in Ruchy
- Operations are vectorized for performance
- Chain operations for expressive data pipelines
- Use lazy evaluation for complex transformations
- Always validate and clean data before analysis
- Leverage grouping and aggregation for insights
- Export results in various formats for integration