-- Numbers for the home screen of the current user, in one round trip.
-- Transfers move money between the user's own accounts, so they count for the balance
-- but not as income or expenses. Months are calendar months in UTC.
create function public.get_home_summary()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with bounds as (
    select
      date_trunc('month', now()) as month_start,
      date_trunc('month', now()) - interval '1 month' as prev_start
  ),
  tx as (
    select t.kind, t.amount, t.occurred_at
    from public.transactions t
    where t.user_id = (select auth.uid())
  ),
  totals as (
    select
      coalesce(sum(tx.amount), 0) as balance,
      coalesce(sum(tx.amount) filter (where tx.kind <> 'transfer' and tx.occurred_at >= b.month_start), 0) as month_net,
      coalesce(sum(tx.amount) filter (where tx.kind = 'income' and tx.occurred_at >= b.month_start), 0) as income_month,
      coalesce(sum(tx.amount) filter (where tx.kind = 'income' and tx.occurred_at >= b.prev_start and tx.occurred_at < b.month_start), 0) as income_prev_month,
      coalesce(-sum(tx.amount) filter (where tx.kind = 'expense' and tx.occurred_at >= b.month_start), 0) as expenses_month,
      coalesce(-sum(tx.amount) filter (where tx.kind = 'expense' and tx.occurred_at >= b.prev_start and tx.occurred_at < b.month_start), 0) as expenses_prev_month
    from bounds b
    left join tx on true
  ),
  trend as (
    select jsonb_agg(coalesce(m.total, 0) order by m.month) as income_trend
    from (
      select s.month, (
        select sum(tx.amount) from tx
        where tx.kind = 'income' and tx.occurred_at >= s.month and tx.occurred_at < s.month + interval '1 month'
      ) as total
      from bounds b
      cross join generate_series(b.month_start - interval '5 months', b.month_start, interval '1 month') as s (month)
    ) m
  )
  select jsonb_build_object(
    'balance', totals.balance,
    'month_net', totals.month_net,
    'income_month', totals.income_month,
    'income_prev_month', totals.income_prev_month,
    'expenses_month', totals.expenses_month,
    'expenses_prev_month', totals.expenses_prev_month,
    'income_trend', trend.income_trend
  )
  from totals, trend;
$$;

revoke execute on function public.get_home_summary() from public, anon;
grant execute on function public.get_home_summary() to authenticated;
