-- Every money movement. Amount is signed: positive adds to the account, negative takes from it.
-- A transfer is two rows (one negative, one positive) sharing the same transfer_id.
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id),
  kind text not null check (kind in ('income', 'expense', 'transfer')),
  amount numeric(14, 2) not null check (amount <> 0),
  title text not null check (char_length(title) between 1 and 120),
  transfer_id uuid,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint transactions_amount_matches_kind check (
    (kind = 'income' and amount > 0 and transfer_id is null)
    or (kind = 'expense' and amount < 0 and transfer_id is null)
    or (kind = 'transfer' and transfer_id is not null)
  )
);

create index transactions_user_id_occurred_at_idx on public.transactions (user_id, occurred_at desc);
create index transactions_account_id_idx on public.transactions (account_id);
create index transactions_transfer_id_idx on public.transactions (transfer_id) where transfer_id is not null;

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);

-- The account must also belong to the user.
create policy "Users can create transactions in their own accounts"
  on public.transactions for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.accounts a
      where a.id = account_id and a.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own transactions"
  on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.accounts a
      where a.id = account_id and a.user_id = (select auth.uid())
    )
  );

create policy "Users can delete their own transactions"
  on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.transactions from anon;
grant select, insert, update, delete on public.transactions to authenticated;
