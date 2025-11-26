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

    // Create chats table
    console.log("Creating chats table...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "chats" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" TEXT,
        "content" TEXT NOT NULL,
        "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure tasks has chat_id column
    const infoTasks = await client.execute("PRAGMA table_info('tasks')");
    const taskColumns = infoTasks.rows.map((r) => r.name);
    if (!taskColumns.includes('chat_id')) {
      console.log('Adding chat_id column to tasks table...');
      await client.execute(`ALTER TABLE tasks ADD COLUMN "chat_id" INTEGER`);
    }

    // Create unique index on chat_id to enforce 1-to-1 relation
    console.log('Creating unique index on tasks.chat_id...');
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "tasks_chat_id_key" ON "tasks"("chat_id")
    `);

    // Ensure foreign key constraint exists. SQLite doesn't allow adding FK with ALTER TABLE,
    // so recreate the table with the FK if it's missing.
    const fkInfo = await client.execute("PRAGMA foreign_key_list('tasks')");
    const hasChatFk = fkInfo.rows.some((r) => r.table === 'chats');
    if (!hasChatFk) {
      console.log('Adding foreign key constraint from tasks.chat_id -> chats.id by recreating table...');

      // Use the client's transaction API so all statements run in the same transaction
      await client.transaction(async (tx) => {
        await tx.execute(`PRAGMA foreign_keys = OFF`);

        await tx.execute(`
          CREATE TABLE IF NOT EXISTS "_tasks_new" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "title" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "steps" TEXT,
            "estimated_time" TEXT NOT NULL,
            "author_id" INTEGER,
            "chat_id" INTEGER UNIQUE,
            "implementation_suggestion" TEXT,
            "acceptance_criteria" TEXT,
            "suggested_tests" TEXT,
            "content" TEXT,
            "chat_history" TEXT,
            "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "tasks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
            CONSTRAINT "tasks_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          )
        `);

        // Copy existing data (include columns that may exist)
        const existingCols = taskColumns.filter((c) => [
          'id','title','description','steps','estimated_time','author_id','chat_id','implementation_suggestion',
          'acceptance_criteria','suggested_tests','content','chat_history','created_at','updated_at'
        ].includes(c));
        const colsList = existingCols.map((c) => `"${c}"`).join(',');

        if (existingCols.length > 0) {
          await tx.execute(`
            INSERT INTO "_tasks_new" (${colsList})
            SELECT ${colsList} FROM "tasks"
          `);
        }

        await tx.execute(`DROP TABLE IF EXISTS "tasks"`);
        await tx.execute(`ALTER TABLE "_tasks_new" RENAME TO "tasks"`);

        await tx.execute(`PRAGMA foreign_keys = ON`);
      });

      // Recreate trigger for updated_at on the new table (outside transaction)
      await client.execute(`
        CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
        AFTER UPDATE ON tasks
        FOR EACH ROW
        BEGIN
          UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `);
    }

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

