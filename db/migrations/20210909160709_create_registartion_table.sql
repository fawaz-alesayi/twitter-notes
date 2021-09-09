-- migrate:up
alter table users add column oauth_token text;
alter table users add column oauth_secret text;

-- migrate:down
alter table users drop column oauth_token;
alter table users drop column oauth_secret;