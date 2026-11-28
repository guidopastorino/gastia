-- Explicit order for accounts: the default ones are created in the same statement,
-- so created_at alone can't tell which one comes first.
alter table public.accounts add column position smallint not null default 0;

update public.accounts set position = 1 where name = 'Ahorros' and icon = 'save-outline';

create or replace function public.create_default_accounts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.accounts (user_id, name, icon, position)
  values
    (new.id, 'Cuenta principal', 'wallet-outline', 0),
    (new.id, 'Ahorros', 'save-outline', 1);
  return new;
end;
$$;

create or replace view public.account_balances
with (security_invoker = on)
as
select
  a.id,
  a.user_id,
  a.name,
  a.icon,
  a.created_at,
  coalesce(sum(t.amount), 0)::numeric(14, 2) as balance,
  a.position
from public.accounts a
left join public.transactions t on t.account_id = a.id
group by a.id;
