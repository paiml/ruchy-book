// BENCH-004: Binary tree allocation/deallocation - C
// Tests: memory allocator, pointer chasing, manual memory management

#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

TreeNode* make_tree(int depth) {
    TreeNode *node = (TreeNode*)malloc(sizeof(TreeNode));
    if (!node) {
        return NULL;
    }

    if (depth <= 0) {
        node->left = NULL;
        node->right = NULL;
    } else {
        node->left = make_tree(depth - 1);
        node->right = make_tree(depth - 1);
    }

    return node;
}

int check_tree(TreeNode *node) {
    if (node->left == NULL) {
        return 1;
    }
    return 1 + check_tree(node->left) + check_tree(node->right);
}

void free_tree(TreeNode *node) {
    if (node == NULL) {
        return;
    }
    free_tree(node->left);
    free_tree(node->right);
    free(node);
}

int main() {
    int max_depth = 16;
    int min_depth = 4;

    // Stretch tree
    int stretch_depth = max_depth + 1;
    TreeNode *stretch_tree = make_tree(stretch_depth);
    int stretch_check = check_tree(stretch_tree);
    free_tree(stretch_tree);

    // Long-lived tree
    TreeNode *long_lived_tree = make_tree(max_depth);

    // Create and destroy many trees
    int total_checks = 0;
    for (int depth = min_depth; depth <= max_depth; depth += 2) {
        int iterations = 1 << (max_depth - depth + min_depth);
        for (int i = 0; i < iterations; i++) {
            TreeNode *tree = make_tree(depth);
            total_checks += check_tree(tree);
            free_tree(tree);
        }
    }

    // Final checksum
    int long_check = check_tree(long_lived_tree);
    free_tree(long_lived_tree);

    // Silent for benchmarking
    return 0;
}
