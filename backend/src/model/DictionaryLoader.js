/**
 * Dictionary loader for loading word frequencies and dictionary words
 * Ported from Java implementation
 */
import fs from 'fs';
import path from 'path';

/**
 * Load word frequencies from CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Map<string, number>>} - Map of word to frequency rank
 */
export async function loadFrequenciesFromFile(filePath) {
  const freqs = new Map();
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  let first = true;
  let rank = 0;
  
  for (const line of lines) {
    if (first) {
      first = false;
      continue;
    }
    const word = line.split(',')[0].toUpperCase();
    freqs.set(word, rank++);
  }
  
  return freqs;
}

/**
 * Load words from dictionary file into Trie
 * @param {string} filePath - Path to dictionary file
 * @param {number} length - Required word length
 * @param {Trie} trie - Trie to populate
 * @param {number} minFreq - Minimum frequency rank (0 for no limit)
 * @param {Map<string, number>} freqs - Frequency map
 * @param {Set<string>} banned - Set of banned words
 * @returns {Promise<number>} - Number of words loaded
 */
export async function loadWordsFromFile(filePath, length, trie, minFreq, freqs, banned) {
  let count = 0;
  const content = await fs.promises.readFile(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  for (const line of lines) {
    const word = line.trim().toUpperCase();
    if (word.length !== length || banned.has(word)) continue;
    if (minFreq > 0 && (!freqs.has(word) || freqs.get(word) > minFreq)) continue;
    trie.add(word);
    count++;
  }
  
  return count;
}