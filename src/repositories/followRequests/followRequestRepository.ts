import follow_requests from "@src/databaseTypes/follow_requests";
import { supabase } from "@src/utils/dataClient";
import { err, ok, Result } from "neverthrow";

interface followRequestRepository {
    storeFollowRequest(followRequest: follow_requests): Promise<Result<void, DatabaseError>>
}

class SupabaseFollowRequestRepository implements followRequestRepository {
    async storeFollowRequest(followRequest: follow_requests): Promise<Result<any, DatabaseError>> {
        try {
            await supabase.from<follow_requests>('follow_requests').insert({
                to_twitter_id: followRequest.to_twitter_id,
                user_id: followRequest.user_id,
            });
            return ok('Success');
        } catch (e) {
            return err(DatabaseError.CONNECTION_ERROR);
        }
    }
}

class InMemoryFollowRequestRepository implements followRequestRepository {
    storeFollowRequest(followRequest: FollowRequest): Promise<Result<void, DatabaseError>> {
        throw new Error("Method not implemented.");
    }
    
}

enum DatabaseError {
    CONNECTION_ERROR,
}

type FollowRequest = Omit<follow_requests, "id">

export const followRequestDataStore: followRequestRepository = new SupabaseFollowRequestRepository();

