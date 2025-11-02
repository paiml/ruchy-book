struct Node {
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn make_tree(depth: i32) -> Option<Box<Node>> {
        if depth > 0 {
            Some(Box::new(Node {
                left: Node::make_tree(depth - 1),
                right: Node::make_tree(depth - 1),
            }))
        } else {
            None
        }
    }

    fn check(&self) -> i32 {
        1 + self.left.as_ref().map_or(0, |n| n.check())
          + self.right.as_ref().map_or(0, |n| n.check())
    }
}

fn main() {
    let tree = Node::make_tree(16);
    let _ = tree.map_or(0, |t| t.check());
}
