create table entries (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  body text not null default '',
  mood text check (mood in ('bad', 'low', 'good', 'great')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table entries disable row level security;
