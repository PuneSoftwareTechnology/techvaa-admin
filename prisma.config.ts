import "dotenv/config"; // Prisma 7 no longer auto-loads .env — load it here so
// env("DATABASE") resolves for migrate / db / studio commands.
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    // Seed runs on Node 20+; --env-file makes DATABASE available to the process.
    seed: "node --env-file=.env --import tsx prisma/seed.ts",
  },

  // Required for migration / introspection commands. The runtime PrismaClient
  // uses a driver adapter (see src/lib/prisma.ts) rather than this URL.
  datasource: {
    url: env("DATABASE"),
  },
});
