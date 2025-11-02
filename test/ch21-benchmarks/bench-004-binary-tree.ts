// BENCH-004: Binary tree allocation/deallocation - Deno TypeScript
// Tests: memory allocator, V8 GC, pointer chasing

class TreeNode {
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(left: TreeNode | null = null, right: TreeNode | null = null) {
        this.left = left;
        this.right = right;
    }
}

function makeTree(depth: number): TreeNode {
    if (depth <= 0) {
        return new TreeNode();
    }
    return new TreeNode(makeTree(depth - 1), makeTree(depth - 1));
}

function checkTree(node: TreeNode): number {
    if (node.left === null) {
        return 1;
    }
    return 1 + checkTree(node.left) + checkTree(node.right!);
}

function main(): void {
    const maxDepth = 16;
    const minDepth = 4;

    // Stretch tree
    const stretchDepth = maxDepth + 1;
    const stretchTree = makeTree(stretchDepth);
    const stretchCheck = checkTree(stretchTree);

    // Long-lived tree
    const longLivedTree = makeTree(maxDepth);

    // Create and destroy many trees
    let totalChecks = 0;
    for (let depth = minDepth; depth <= maxDepth; depth += 2) {
        const iterations = 1 << (maxDepth - depth + minDepth);
        for (let i = 0; i < iterations; i++) {
            const tree = makeTree(depth);
            totalChecks += checkTree(tree);
        }
    }

    // Final checksum
    const longCheck = checkTree(longLivedTree);

    // Silent for benchmarking
}

main();
