/**
 * Trie data structure for efficient word storage and lookup
 * Ported from Java implementation
 */
export class Trie {
  static NUM_LETTERS = 26;

  constructor() {
    this.nodes = new Array(Trie.NUM_LETTERS).fill(null);
  }

  /**
   * Add a word to the trie
   * @param {string} str - Word to add (uppercase)
   */
  add(str) {
    let ptr = this;
    for (const c of str) {
      const ix = c.charCodeAt(0) - 'A'.charCodeAt(0);
      if (ix < 0 || ix >= Trie.NUM_LETTERS) {
        throw new Error(`Invalid character: ${c}`);
      }
      if (!ptr.nodes[ix]) {
        ptr.nodes[ix] = new Trie();
      }
      ptr = ptr.nodes[ix];
    }
  }

  /**
   * Check if a word exists in the trie
   * @param {string} str - Word to check
   * @returns {boolean}
   */
  has(str) {
    let ptr = this;
    for (const c of str) {
      const ix = c.charCodeAt(0) - 'A'.charCodeAt(0);
      if (ix < 0 || ix >= Trie.NUM_LETTERS) return false;
      if (!ptr.nodes[ix]) return false;
      ptr = ptr.nodes[ix];
    }
    return true;
  }

  /**
   * Get child node at index
   * @param {number} ix - Index (0-25)
   * @returns {Trie|null}
   */
  descend(ix) {
    return this.nodes[ix] || null;
  }

  /**
   * Check if node exists at index
   * @param {number} ix - Index (0-25)
   * @returns {boolean}
   */
  hasIx(ix) {
    return this.nodes[ix] !== null;
  }

  /**
   * Check if node exists for letter
   * @param {string} c - Letter
   * @returns {boolean}
   */
  hasLetter(c) {
    return this.nodes[c.charCodeAt(0) - 'A'.charCodeAt(0)] !== null;
  }

  /**
   * Create iterator for this trie
   * @returns {Trie.Iter}
   */
  iter() {
    return new Trie.Iter(this.nodes);
  }
}

/**
 * Iterator for Trie
 */
Trie.Iter = class Iter {
  constructor(nodes) {
    this.nodes = nodes;
    this.ix = -1;
  }

  /**
   * Move to next valid node
   * @returns {boolean} - True if there's a next node
   */
  next() {
    while (++this.ix < Trie.NUM_LETTERS) {
      if (this.nodes[this.ix] !== null) return true;
    }
    return false;
  }

  /**
   * Get current index
   * @returns {number}
   */
  getIx() {
    return this.ix;
  }

  /**
   * Get current letter
   * @returns {string}
   */
  getLetter() {
    return String.fromCharCode(this.ix + 'A'.charCodeAt(0));
  }

  /**
   * Get current node
   * @returns {Trie}
   */
  get() {
    return this.nodes[this.ix];
  }
};