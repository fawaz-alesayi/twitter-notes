export interface AccountActivityEvent {
  for_user_id: string;
  user_has_blocked?: boolean;
  tweet_create_events?: Record<string, unknown>[];
  favorite_events?: FavoriteEvent[];
}

interface FavoriteEvent {
  id: string;
  created_at: string;
  timestamp_ms: number;
  favorited_status: Record<string, unknown>;
  user: Record<string, unknown>;
}
