process.loadEnvFile();

type APIConfig = {
  fileServerHits: number;
  dbUrl: string;
};

export const config = {
  fileServerHits: 0,
  dbUrl: envOrThrow("DB_URL"),
} as APIConfig;

function envOrThrow(key: string) {
  const variable = process.env.key;
  if (!variable) throw new Error(`${key} not set in env file`);

  return variable;
}
