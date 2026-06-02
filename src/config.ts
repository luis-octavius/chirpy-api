import { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/out",
};

type APIConfig = {
  fileServerHits: number;
  db: DBConfig;
  platform: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export const config = {
  fileServerHits: 0,
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  platform: envOrThrow("PLATFORM"),
} as APIConfig;

function envOrThrow(key: string) {
  const variable = process.env[key];
  if (!variable) throw new Error(`${key} not set in env file`);

  return variable;
}
