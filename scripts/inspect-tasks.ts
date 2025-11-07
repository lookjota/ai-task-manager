import "dotenv/config";
import { createClient } from "@libsql/client";

const databaseUrl = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!databaseUrl || !authToken) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

const client = createClient({ url: databaseUrl, authToken });

async function inspect() {
  try {
    const res = await client.execute("PRAGMA table_info('tasks')");
    console.log('tasks table columns:');
    console.table(res.rows.map((r: any) => r));
    await client.close();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

inspect();