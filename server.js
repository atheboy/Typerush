/* ============================================
   TypeRush — Express + SQLite Backend
   ============================================ */

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== DATABASE SETUP ==========
const db = new Database(path.join(__dirname, 'typerush.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        wpm INTEGER NOT NULL,
        raw_wpm INTEGER DEFAULT 0,
        accuracy INTEGER NOT NULL,
        mode TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        duration REAL DEFAULT 0,
        correct_chars INTEGER DEFAULT 0,
        incorrect_chars INTEGER DEFAULT 0,
        total_chars INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wpm INTEGER NOT NULL,
        raw_wpm INTEGER DEFAULT 0,
        accuracy INTEGER NOT NULL,
        mode TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        duration REAL DEFAULT 0,
        correct_chars INTEGER DEFAULT 0,
        incorrect_chars INTEGER DEFAULT 0,
        session_id TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_scores_wpm ON scores(wpm DESC);
    CREATE INDEX IF NOT EXISTS idx_scores_mode ON scores(mode);
    CREATE INDEX IF NOT EXISTS idx_history_created ON history(created_at DESC);
`);

// ========== PREPARED STATEMENTS ==========
const stmts = {
    // Scores (Leaderboard)
    insertScore: db.prepare(`
        INSERT INTO scores (name, wpm, raw_wpm, accuracy, mode, difficulty, duration, correct_chars, incorrect_chars, total_chars)
        VALUES (@name, @wpm, @rawWpm, @accuracy, @mode, @difficulty, @duration, @correctChars, @incorrectChars, @totalChars)
    `),
    getAllScores: db.prepare(`
        SELECT * FROM scores ORDER BY wpm DESC LIMIT 100
    `),
    getScoresByMode: db.prepare(`
        SELECT * FROM scores WHERE mode = ? ORDER BY wpm DESC LIMIT 100
    `),
    deleteScore: db.prepare(`
        DELETE FROM scores WHERE id = ?
    `),
    getTopScores: db.prepare(`
        SELECT * FROM scores ORDER BY wpm DESC LIMIT 3
    `),

    // History
    insertHistory: db.prepare(`
        INSERT INTO history (wpm, raw_wpm, accuracy, mode, difficulty, duration, correct_chars, incorrect_chars, session_id)
        VALUES (@wpm, @rawWpm, @accuracy, @mode, @difficulty, @duration, @correctChars, @incorrectChars, @sessionId)
    `),
    getHistory: db.prepare(`
        SELECT * FROM history ORDER BY created_at DESC LIMIT 100
    `),
    getStats: db.prepare(`
        SELECT
            COUNT(*) as totalTests,
            COALESCE(ROUND(AVG(wpm)), 0) as avgWpm,
            COALESCE(MAX(wpm), 0) as bestWpm,
            COALESCE(ROUND(AVG(accuracy)), 0) as avgAccuracy,
            COALESCE(SUM(correct_chars), 0) as totalCharsTyped,
            COALESCE(ROUND(AVG(duration), 1), 0) as avgDuration
        FROM history
    `),
    getRecentHistory: db.prepare(`
        SELECT wpm, accuracy, mode, difficulty, created_at
        FROM history
        ORDER BY created_at DESC
        LIMIT ?
    `),
    clearHistory: db.prepare(`
        DELETE FROM history
    `)
};

// ========== API ROUTES ==========

// --- Leaderboard ---

// GET /api/scores — Get all leaderboard scores
app.get('/api/scores', (req, res) => {
    try {
        const { mode } = req.query;
        let scores;
        if (mode && mode !== 'all') {
            scores = stmts.getScoresByMode.all(mode);
        } else {
            scores = stmts.getAllScores.all();
        }
        res.json({ success: true, scores });
    } catch (err) {
        console.error('GET /api/scores error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch scores' });
    }
});

// POST /api/scores — Save a new score to leaderboard
app.post('/api/scores', (req, res) => {
    try {
        const { name, wpm, rawWpm, accuracy, mode, difficulty, duration, correctChars, incorrectChars, totalChars } = req.body;

        if (!name || typeof wpm !== 'number' || typeof accuracy !== 'number') {
            return res.status(400).json({ success: false, error: 'Missing required fields: name, wpm, accuracy' });
        }

        if (name.length > 30) {
            return res.status(400).json({ success: false, error: 'Name too long (max 30 characters)' });
        }

        const result = stmts.insertScore.run({
            name: name.trim(),
            wpm: Math.round(wpm),
            rawWpm: Math.round(rawWpm || 0),
            accuracy: Math.round(accuracy),
            mode: mode || 'time',
            difficulty: difficulty || 'easy',
            duration: duration || 0,
            correctChars: correctChars || 0,
            incorrectChars: incorrectChars || 0,
            totalChars: totalChars || 0
        });

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        console.error('POST /api/scores error:', err);
        res.status(500).json({ success: false, error: 'Failed to save score' });
    }
});

// DELETE /api/scores/:id — Delete a score
app.delete('/api/scores/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, error: 'Invalid ID' });
        }

        const result = stmts.deleteScore.run(id);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Score not found' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/scores error:', err);
        res.status(500).json({ success: false, error: 'Failed to delete score' });
    }
});

// --- History & Stats ---

// POST /api/history — Save a test result to history
app.post('/api/history', (req, res) => {
    try {
        const { wpm, rawWpm, accuracy, mode, difficulty, duration, correctChars, incorrectChars, sessionId } = req.body;

        if (typeof wpm !== 'number' || typeof accuracy !== 'number') {
            return res.status(400).json({ success: false, error: 'Missing required fields: wpm, accuracy' });
        }

        const result = stmts.insertHistory.run({
            wpm: Math.round(wpm),
            rawWpm: Math.round(rawWpm || 0),
            accuracy: Math.round(accuracy),
            mode: mode || 'time',
            difficulty: difficulty || 'easy',
            duration: duration || 0,
            correctChars: correctChars || 0,
            incorrectChars: incorrectChars || 0,
            sessionId: sessionId || null
        });

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        console.error('POST /api/history error:', err);
        res.status(500).json({ success: false, error: 'Failed to save history' });
    }
});

// GET /api/stats — Get aggregate statistics
app.get('/api/stats', (req, res) => {
    try {
        const stats = stmts.getStats.get();
        const limit = parseInt(req.query.limit) || 30;
        const history = stmts.getRecentHistory.all(Math.min(limit, 100));

        res.json({
            success: true,
            stats,
            history: history.reverse() // chronological order
        });
    } catch (err) {
        console.error('GET /api/stats error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

// DELETE /api/history — Clear all history
app.delete('/api/history', (req, res) => {
    try {
        stmts.clearHistory.run();
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/history error:', err);
        res.status(500).json({ success: false, error: 'Failed to clear history' });
    }
});

// --- Health check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// ========== SERVE FRONTEND ==========
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`\n  ⌨  TypeRush Server running at http://localhost:${PORT}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    db.close();
    process.exit(0);
});
