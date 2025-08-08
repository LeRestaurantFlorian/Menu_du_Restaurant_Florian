// backend.js - Serveur Node.js + Express + SQLite pour gérer menu et commandes

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
const db = new sqlite3.Database('./restaurant.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connecté à la base SQLite.');
});

// Création des tables si elles n'existent pas
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
    res.json({ id: this.lastID, nom, prix, categorie });
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
    res.json({ id: this.lastID, date, items });
  });
});

app.delete('/commandes/:id', (req, res) => {
  db.run('DELETE FROM commandes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur API Restaurant lancé sur http://localhost:${port}`);
});
fetch('http://localhost:3000/menu')
  .then(res => res.json())
  .then(data => console.log(data));
  fetch('http://localhost:3000/commandes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: panier })
});