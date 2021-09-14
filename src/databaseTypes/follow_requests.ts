// @generated
// Automatically generated. Don't change this file manually.
// Name: follow_requests

import { usersId } from './users';

export type follow_requestsId = number & { " __flavor"?: 'follow_requests' };

export default interface follow_requests {
  /** Primary key. Index: follow_requests_pkey */
  id: follow_requestsId;

  created_at: Date | null;

  user_id: usersId | null;

  to_twitter_id: string;
}

export interface follow_requestsInitializer {
  /**
   * Default value: nextval('follow_requests_id_seq'::regclass)
   * Primary key. Index: follow_requests_pkey
   */
  id?: follow_requestsId;

  /** Default value: now() */
  created_at?: Date | null;

  user_id?: usersId | null;

  to_twitter_id: string;
}
