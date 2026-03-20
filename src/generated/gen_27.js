/**
 * gen_27.js — Generated: Tree node / trie
 */

class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this._root = new TrieNode();
  }

  insert(word) {
    let node = this._root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
    return this;
  }

  search(word) {
    const node = this._traverse(word);
    return Boolean(node?.isEnd);
  }

  startsWith(prefix) {
    return Boolean(this._traverse(prefix));
  }

  _traverse(str) {
    let node = this._root;
    for (const ch of str) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  wordsWithPrefix(prefix) {
    const node = this._traverse(prefix);
    if (!node) return [];
    const results = [];
    this._collect(node, prefix, results);
    return results;
  }

  _collect(node, current, results) {
    if (node.isEnd) results.push(current);
    for (const [ch, child] of Object.entries(node.children)) {
      this._collect(child, current + ch, results);
    }
  }
}

module.exports = { Trie, TrieNode };
