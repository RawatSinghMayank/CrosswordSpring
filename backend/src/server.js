/**
 * Main Express server for Crossword Solver API
 */
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Trie } from './model/Trie.js';
import { loadFrequenciesFromFile, loadWordsFromFile } from './model/DictionaryLoader.js';
import { CrosswordGenerator } from './model/CrosswordGenerator.js';
import { CrosswordSolver } from './service/CrosswordSolver.js';
import { extractWords } from './util/CrosswordGridParser.js';
import { extractWordsWithClues } from './util/CrosswordClueBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for generated grids (replaces MySQL database)
let generatedGrids = [];
let randomFinalGrid = null;

// Initialize dictionaries and generate crosswords on startup
async function initialize() {
  try {
    console.log('Loading dictionaries...');
    
    const freqPath = path.join(__dirname, 'dictionaries', 'ngram_freq_dict.csv');
    const dictPath = path.join(__dirname, 'dictionaries', 'scrabble_words');
    
    const freqs = await loadFrequenciesFromFile(freqPath);
    console.log(`Loaded ${freqs.size} word frequencies`);
    
    const hTrie = new Trie();
    const hCount = await loadWordsFromFile(
      dictPath,
      CrosswordGenerator.SIZE_W,
      hTrie,
      CrosswordGenerator.MIN_FREQ_W,
      freqs,
      new Set()
    );
    console.log(`Loaded ${hCount} horizontal words`);
    
    const vTrie = new Trie();
    const vCount = await loadWordsFromFile(
      dictPath,
      CrosswordGenerator.SIZE_H,
      vTrie,
      CrosswordGenerator.MIN_FREQ_H,
      freqs,
      new Set()
    );
    console.log(`Loaded ${vCount} vertical words`);
    
    console.log('Generating crosswords...');
    const generator = new CrosswordGenerator(hTrie, vTrie);
    generatedGrids = generator.solveAndReturnGrids();
    console.log(`Generated ${generatedGrids.length} crossword grids`);
    
    if (generatedGrids.length > 0) {
      randomFinalGrid = generatedGrids[0];
    }
    
    console.log('Server ready!');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// API Routes

/**
 * GET /api/crossword/generate
 * Generate new crosswords
 */
app.get('/api/crossword/generate', async (req, res) => {
  try {
    // Re-initialize to generate new grids
    const freqPath = path.join(__dirname, 'dictionaries', 'ngram_freq_dict.csv');
    const dictPath = path.join(__dirname, 'dictionaries', 'scrabble_words');
    
    const freqs = await loadFrequenciesFromFile(freqPath);
    
    const hTrie = new Trie();
    await loadWordsFromFile(dictPath, CrosswordGenerator.SIZE_W, hTrie, CrosswordGenerator.MIN_FREQ_W, freqs, new Set());
    
    const vTrie = new Trie();
    await loadWordsFromFile(dictPath, CrosswordGenerator.SIZE_H, vTrie, CrosswordGenerator.MIN_FREQ_H, freqs, new Set());
    
    const generator = new CrosswordGenerator(hTrie, vTrie);
    generatedGrids = generator.solveAndReturnGrids();
    
    if (generatedGrids.length > 0) {
      randomFinalGrid = generatedGrids[0];
    }
    
    res.json(generatedGrids);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/crossword/random
 * Get a random crossword grid
 */
app.get('/api/crossword/random', (req, res) => {
  if (randomFinalGrid) {
    res.type('text/plain').send(randomFinalGrid);
  } else if (generatedGrids.length > 0) {
    randomFinalGrid = generatedGrids[Math.floor(Math.random() * generatedGrids.length)];
    res.type('text/plain').send(randomFinalGrid);
  } else {
    res.status(404).send('No grids available in the database.');
  }
});

/**
 * GET /api/crossword/random/details
 * Get random crossword with horizontal/vertical words
 */
app.get('/api/crossword/random/details', (req, res) => {
  const grid = randomFinalGrid || (generatedGrids.length > 0 ? generatedGrids[0] : null);
  
  if (!grid) {
    return res.json({ message: 'No grids available in the database.' });
  }
  
  const result = extractWords(grid);
  res.json(result);
});

/**
 * GET /api/crossword/random/clues
 * Get random crossword with clues
 */
app.get('/api/crossword/random/clues', async (req, res) => {
  try {
    // Get a random grid from generated grids
    if (generatedGrids.length === 0) {
      return res.json({ message: 'No grids available in the database.' });
    }
    
    const grid = generatedGrids[Math.floor(Math.random() * generatedGrids.length)];
    randomFinalGrid = grid;
    
    const result = await extractWordsWithClues(grid);
    res.json(result);
  } catch (error) {
    console.error('Clues error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/crossword/solve/steps
 * SSE endpoint for solver steps
 */
app.get('/api/crossword/solve/steps', async (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  try {
    // Get random crossword details
    if (generatedGrids.length === 0) {
      res.write(`event: solver-update\n`);
      res.write(`data: ${JSON.stringify({ error: 'No grids available' })}\n\n`);
      res.end();
      return;
    }

    const grid = generatedGrids[Math.floor(Math.random() * generatedGrids.length)];
    randomFinalGrid = grid;
    
    const details = extractWords(grid);
    const horizontalWords = details.horizontal;
    const verticalWords = details.vertical;

    // Combine and shuffle words
    const allWords = [...horizontalWords, ...verticalWords];
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }

    // Create initial empty grid (5x5)
    const initialGrid = Array(5).fill(null).map(() => Array(5).fill('-'));

    // Set up solver
    const solver = new CrosswordSolver();
    solver.setSize(5);

    let stepIndex = 0;

    // Listener for solver updates
    const listener = (gridState, step, action) => {
      // Convert grid to array of strings
      const gridStrings = gridState.map(row => row.join(''));

      const event = {
        grid: gridStrings,
        step: step,
        action: action
      };

      res.write(`event: solver-update\n`);
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    // Start solving in async manner
    const solvePromise = new Promise((resolve) => {
      setImmediate(() => {
        solver.crosswordPuzzle(initialGrid, allWords, listener);
        resolve();
      });
    });

    await solvePromise;
    
    // Send completion
    res.write(`event: solver-update\n`);
    res.write(`data: ${JSON.stringify({ action: 'completed' })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('SSE error:', error);
    res.write(`event: solver-update\n`);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }

  // Handle client disconnect
  req.on('close', () => {
    console.log('Client disconnected from SSE');
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', grids: generatedGrids.length });
});

// Start server
initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Crossword Solver API running on http://localhost:${PORT}`);
  });
});