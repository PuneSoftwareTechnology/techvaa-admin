import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 removed the bundled Rust query engine, so a driver adapter is
// mandatory. We use node-postgres (`@prisma/adapter-pg`) over TCP against the
// same Neon database the public site uses.
const connectionString = process.env.DATABASE;
if (!connectionString) {
  throw new Error("Missing DATABASE connection string in environment");
}

const adapter = new PrismaPg({ connectionString });

// Neon suspends the compute when the database is idle. The first query after a
// wake-up can fail with a transient connection error (e.g. `ETIMEDOUT`) while
// the compute boots; the next attempt, against the now-warm compute, succeeds.
// Routes that fan out several queries via `Promise.all` turn that single blip
// into a 500, so we retry transient errors here, once, for every operation.
const TRANSIENT = /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE|Connection terminated|server closed the connection|Can't reach database server/i;

function isTransient(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { code, message } = error as { code?: string; message?: string };
  // Driver-level errno (surfaced by node-postgres) and Prisma's connection codes.
  if (code && /^(ETIMEDOUT|ECONNRESET|ECONNREFUSED|EPIPE|P1001|P1002|P1017)$/.test(code))
    return true;
  return typeof message === "string" && TRANSIENT.test(message);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Reuse a single client across hot reloads in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const base =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = base;
}

// Retry transient connection failures with a short backoff. The cold-start
// failure happens at connection time, before the statement runs, so retrying
// is safe for reads and writes alike.
export const prisma = base.$extends({
  query: {
    async $allOperations({ args, query }) {
      const maxAttempts = 3;
      let lastError: unknown;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          return await query(args);
        } catch (error) {
          lastError = error;
          if (attempt === maxAttempts - 1 || !isTransient(error)) throw error;
          await sleep(150 * 2 ** attempt); // 150ms, 300ms
        }
      }
      throw lastError;
    },
  },
});
