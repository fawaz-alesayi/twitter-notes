-- migrate:up
alter table notes add column user_id int foreign key references users(id);

-- migrate:down
alter table notes drop column user_id RESTRICT;
