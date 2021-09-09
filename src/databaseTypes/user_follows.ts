// @generated
// Automatically generated. Don't change this file manually.
// Name: user_follows

import { usersId } from './users';

export default interface user_follows {
  user_id: usersId | null;

  following_twitter_id: string;
}

export interface user_followsInitializer {
  user_id?: usersId | null;

  following_twitter_id: string;
}
