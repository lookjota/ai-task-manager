import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required");
  process.exit(1);
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function resetDatabase() {
  try {
    console.log("Disabling foreign keys...");
    await client.execute("PRAGMA foreign_keys = OFF;");

    console.log("Dropping all tables...");
    
    // Get all tables
    const result = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );

    // Drop all tables
    for (const row of result.rows) {
      const tableName = (row as any)[0];
      console.log(`Dropping table: ${tableName}`);
      try {
        await client.execute(`DROP TABLE IF EXISTS "${tableName}"`);
      } catch (e) {
        console.log(`  Warning dropping ${tableName}:`, (e as any).message);
      }
    }

    console.log("Re-enabling foreign keys...");
    await client.execute("PRAGMA foreign_keys = ON;");

    console.log("Reading migration SQL...");
    const migrationSQL = fs.readFileSync(
      "prisma/migrations/20251030143443_init/migration.sql",
      "utf-8"
    );

    console.log("Executing migration...");
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      try {
        await client.execute(statement);
      } catch (e) {
        console.error(`  Error executing statement: ${(e as any).message}`);
        throw e;
      }
    }

    console.log("✅ Database reset successful!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error resetting database:", err);
    process.exit(1);
  }
}

resetDatabase();
