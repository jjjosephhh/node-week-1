

**Segment Trees: Broad Overview**

- **Nature**: 
  - Data structure used for answering range queries and range updates efficiently.
  - Binary tree where each leaf node represents an element from the input array and internal nodes represent segments of the array, generally formed by merging children nodes.

- **Operations**:
  - **Build**: Construct the tree from an array. O(n) time.
  - **Query**: Get results for a specific range (like sum, minimum, or maximum). O(log n) time.
  - **Update**: Modify one or more array elements. O(log n) for point updates, O(log n) to O(n) for range updates.

- **Usage**:
  - Efficiently answer range-based queries: e.g., "sum of elements from index L to R", or "minimum value from index L to R".
  - Handle updates in the array without rebuilding the entire structure.

- **Where are they used?**:
  - Competitive programming: Common tool to solve range-based problems.
  - Database systems: To keep track of information over intervals.
  - Computational geometry: Reporting points in a range.

- **Good For**:
  - Dynamic datasets: Handle both updates and queries efficiently.
  - Range-aggregate functions: Such as sum, minimum, maximum, and even count of numbers satisfying certain properties.
  - Lazy propagation: Used to delay updates to descendant nodes, making range updates more efficient.

- **Not Good For**:
  - Single-point queries or updates in simple arrays (overhead isn't justified).
  - High-dimensional range queries: The structure gets complex and consumes more space.
  - Situations requiring minimal memory: Segment trees can be memory-intensive.

**Summary**: Segment trees are versatile data structures good for efficient range queries and updates. They shine in dynamic scenarios where the dataset changes over time. However, for simple tasks or memory-constrained environments, the overhead might not be justifiable.


class SegmentTree:
    def __init__(self, arr):
        # Length of the input array
        self.n = len(arr)
        
        # Initialize the segment tree with zeros. It's size is roughly 4 times the size of the input array
        self.tree = [0] * (4 * self.n)
        
        # Start the build process from the root of the tree
        self.build(arr, 0, 0, self.n - 1)

    def build(self, arr, tree_index, l, r):
        """ Recursive function to build the segment tree."""
        
        # Base case: if the segment of the array is of length 1 (i.e., l == r)
        if l == r:
            self.tree[tree_index] = arr[l]
            return
        
        # Split the segment into two halves
        mid = (l + r) // 2
        
        # Build the left and right subtrees
        self.build(arr, 2 * tree_index + 1, l, mid)
        self.build(arr, 2 * tree_index + 2, mid + 1, r)
        
        # Internal node will have the sum of both of its children
        self.tree[tree_index] = self.tree[2 * tree_index + 1] + self.tree[2 * tree_index + 2]

    def update(self, index, value, tree_index=0, l=0, r=None):
        """ Update the element at `index` to `value`."""
        
        # If `r` is None, this is the first call to the function
        if r is None:
            r = self.n - 1
        
        # Reached the leaf node corresponding to `index`
        if l == r:
            self.tree[tree_index] = value
            return
        
        # To decide whether to go to the left child or right child
        mid = (l + r) // 2
        if index <= mid:
            self.update(index, value, 2 * tree_index + 1, l, mid)
        else:
            self.update(index, value, 2 * tree_index + 2, mid + 1, r)
        
        # Internal node will have the sum of both of its children
        self.tree[tree_index] = self.tree[2 * tree_index + 1] + self.tree[2 * tree_index + 2]

    def query(self, ql, qr, tree_index=0, l=0, r=None):
        """ Query to get the sum from ql (query left) to qr (query right)."""
        
        # If `r` is None, this is the first call to the function
        if r is None:
            r = self.n - 1
        
        # If the current segment is entirely inside the query range
        if ql <= l and r <= qr:
            return self.tree[tree_index]
        
        # If the current segment is entirely outside the query range
        if qr < l or r < ql:
            return 0
        
        # Split the segment into two halves
        mid = (l + r) // 2
        return self.query(ql, qr, 2 * tree_index + 1, l, mid) + self.query(ql, qr, 2 * tree_index + 2, mid + 1, r)


# Example usage:
arr = [1, 3, 5, 7, 9, 11]
seg_tree = SegmentTree(arr)

# Query the segment tree to get the sum from index 1 to 3
print(seg_tree.query(1, 3))  # Output: 15 (3 + 5 + 7)

# Update the value at index 1 to 10
seg_tree.update(1, 10)

# Again query the segment tree to get the sum from index 1 to 3 after the update
print(seg_tree.query(1, 3))  # Output: 22 (10 + 5 + 7)