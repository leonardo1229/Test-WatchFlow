/**
 * gen_36.js — Generated: Tree (generic n-ary)
 */

class TreeNode {
  constructor(value) {
    this.value    = value;
    this.children = [];
    this.parent   = null;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
    return this;
  }

  removeChild(node) {
    this.children = this.children.filter((c) => c !== node);
    node.parent = null;
    return this;
  }

  isLeaf()  { return this.children.length === 0; }
  isRoot()  { return this.parent === null; }
  depth()   { return this.isRoot() ? 0 : this.parent.depth() + 1; }
  height()  { return this.isLeaf() ? 0 : 1 + Math.max(...this.children.map((c) => c.height())); }

  ancestors() {
    const result = [];
    let cur = this.parent;
    while (cur) { result.push(cur); cur = cur.parent; }
    return result;
  }

  descendants() {
    const result = [];
    const stack = [...this.children];
    while (stack.length) {
      const node = stack.pop();
      result.push(node);
      stack.push(...node.children);
    }
    return result;
  }

  find(predicate) {
    if (predicate(this)) return this;
    for (const child of this.children) {
      const found = child.find(predicate);
      if (found) return found;
    }
    return null;
  }
}

module.exports = { TreeNode };
