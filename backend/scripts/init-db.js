const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'init.sql'), 'utf8');
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await db.query(statement);
  }

  console.log('Database initialized successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to initialize database:', err.message);
  process.exit(1);
});
