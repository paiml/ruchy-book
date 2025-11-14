#!/usr/bin/env python3
# BENCH-004: Binary tree allocation/deallocation - Python
# Based on Computer Language Benchmarks Game binary-trees
# Tests: memory allocator, GC, pointer chasing

class TreeNode:
    def __init__(self, left=None, right=None):
        self.left = left
        self.right = right

def make_tree(depth):
    """Create a binary tree of given depth"""
    if depth <= 0:
        return TreeNode()
    return TreeNode(make_tree(depth - 1), make_tree(depth - 1))

def check_tree(node):
    """Compute checksum by walking tree"""
    if node.left is None:
        return 1
    return 1 + check_tree(node.left) + check_tree(node.right)

def main():
    max_depth = 16  # Manageable for all implementations
    min_depth = 4

    # Stretch tree
    stretch_depth = max_depth + 1
    stretch_tree = make_tree(stretch_depth)
    stretch_check = check_tree(stretch_tree)

    # Long-lived tree
    long_lived_tree = make_tree(max_depth)

    # Create and destroy many trees
    total_checks = 0
    for depth in range(min_depth, max_depth + 1, 2):
        iterations = 1 << (max_depth - depth + min_depth)
        for _ in range(iterations):
            tree = make_tree(depth)
            total_checks += check_tree(tree)

    # Final checksum of long-lived tree
    long_check = check_tree(long_lived_tree)

    # Silent for benchmarking
    # Expected: stretch_check, total_checks, long_check all > 0

if __name__ == "__main__":
    main()
