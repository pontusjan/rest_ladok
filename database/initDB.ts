// database/initDB.ts

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
  // Open the database
  const db = await open({
    filename: './database/database.sqlite',
    driver: sqlite3.Database,
  });

  // Create the 'results' table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnummer TEXT NOT NULL,
      kurskod TEXT NOT NULL,
      modul TEXT NOT NULL,
      datum TEXT NOT NULL,
      betyg TEXT NOT NULL,
      UNIQUE(personnummer, kurskod, modul)
    )
  `);

  console.log('Database initialized and "results" table is ready.');

  // Close the database connection
  await db.close();
})();