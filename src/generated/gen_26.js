/**
 * gen_26.js — Generated: Graph (adjacency list)
 */

class Graph {
  constructor(directed = false) {
    this._adj = new Map();
    this._directed = directed;
  }

  addNode(node) {
    if (!this._adj.has(node)) this._adj.set(node, new Set());
    return this;
  }

  addEdge(u, v, weight = 1) {
    this.addNode(u); this.addNode(v);
    this._adj.get(u).add({ to: v, weight });
    if (!this._directed) this._adj.get(v).add({ to: u, weight });
    return this;
  }

  neighbors(node) { return [...(this._adj.get(node) || [])]; }

  nodes() { return [...this._adj.keys()]; }

  hasNode(node) { return this._adj.has(node); }

  bfs(start) {
    const visited = new Set([start]);
    const queue = [start];
    const order = [];
    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      for (const { to } of this.neighbors(node)) {
        if (!visited.has(to)) { visited.add(to); queue.push(to); }
      }
    }
    return order;
  }

  dfs(start, visited = new Set()) {
    visited.add(start);
    const order = [start];
    for (const { to } of this.neighbors(start)) {
      if (!visited.has(to)) order.push(...this.dfs(to, visited));
    }
    return order;
  }

  nodeCount() { return this._adj.size; }
}

module.exports = { Graph };
