import type { MigrationConfig } from "drizzle-orm/migrator";


process.loadEnvFile();

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig;
}

type APIConfig = {
  fileServerHits: number;
  db: DBConfig;
};

export const config: APIConfig = {
  fileServerHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./src/db/migrations"
    }
  }
};
