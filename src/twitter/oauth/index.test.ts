import { supabase } from '@src/utils/dataClient';
import { users } from '@src/databaseTypes';

describe("Given a user's oauth token AND oauth secret AND his twitter ID", () => {
  const oauthToken = 'oauthToken';
  const oauthSecret = 'oauthSecret';
  const twitterId = 'twitterId';
  let id;
  describe('When I create a new user', async () => {
    await supabase.from<users>('users').insert({
      oauth_token: oauthToken,
      oauth_secret: oauthSecret,
      twitter_id: twitterId,
    });
    test('Then I expect to find it in the datastore', async () => {
      const { data, error } = await supabase
        .from<users>('users')
        .select('twitter_id')
        .eq('twitter_id', twitterId);
      expect(error).toBe(null);
      expect(data).toHaveLength(1);
      const users = data!;
      id = users[0].id;
      expect(users[0].twitter_id).toBe(twitterId);
    });

    afterAll(async () => {
      await supabase.from<users>('users').delete().match({ id: id });
    });
  });
});
