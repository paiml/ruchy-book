// BENCH-004: Binary tree allocation/deallocation - Go
// Tests: memory allocator, GC, pointer chasing
package main

type TreeNode struct {
	left  *TreeNode
	right *TreeNode
}

func makeTree(depth int) *TreeNode {
	if depth <= 0 {
		return &TreeNode{}
	}
	return &TreeNode{
		left:  makeTree(depth - 1),
		right: makeTree(depth - 1),
	}
}

func checkTree(node *TreeNode) int {
	if node.left == nil {
		return 1
	}
	return 1 + checkTree(node.left) + checkTree(node.right)
}

func main() {
	maxDepth := 16
	minDepth := 4

	// Stretch tree
	stretchDepth := maxDepth + 1
	stretchTree := makeTree(stretchDepth)
	stretchCheck := checkTree(stretchTree)

	// Long-lived tree
	longLivedTree := makeTree(maxDepth)

	// Create and destroy many trees
	totalChecks := 0
	for depth := minDepth; depth <= maxDepth; depth += 2 {
		iterations := 1 << uint(maxDepth-depth+minDepth)
		for i := 0; i < iterations; i++ {
			tree := makeTree(depth)
			totalChecks += checkTree(tree)
		}
	}

	// Final checksum
	longCheck := checkTree(longLivedTree)

	_ = stretchCheck
	_ = totalChecks
	_ = longCheck
	// Silent for benchmarking
}
