create table if not exists public.users
(
    id        uuid default gen_random_uuid() not null primary key,
    firstname varchar(255),
    lastname  varchar(255),
    email     varchar(255),
    password  varchar(255)
);

comment on column public.users.password is 'sha256 hash';

alter table public.users
    owner to postgres;

create table public.posts
(
    id          uuid    default gen_random_uuid() not null
        primary key,
    slug        text,
    pubdate     timestamp,
    author      uuid
        constraint fk_author
            references public.users,
    title       text,
    subtitle    text,
    body_html   text,
    cover_image varchar(255),
    draft       boolean default true              not null
);

alter table public.posts
    owner to postgres;

