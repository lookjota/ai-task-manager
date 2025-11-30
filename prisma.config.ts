import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use process.env with a sensible fallback so `prisma generate` can run during container builds
// when DATABASE_URL is not provided as a build-time env var.
const databaseUrl = process.env.DATABASE_URL || 'file:./database/database.sqlite';

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },


  // migrate: {
  //   async adapter(env) {
  //     return new PrismaLibSQL({
  //       url: env.TURSO_DATABASE_URL,
  //       authToken: env.TURSO_AUTH_TOKEN,
  //     });
  //   }
  // }
});
