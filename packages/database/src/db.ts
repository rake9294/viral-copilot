import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import * as relations from "./relations.js";

export type DbClient = ReturnType<typeof createDbClient>;

const globalForDb = globalThis as unknown as {
  dbClient: DbClient | undefined;
};

export function createDbClient(url?: string) {
  const connectionString = url ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Provide a URL or set the DATABASE_URL environment variable.",
    );
  }

  const queryClient = postgres(connectionString, {
    prepare: false,
  });

  const db = drizzle(queryClient, {
    schema: { ...schema, ...relations },
    logger: process.env.NODE_ENV === "development",
  });

  return db;
}

/**
 * Singleton database client. Lazily initialised on first call.
 * Use this in production services; use createDbClient() for tests or multi-tenant setups.
 */
export function getDbClient(): DbClient {
  if (!globalForDb.dbClient) {
    globalForDb.dbClient = createDbClient();
  }
  return globalForDb.dbClient;
}

export default getDbClient;