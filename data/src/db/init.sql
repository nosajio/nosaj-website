-- Users table
create table if not exists users
(
    id        uuid default gen_random_uuid() not null primary key,
    firstname varchar(255),
    lastname  varchar(255),
    email     varchar(255),
    password  varchar(255)
);

alter table users
    owner to postgres;

-- Posts table
create table if not exists posts
(
    id           uuid      default gen_random_uuid() not null primary key,
    slug         text,
    pubdate      timestamp,
    author       uuid constraint fk_author references users(id) on delete set null,
    title        text,
    subtitle     text,
    body_html    text,
    body_md      text,
    cover_image  varchar(255),
    draft        boolean   default true              not null,
    created_date timestamp default now()
);

alter table posts
    owner to postgres;

-- Subscribers table
create table if not exists subscribers
(
    id              uuid      default gen_random_uuid() not null primary key,
    email           varchar(255)                        not null,
    subscribed_date timestamp default now()             not null,
    confirmed_email boolean   default false             not null
);

alter table subscribers
    owner to postgres;

-- Sent emails log
create table if not exists sent_emails
(
    id         uuid default gen_random_uuid() not null primary key,
    post       uuid constraint fk_post references posts (id) on delete cascade,
    subscriber uuid constraint fk_subscriber references subscribers (id) on delete cascade,
    sent_at    timestamp default now()
);

alter table sent_emails owner to postgres;

--- Events log
create table if not exists events
(
    id              uuid        default gen_random_uuid() not null primary key,
    event           varchar(255)                        not null,
    metadata        jsonb       default '{}'::jsonb,
    timestamp       timestamp   default now()
);

alter table events
    owner to postgres;