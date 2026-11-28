-- Each account with its current balance (sum of its transactions).
-- security_invoker makes the view respect the RLS of accounts and transactions.
create view public.account_balances
with (security_invoker = on)
as
select
  a.id,
  a.user_id,
  a.name,
  a.icon,
  a.created_at,
  coalesce(sum(t.amount), 0)::numeric(14, 2) as balance
from public.accounts a
left join public.transactions t on t.account_id = a.id
group by a.id;

revoke all on public.account_balances from anon;
grant select on public.account_balances to authenticated;
