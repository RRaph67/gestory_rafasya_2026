-- 003_profiles_sync.sql
-- Buat tabel profiles dan trigger untuk mensinkronkan dengan auth.users

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Function to insert profile when a new auth.user is created
create or replace function public.handle_auth_user_insert()
returns trigger language plpgsql as $$
begin
  insert into public.profiles (id, full_name, avatar_url, created_at, updated_at)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'full_name')::text, new.email),
    coalesce((new.raw_user_meta_data ->> 'avatar_url')::text, null),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger on auth.users
drop trigger if exists insert_profile_on_signup on auth.users;
create trigger insert_profile_on_signup
after insert on auth.users
for each row execute function public.handle_auth_user_insert();

-- Function to update profiles updated_at on profile changes (optional)
create or replace function public.set_profile_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();
