-- migrate:up
create table Notes(
    id serial primary key,
    created_at timestamp NOW(),
    updated_at timestamp NOW(),
    note_text text,
    for_twitter_id text
);

-- migrate:down
drop table Notes RESTRICT;
