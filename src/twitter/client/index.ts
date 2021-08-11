import Twitter from "twitter-lite";
import { getEnv } from "../../utils/getEnv";
export const client = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  // extension: false,
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
  access_token_key: getEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: getEnv('ACCESS_TOKEN_SECRET'), // from your User (oauth_token_secret)
});

export const clientV2 = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "2", // version "1.1" is the default (change for other subdomains)
  extension: false,
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
  access_token_key: getEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: getEnv('ACCESS_TOKEN_SECRET'), // from your User (oauth_token_secret)
});