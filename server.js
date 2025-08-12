// server.js - API Restaurant avec SQLite et Express

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Utiliser disque persistant si dispo, sinon fichier local
const dbPath = process.env.DATABASE_PATH || './restaurant.db';

app.use(cors());
app.use(express.json());

// Connexion à SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erreur DB :", err.message);
  else console.log(`Base SQLite connectée à ${dbPath}`);
});

// Création des tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prix REAL,
    categorie TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS commandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    items TEXT
  )`);
});

// --- Routes Menu ---
app.get('/menu', (req, res) => {
  db.all('SELECT * FROM menu', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/menu', (req, res) => {
  const { nom, prix, categorie } = req.body;
  db.run('INSERT INTO menu (nom, prix, categorie) VALUES (?, ?, ?)', [nom, prix, categorie], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nom, prix, categorie });
  });
});

app.delete('/menu/:id', (req, res) => {
  db.run('DELETE FROM menu WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- Routes Commandes ---
app.get('/commandes', (req, res) => {
  db.all('SELECT * FROM commandes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(cmd => ({
      ...cmd,
      items: JSON.parse(cmd.items)
    })));
  });
});

app.post('/commandes', (req, res) => {
  const { items } = req.body;
  const date = new Date().toISOString();
  db.run('INSERT INTO commandes (date, items) VALUES (?, ?)', [date, JSON.stringify(items)], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, date, items });
  });
});

app.delete('/commandes/:id', (req, res) => {
  db.run('DELETE FROM commandes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// --- Test route ---
app.get('/', (req, res) => {
  res.send('API Restaurant OK 🚀');
});

// Lancement
app.listen(port, () => {
  console.log(`Serveur API Restaurant lancé sur le port ${port}`);
});
