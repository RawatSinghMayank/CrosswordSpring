/**
 * Crossword Clue Builder - fetches definitions from dictionary API
 * Ported from Java implementation
 */
import fetch from 'node-fetch';

/**
 * Fetch a single definition from dictionary API
 * @param {string} word - Word to get clue for
 * @returns {Promise<string>} - Definition or fallback message
 */
export async function getClue(word) {
  try {
    const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
    const response = await fetch(apiURL);
    
    if (!response.ok) return 'No clue found';
    
    const data = await response.json();
    const first = data[0];
    const meanings = first.meanings;
    const definitions = meanings[0].definitions;
    
    return definitions[0].definition;
  } catch (error) {
    return 'No clue found';
  }
}

/**
 * Extract words with clues from grid string
 * @param {string} gridStr - Grid as string with newlines
 * @returns {Promise<Object>} - Object with grid, horizontal clues, vertical clues
 */
export async function extractWordsWithClues(gridStr) {
  const rows = gridStr.trim().split('\n');
  const numRows = rows.length;
  const numCols = rows[0].length;

  const grid = rows.map(row => row.split(''));

  const gridLines = [];
  const horizontalClues = {};
  const verticalClues = {};

  // Horizontal words with clues
  for (const row of grid) {
    const word = row.join('');
    gridLines.push(word);
    horizontalClues[word] = await getClue(word);
  }

  // Vertical words with clues
  for (let col = 0; col < numCols; col++) {
    let sb = '';
    for (let row = 0; row < numRows; row++) {
      sb += grid[row][col];
    }
    const word = sb;
    verticalClues[word] = await getClue(word);
  }

  return {
    grid: gridLines,
    horizontal: horizontalClues,
    vertical: verticalClues
  };
}