# 🧩 Crossword Crafter – Crossword Puzzle Generator & Solver
### Algorithmic Word Placement and Optimization using Spring Boot + React

![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Algorithms](https://img.shields.io/badge/Algorithms-Backtracking-orange)
![Deployment](https://img.shields.io/badge/Deployment-Netlify%20%7C%20Render-purple)
![Database](https://img.shields.io/badge/Database-Railway-red)
![Status](https://img.shields.io/badge/Status-Active-success)

🔗 **Live Demo:**  
https://crosswordcrafter-crosswordpuzzlegeneratorsolver.ai.studio/

⚠️ **Note:**  
The backend is hosted on **Render** and the database on **Railway**.  
Due to cold starts on free hosting, the application may take a few seconds to load initially.

▶ **Demo Video:**  
https://youtu.be/BRvVmrBjKVs?feature=shared

---

## 📖 Overview
**Crossword Crafter** is a full-stack web application that automatically generates and solves crossword puzzles using algorithmic word placement.

The project combines:
- Full-stack engineering
- Algorithmic problem solving
- Efficient data structure usage
- Interactive puzzle UI

It demonstrates both **software engineering skills** and **core computer science concepts**, including search, recursion, and constraint-based placement.

---

## ✨ Key Features
- 🧠 Automatic crossword grid generation
- 📐 Optimized word placement with conflict minimization
- 🔁 Recursive backtracking puzzle solving
- 🔎 Efficient word search using Trie structure
- ⚡ Interactive frontend puzzle interface
- 🌐 Fully deployed online

---

## 🧮 Algorithms Used
- Recursion & Backtracking
- Depth First Search (DFS)
- Constraint-based placement logic
- Trie-based dictionary lookup

---

## 🗂 Data Structures Used
- Trie
- HashMap / Map
- Lists
- 2D Grid structures

---

## 🏗 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- REST API integration

### Backend
- Spring Boot
- Spring Data JPA
- RESTful APIs
- Puzzle generation engine

### Database
- Hosted on Railway

### Deployment
- Frontend: Netlify
- Backend: Render

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
Make sure you have:

- Java 21+
- Node.js & npm
- Maven
- Git

---

## 🔧 Backend and Frontend Setup

```bash
# Clone repository
git clone https://github.com/RawatSinghMayank/CrosswordSpring.git

# Navigate to backend folder
cd CrosswordSpring/CrosswordFrontendBackend/backend

# Build project
mvn clean install

# Run backend
mvn spring-boot:run

# Frontend Setup
# Navigate to frontend folder
cd CrosswordSpring/CrosswordFrontendBackend/frontend

# Install dependencies
npm install

# Start frontend
npm run dev
