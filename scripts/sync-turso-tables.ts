import "dotenv/config";
import { createClient } from "@libsql/client";

const databaseUrl = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!databaseUrl || !authToken) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});


async function syncTables() {
  try {
    console.log("Connecting to Turso...");
    
    // Create users table
    console.log("Creating users table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "email" TEXT NOT NULL,
        "age" INTEGER,
        "name" TEXT
      )
    `);
    
    // Create unique index on email
    console.log("Creating email index...");
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")
    `);
    
    // Create posts table
    console.log("Creating posts table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" TEXT NOT NULL,
        "content" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "author_id" INTEGER NOT NULL,
        CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") 
        REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    console.log("✅ Tables created successfully!");
    
    // Verify tables were created
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    );
    console.log("\n📋 Tables in database:", tables.rows.map((r) => r.name));
    
    await client.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

syncTables();

