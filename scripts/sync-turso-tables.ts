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
    
    // Create tasks table
    console.log("Creating tasks table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "steps" TEXT,
        "estimated_time" TEXT NOT NULL,
        "implementation_suggestion" TEXT,
        "acceptance_criteria" TEXT,
        "suggested_tests" TEXT,
        "content" TEXT,
        "chat_history" TEXT,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // If the existing table was created before adding author_id, add the column now.
    const info = await client.execute("PRAGMA table_info('tasks')");
    const columns = info.rows.map((r) => r.name);
    if (!columns.includes('author_id')) {
      console.log('Adding author_id column to tasks table...');
      await client.execute(`ALTER TABLE tasks ADD COLUMN "author_id" INTEGER`);
    }
    
    // Create trigger to update updated_at automatically
    console.log("Creating trigger for updated_at...");
    await client.execute(`
      CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
      AFTER UPDATE ON tasks
      FOR EACH ROW
      BEGIN
        UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
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

