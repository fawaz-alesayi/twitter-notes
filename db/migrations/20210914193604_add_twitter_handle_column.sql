-- migrate:up
alter table users add column twitter_handle text;

-- migrate:down
alter table users drop column twitter_handle;