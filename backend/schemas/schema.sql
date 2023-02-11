drop table if exists topics;
create table if not exists topics (
    id integer primary key autoincrement,
    title text not null,
    created_at text not null,
    hidden integer default 0
);

drop table if exists posts;
create table if not exists posts (
    id integer primary key autoincrement,
    author text,
    author_code text not null,
    title text not null,
    body text not null,
    created_at text not null,
    updated_at text,
    topic_id integer,
    hidden integer default 0,
    FOREIGN KEY(topic_id) REFERENCES topics(id)
);

