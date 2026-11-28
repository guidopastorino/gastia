-- Money accounts of a user (e.g. "Cuenta principal", "Ahorros").
-- The balance of an account is the sum of its transactions.
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  icon text not null default 'wallet-outline',
  created_at timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts (user_id);

alter table public.accounts enable row level security;

create policy "Users can view their own accounts"
  on public.accounts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own accounts"
  on public.accounts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own accounts"
  on public.accounts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own accounts"
  on public.accounts for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.accounts from anon;
grant select, insert, update, delete on public.accounts to authenticated;
