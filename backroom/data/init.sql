-- Users table
create table users
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
create table posts
(
    id           uuid      default gen_random_uuid() not null primary key,
    slug         text,
    pubdate      timestamp,
    author       uuid constraint fk_author references users(id),
    title        text,
    subtitle     text,
    body_html    text,
    cover_image  varchar(255),
    draft        boolean   default true              not null,
    created_date timestamp default now()
);

alter table posts
    owner to postgres;

-- Subscribers table
create table subscribers
(
    id              uuid      default gen_random_uuid() not null primary key,
    email           varchar(255)                        not null,
    subscribed_date timestamp default now()             not null,
    confirmed_email boolean   default false             not null
);

alter table subscribers
    owner to postgres;

-- Sent emails log
create table sent_emails
(
    id         uuid default gen_random_uuid() not null primary key,
    post       uuid constraint fk_post references posts (id),
    subscriber uuid constraint fk_subscriber references subscribers (id)
);


alter table sent_emails owner to postgres;

