import dotenv from 'dotenv';
dotenv.config();

export function getEnv(variable: string): string {
  const env = process.env[variable];
  if (env != undefined) {
    return env;
  } else {
    throw new Error(`Environment variable ${variable} is not set.`);
  }
}
