import Twitter from 'twitter-lite';
import { getEnv } from '@src/utils/getEnv';
import { supabase } from '@src/utils/dataClient';
import { users } from '@src/databaseTypes';
import { Result, ok } from 'neverthrow';
export const botClient = new Twitter({
  subdomain: 'api', // "api" is the default (change for other subdomains)
  version: '1.1', // version "1.1" is the default (change for other subdomains)
  consumer_key: getEnv('CONSUMER_KEY'),
  consumer_secret: getEnv('CONSUMER_SECRET'),
  access_token_key: getEnv('ACCESS_TOKEN_KEY'),
  access_token_secret: getEnv('ACCESS_TOKEN_SECRET'), // from your User (oauth_token_secret)
});

export const createUserClient = async (
  twitterHandle: string,
): Promise<Twitter> => {
  const result = await getUserTokens(twitterHandle);
  const userClient = result.match(
    // ok
    (userTokens) => {
      return ok(
        new Twitter({
          subdomain: 'api', // "api" is the default (change for other subdomains)
          version: '1.1', // version "1.1" is the default (change for other subdomains)
          consumer_key: getEnv('CONSUMER_KEY'),
          consumer_secret: getEnv('CONSUMER_SECRET'),
          access_token_key: userTokens.oauth_token,
          access_token_secret: userTokens.oauth_token_secret, // from your User (oauth_token_secret)
        }),
      );
    },
    // err
    (err) => {
      throw new Error(err);
    },
  );
  return userClient.value;
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

export const clientV2 = new Twitter({
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
    .eq('twitter_handle', twitterHandle);

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) throw new Error('User not found');

  if (data[0].oauth_token === null || data[0].oauth_secret === null) {
    throw new Error('Users does not have oauth_token or oauth_secret');
  }

  return ok({
    oauth_token: data[0].oauth_token,
    oauth_token_secret: data[0].oauth_secret
  });
}
