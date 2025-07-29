import fs from 'fs';
import path from 'path';
import pool from './index';

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).sort(); // Ensure order

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
    } catch (error) {
      console.error(`Error in migration ${file}:`, error);
      process.exit(1); // Stop if a migration fails
    }
  }

  console.log('✅ All migrations executed');
  await pool.end();
}

runMigrations();
