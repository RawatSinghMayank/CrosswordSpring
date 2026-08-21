/**
 * Crossword Grid Parser - extracts words from grid
 * Ported from Java implementation
 */

/**
 * Extract horizontal and vertical words from grid string
 * @param {string} gridStr - Grid as string with newlines
 * @returns {Object} - Object with grid, horizontal, and vertical arrays
 */
export function extractWords(gridStr) {
  const rows = gridStr.trim().split('\n');
  const numRows = rows.length;
  const numCols = rows[0].length;

  const grid = rows.map(row => row.split(''));

  const horizontalWords = [];
  const verticalWords = [];

  // Extract horizontal words
  for (const row of grid) {
    horizontalWords.push(row.join(''));
  }

  // Extract vertical words
  for (let col = 0; col < numCols; col++) {
    let sb = '';
    for (let row = 0; row < numRows; row++) {
      sb += grid[row][col];
    }
    verticalWords.push(sb);
  }

  return {
    grid: horizontalWords,
    horizontal: horizontalWords,
    vertical: verticalWords
  };
}