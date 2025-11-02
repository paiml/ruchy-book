// BENCH-004: Binary tree allocation/deallocation - Rust
// Tests: memory allocator, pointer chasing (no GC in Rust)

struct TreeNode {
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

fn make_tree(depth: i32) -> TreeNode {
    if depth <= 0 {
        TreeNode {
            left: None,
            right: None,
        }
    } else {
        TreeNode {
            left: Some(Box::new(make_tree(depth - 1))),
            right: Some(Box::new(make_tree(depth - 1))),
        }
    }
}

fn check_tree(node: &TreeNode) -> i32 {
    match (&node.left, &node.right) {
        (None, None) => 1,
        (Some(left), Some(right)) => 1 + check_tree(left) + check_tree(right),
        _ => unreachable!(),
    }
}

fn main() {
    let max_depth = 16;
    let min_depth = 4;

    // Stretch tree
    let stretch_depth = max_depth + 1;
    let stretch_tree = make_tree(stretch_depth);
    let stretch_check = check_tree(&stretch_tree);

    // Long-lived tree
    let long_lived_tree = make_tree(max_depth);

    // Create and destroy many trees
    let mut total_checks = 0;
    let mut depth = min_depth;
    while depth <= max_depth {
        let iterations = 1 << (max_depth - depth + min_depth);
        for _ in 0..iterations {
            let tree = make_tree(depth);
            total_checks += check_tree(&tree);
        }
        depth += 2;
    }

    // Final checksum
    let long_check = check_tree(&long_lived_tree);

    let _ = stretch_check;
    let _ = total_checks;
    let _ = long_check;
    // Silent for benchmarking
}
