-- Profiles table used by the IT-PM login application
-- Run this script inside the SQL editor of your Supabase project.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user',
  created_by_admin boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy if not exists "Users can view their profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users can update their profile"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "Admins can manage profiles"
  on public.profiles
  for all
  using (
    exists (
      select 1
      from public.profiles as p
      where p.user_id = auth.uid()
        and lower(coalesce(p.role, '')) = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles as p
      where p.user_id = auth.uid()
        and lower(coalesce(p.role, '')) = 'admin'
    )
  );

comment on table public.profiles is 'Application profile data including roles and admin provenance.';
comment on column public.profiles.created_by_admin is 'Marks users that were provisioned by an administrator.';
