# BENCH-004: Binary tree allocation/deallocation - Julia
# Tests: memory allocator, Julia GC, pointer chasing

mutable struct TreeNode
    left::Union{TreeNode, Nothing}
    right::Union{TreeNode, Nothing}
end

TreeNode() = TreeNode(nothing, nothing)

function make_tree(depth::Int64)::TreeNode
    if depth <= 0
        return TreeNode()
    end
    return TreeNode(make_tree(depth - 1), make_tree(depth - 1))
end

function check_tree(node::TreeNode)::Int64
    if node.left === nothing
        return 1
    end
    return 1 + check_tree(node.left) + check_tree(node.right)
end

function main()
    max_depth = 16
    min_depth = 4

    # Stretch tree
    stretch_depth = max_depth + 1
    stretch_tree = make_tree(stretch_depth)
    stretch_check = check_tree(stretch_tree)

    # Long-lived tree
    long_lived_tree = make_tree(max_depth)

    # Create and destroy many trees
    total_checks = 0
    for depth in min_depth:2:max_depth
        iterations = 1 << (max_depth - depth + min_depth)
        for _ in 1:iterations
            tree = make_tree(depth)
            total_checks += check_tree(tree)
        end
    end

    # Final checksum
    long_check = check_tree(long_lived_tree)

    # Silent for benchmarking
end

main()
