-- =====================================================
-- SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user settings and credits
-- =====================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  credits integer default 25 not null,
  is_unlimited boolean default false not null,
  gf_name text default 'Luna' not null,
  your_name text default 'Babe' not null,
  personality text default 'sweet' not null,
  backstory text default 'We met at a coffee shop and have been dating for a few months.' not null,
  texting_style text default 'casual' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles policies: Users can only access their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- =====================================================
-- MESSAGES TABLE
-- Stores chat history for AI memory
-- =====================================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster message retrieval
create index messages_user_id_created_at_idx on public.messages(user_id, created_at desc);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Messages policies: Users can only access their own messages
create policy "Users can view own messages" 
  on public.messages for select 
  using (auth.uid() = user_id);

create policy "Users can insert own messages" 
  on public.messages for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete own messages" 
  on public.messages for delete 
  using (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Auto-create profile on signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Trigger to auto-update updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

