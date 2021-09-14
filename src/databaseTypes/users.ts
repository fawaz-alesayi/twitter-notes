// @generated
// Automatically generated. Don't change this file manually.
// Name: users

export type usersId = number & { " __flavor"?: 'users' };

export default interface users {
  /**
   * Primary key. Index: users_pkey
   * Primary key. Index: users_pkey
   */
  id: usersId;

  /** Index: users_twitter_id_key */
  twitter_id: string;

  oauth_token: string | null;

  oauth_secret: string | null;

  twitter_handle: string | null;
}

export interface usersInitializer {
  /**
   * Default value: nextval('users_id_seq'::regclass)
   * Primary key. Index: users_pkey
   * Primary key. Index: users_pkey
   */
  id?: usersId;

  /** Index: users_twitter_id_key */
  twitter_id: string;

  oauth_token?: string | null;

  oauth_secret?: string | null;

  twitter_handle?: string | null;
}
