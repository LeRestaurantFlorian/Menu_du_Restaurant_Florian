// test_db.js
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DATABASE_PATH || './restaurant.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connecté à la base SQLite:', dbPath);
  }
});

db.serialize(() => {
  db.all('SELECT * FROM menu', (err, rows) => {
    if (err) {
      console.error('❌ Erreur lors de la requête SELECT:', err.message);
      process.exit(1);
    }
    console.log(`Nombre d'éléments dans la table menu : ${rows.length}`);
    console.log('Données:', rows);
    db.close();
  });
});
