
// Imports
import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager({ region: 'eu-west-3'});

// Load the right .env file: .env.local if it exists, .env otherwise
dotenv.config({ path: fs.existsSync('.env.local') ? '.env.local' : '.env' });

// Fetches the secrets' vars, and registers them as env vars
export async function initEnv() {
  if (isProd()) {
    const secretRes = await secretsManager.getSecretValue({ SecretId: 'env_local' }).promise();
    if (secretRes.SecretString === undefined) {
      throw 'Unable to retrieve secrets from AWS';
    }

    const envConfig = dotenv.parse(secretRes.SecretString);
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }
}

// Returns whether if this should be considered a production server
export function isProd(): boolean {

  if (process.env.FORCE_PROD?.toLowerCase() === 'true') {
    return true;
  }

  return process.env.NODE_ENV == 'production';
}
