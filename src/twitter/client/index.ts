import Twitter from 'twitter-lite';
import { getEnv } from '@src/utils/getEnv';
import { supabase } from '@src/utils/dataClient';
import { users } from '@src/databaseTypes';
import { Result, ok, err } from 'neverthrow';
export const botClient = new Twitter({
  subdomain: 'api', // "api" is the default (change for other subdomains)
  version: '1.1', // version "1.1" is the default (change for other subdomains)
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
  access_token_key: getEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: getEnv('ACCESS_TOKEN_SECRET'),
});

export const createUserClient = async (
  twitterHandle: string,
): Promise<Twitter> => {
  const result = await getUserTokens(twitterHandle);
  const token: UserTokens = result._unsafeUnwrap();
  return new Twitter({
    subdomain: 'api', // "api" is the default (change for other subdomains)
    version: '1.1', // version "1.1" is the default (change for other subdomains)
    consumer_key: getEnv('CONSUMER_KEY'),
    consumer_secret: getEnv('CONSUMER_SECRET'),
    access_token_key: token.oauth_token,
    access_token_secret: token.oauth_token_secret,
  });
};

interface UserTokens {
  oauth_token: string;
  oauth_token_secret: string;
}

export const appClient = new Twitter({
  subdomain: 'api', // "api" is the default (change for other subdomains)
  version: '1.1', // version "1.1" is the default (change for other subdomains)
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
});

export const botClientV2 = new Twitter({
  subdomain: 'api', // "api" is the default (change for other subdomains)
  version: '2', // version "1.1" is the default (change for other subdomains)
  extension: false,
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
  access_token_key: getEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: getEnv('ACCESS_TOKEN_SECRET'), // from your User (oauth_token_secret)
});

async function getUserTokens(
  twitterHandle: string,
): Promise<Result<UserTokens, string>> {
  const { data, error } = await supabase
    .from<users>('users')
    .select('oauth_token,oauth_secret')
    .match({ twitter_handle: twitterHandle });

  if (error) return err(error.message);

  if (!data || data.length === 0) return err('User not found');

  if (data[0].oauth_token === null || data[0].oauth_secret === null) {
    return err('Users does not have oauth_token or oauth_secret');
  }

  console.log(data);
  console.log(data[0]);

  return ok({
    oauth_token: data[0].oauth_token,
    oauth_token_secret: data[0].oauth_secret
  });
}
