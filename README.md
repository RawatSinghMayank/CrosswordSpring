# 🧩 Crossword Crafter – Crossword Puzzle Generator & Solver
### Algorithmic Word Placement and Optimization using Node.js + React

![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Algorithms](https://img.shields.io/badge/Algorithms-Backtracking-orange)
![Deployment](https://img.shields.io/badge/Deployment-Netlify%20%7C%20Render-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

🔗 **Live Demo:**  
https://crosswordcrafter-crosswordpuzzlegeneratorsolver.ai.studio/

⚠️ **Note:**  
The backend is hosted on **Render**. Due to cold starts on free hosting, the application may take a few seconds to load initially.

▶ **Demo Video:**  
https://youtu.be/BRvVmrBjKVs?feature=shared

---

## 📖 Overview
**Crossword Crafter** is a full-stack web application that automatically generates and solves crossword puzzles using algorithmic word placement and recursive backtracking.

The project combines:
- Full-stack engineering
- Algorithmic problem solving
- Efficient data structure usage
- Constraint-based word placement
- Interactive puzzle visualization

It demonstrates both **software engineering skills** and **core computer science concepts**, including Trie-based searching, recursion, depth-first search, and constraint satisfaction.

---

## ✨ Key Features
- 🧠 Automatic crossword grid generation
- 📐 Optimized word placement with conflict and constraint checking
- 🔁 Recursive backtracking puzzle solving
- 🔎 Efficient word and prefix lookup using a Trie
- ⚡ Step-by-step solver visualization using Server-Sent Events (SSE)
- 🎲 Random crossword generation
- 📝 Horizontal and vertical word extraction
- 💡 Automatic clue generation using Dictionary API
- ⚛️ Interactive React-based crossword interface
- 🌐 Fully deployed online

---

## 🧮 Algorithms Used
- Recursion & Backtracking
- Depth First Search (DFS)
- Trie-based prefix and word lookup
- Constraint-based word placement
- Grid traversal and word extraction

---

## 🗂 Data Structures Used
- Trie
- HashMap / Map
- Set
- Lists / Arrays
- 2D Grid structures

---

## 🏗 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- Fetch API
- EventSource / Server-Sent Events (SSE)

### Backend
- Node.js
- Express.js
- CORS
- RESTful APIs
- Server-Sent Events (SSE)

### Algorithms & Core Logic
- Trie
- Backtracking
- DFS
- Constraint checking
- Crossword grid generation and solving

### External API
- Dictionary API for crossword clues

### Deployment
- Frontend: Netlify
- Backend: Render

---

## 🏗 Architecture

```text
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │  Vite + Tailwind CSS │
                    └──────────┬───────────┘
                               │
                         REST API / SSE
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       CrosswordGenerator  CrosswordSolver  DictionaryLoader
              │                │                │
              ▼                ▼                ▼
             Trie       Backtracking / DFS   Dictionary Files
                               │
                               ▼
                         Solver Steps
                            via SSE
```

---

## 📁 Project Structure

```text
CrosswordCrafter-CrosswordPuzzleGeneratorSolver/
├── backend/
│   ├── src/
│   │   ├── model/
│   │   │   ├── Trie.js
│   │   │   ├── DictionaryLoader.js
│   │   │   └── CrosswordGenerator.js
│   │   ├── service/
│   │   │   └── CrosswordSolver.js
│   │   ├── util/
│   │   │   ├── CrosswordGridParser.js
│   │   │   └── CrosswordClueBuilder.js
│   │   ├── dictionaries/
│   │   │   ├── ngram_freq_dict.csv
│   │   │   └── scrabble_words
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    └── frontend/
        ├── src/
        ├── public/
        ├── package.json
        └── vite.config.js
```

---

## ⚡ Getting Started (Local Setup)

### Prerequisites

Make sure you have:

- Node.js 18+
- npm
- Git

You can verify your installation with:

```bash
node --version
npm --version
git --version
```

---

## 🔧 Backend and Frontend Setup

### 1. Clone the repository

```bash
git clone https://github.com/RawatSinghMayank/CrosswordSpring.git
cd CrosswordSpring
```

### 2. Start the Node.js backend

```bash
cd backend
npm install
npm start
```

The backend runs at:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

For development with automatic restart:

```bash
npm run dev
```

### 3. Start the React frontend

Open another terminal from the project root:

```bash
cd frontend/frontend
npm install
npm run dev
```

The frontend uses the backend URL through the environment variable:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🔌 Backend API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Backend health check |
| `/api/crossword/generate` | GET | Generate crossword grids |
| `/api/crossword/random` | GET | Get a random crossword grid |
| `/api/crossword/random/details` | GET | Get grid with horizontal/vertical words |
| `/api/crossword/random/clues` | GET | Get crossword words with clues |
| `/api/crossword/solve/steps` | GET | Stream solver steps using SSE |

---

## 🧠 How the Crossword Generator Works

The crossword generator uses a **Trie + recursive backtracking** approach.

1. Dictionary words are loaded into memory.
2. Words are stored in a Trie for efficient lookup.
3. Candidate words are selected according to the crossword constraints.
4. A word is placed on the grid only when its placement is valid.
5. The algorithm recursively continues with the next word.
6. If a placement leads to a dead end, the algorithm backtracks and tries another candidate.
7. The resulting grid is returned to the React frontend through the Node.js API.

This allows the project to demonstrate a practical application of **DFS, recursion, backtracking, Trie data structures, and constraint satisfaction**.

---

## 🔄 Solver Visualization

The solver exposes an **SSE endpoint** that streams intermediate solving states to the frontend.

```text
React Frontend
      │
      │ EventSource
      ▼
Node.js + Express
      │
      ▼
Backtracking Solver
      │
      ├── Try placement
      ├── Validate constraints
      ├── Continue recursively
      ├── Backtrack on failure
      └── Stream current state
             │
             ▼
       React visualization
```

This provides a step-by-step visualization of how the recursive backtracking algorithm searches for a solution.

---

## 🌐 Deployment

### Frontend

The React frontend can be deployed on **Netlify**.

Set the environment variable to the deployed backend URL:

```env
VITE_API_URL=https://<your-node-backend>.onrender.com
```

### Backend

The Node.js + Express backend is deployed on **Render**.

Recommended Render configuration:

```text
Build Command: npm install
Start Command: npm start
```

The backend listens on the port provided by Render through the `PORT` environment variable.

---

## 🎯 Project Highlights

- Implemented a **Trie** for efficient dictionary and prefix lookup.
- Implemented **recursive backtracking** for crossword generation and solving.
- Added **constraint validation** before committing word placements.
- Built a **Node.js + Express REST API** for the crossword engine.
- Implemented **Server-Sent Events (SSE)** for real-time solver visualization.
- Integrated an external **Dictionary API** for automatic crossword clues.
- Built an interactive **React.js** frontend for puzzle generation and solving.

---

## 📌 Future Improvements

- Add persistent storage for generated puzzles
- Improve crossword generation heuristics
- Add difficulty levels
- Add user accounts and saved puzzles
- Add more advanced clue generation
- Improve solver performance for larger grids

---

## 👨‍💻 Author

**Mayank Singh Rawat**

Built as a full-stack project demonstrating **Data Structures, Algorithms, Backend Development, and React.js**.
