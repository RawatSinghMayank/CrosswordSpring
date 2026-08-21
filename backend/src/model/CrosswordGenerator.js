/**
 * Crossword Generator - generates valid crossword grids using trie-based search
 * Ported from Java implementation
 */
import { Trie } from './Trie.js';

export class CrosswordGenerator {
  static SIZE_W = 5;
  static SIZE_H = 5;
  static MIN_FREQ_W = 20000;
  static MIN_FREQ_H = 20000;
  static UNIQUE = true;
  static DIAGONALS = false;

  static VTRIE_SIZE = CrosswordGenerator.DIAGONALS ? CrosswordGenerator.SIZE_W + 2 : CrosswordGenerator.SIZE_W;

  constructor(hTrie, vTrie) {
    this.horizontalTrie = hTrie;
    this.verticalTrie = vTrie;
    this.grid = new Array(CrosswordGenerator.SIZE_H * CrosswordGenerator.SIZE_W);
    this.generatedGrids = [];
  }

  /**
   * Solve and return all valid grids
   * @returns {string[]} - Array of grid strings
   */
  solveAndReturnGrids() {
    const vTries = new Array(CrosswordGenerator.VTRIE_SIZE).fill(this.verticalTrie);
    this.boxSearch(this.horizontalTrie, vTries, 0);
    return this.generatedGrids;
  }

  /**
   * Recursive box search algorithm
   * @param {Trie} trie - Current horizontal trie
   * @param {Trie[]} vTries - Vertical tries array
   * @param {number} pos - Current position in grid
   */
  boxSearch(trie, vTries, pos) {
    const v_ix = pos % CrosswordGenerator.SIZE_W;

    if (v_ix === 0) {
      if (pos === CrosswordGenerator.SIZE_H * CrosswordGenerator.SIZE_W) {
        this.collectGrid();
        return;
      }
      trie = this.horizontalTrie;
    }

    const iter = trie.iter();
    while (iter.next()) {
      if (!vTries[v_ix].hasIx(iter.getIx())) continue;
      this.grid[pos] = iter.getLetter();

      const backupV = vTries[v_ix];
      vTries[v_ix] = vTries[v_ix].descend(iter.getIx());

      this.boxSearch(iter.get(), vTries, pos + 1);
      vTries[v_ix] = backupV;
    }
  }

  /**
   * Collect the current grid as a string
   */
  collectGrid() {
    if (CrosswordGenerator.UNIQUE && CrosswordGenerator.SIZE_W === CrosswordGenerator.SIZE_H) {
      for (let i = 0; i < CrosswordGenerator.SIZE_H; i++) {
        let same = 0;
        for (let j = 0; j < CrosswordGenerator.SIZE_W; j++) {
          if (this.grid[i * CrosswordGenerator.SIZE_W + j] === this.grid[j * CrosswordGenerator.SIZE_W + i]) {
            same++;
          }
        }
        if (same === CrosswordGenerator.SIZE_W) return;
      }
    }

    let sb = '';
    for (let i = 0; i < CrosswordGenerator.SIZE_H; i++) {
      for (let j = 0; j < CrosswordGenerator.SIZE_W; j++) {
        sb += this.grid[i * CrosswordGenerator.SIZE_W + j];
      }
      sb += '\n';
    }
    this.generatedGrids.push(sb);
  }
}