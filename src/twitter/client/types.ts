interface AccountActivityEvent {
    for_user_id: string;
    user_has_blocked?: boolean
    tweet_create_events?: object[];
    favorite_events?: FavoriteEvent[];


}

interface FavoriteEvent {
    id: string;
    created_at: string;
    timestamp_ms: number;
    favorited_status: object;
    user: object;
}

interface FollowEvent {

}