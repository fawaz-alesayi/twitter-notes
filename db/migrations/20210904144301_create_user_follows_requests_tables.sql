-- migrate:up
create table users (
  id serial primary key,
  twitter_id text unique not null
);

create table user_follows (
  user_id int REFERENCES users(id),
  following_twitter_id text not null
);

create table follow_requests (
  id serial primary key,
  created_at timestamptz default NOW(),
  user_id int REFERENCES users(id),
  to_twitter_id text not null
);

-- migrate:down
drop table users RESTRICT;
drop table user_follows RESTRICT;
drop table follow_requests RESTRICT;

