create table entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) not null,
  date       date not null,
  body       text not null default '',
  mood       text check (mood in ('bad', 'low', 'good', 'great')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint entries_date_user_id_key unique (date, user_id)
);

alter table entries enable row level security;

create policy "user owns their entries"
  on entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_entries_user_id on entries(user_id);

alter table entries add constraint entries_body_length check (length(body) <= 50000);
