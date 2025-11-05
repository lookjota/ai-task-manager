import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
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
