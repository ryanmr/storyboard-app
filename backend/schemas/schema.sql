drop table if exists posts;
create table if not exists posts (
    id integer primary key autoincrement,
    author text,
    author_code text not null,
    title text not null,
    body text not null,
    created_at text not null,
    hidden integer default 0
);
