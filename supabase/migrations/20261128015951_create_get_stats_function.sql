-- Stats of the current user for a period, in the user's time zone:
--   week  = last 7 days, one bucket per day
--   month = current calendar month so far, one bucket per day
--   year  = current calendar year so far, one bucket per month
-- Totals are compared with the same stretch of the previous period
-- (e.g. Nov 1–27 vs Oct 1–27). Transfers only move money between the
-- user's accounts, so they count for the balance but not as income or expenses.
create function public.get_stats(p_period text, p_tz text default 'UTC')
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_now timestamp := now() at time zone p_tz;
  v_unit text;
  v_step interval;
  v_start timestamp;
  v_prev_start timestamp;
  v_prev_end timestamp;
begin
  if p_period = 'week' then
    v_unit := 'day'; v_step := interval '1 day';
    v_start := date_trunc('day', v_now) - interval '6 days';
    v_prev_start := v_start - interval '7 days';
  elsif p_period = 'month' then
    v_unit := 'day'; v_step := interval '1 day';
    v_start := date_trunc('month', v_now);
    v_prev_start := v_start - interval '1 month';
  elsif p_period = 'year' then
    v_unit := 'month'; v_step := interval '1 month';
    v_start := date_trunc('year', v_now);
    v_prev_start := v_start - interval '1 year';
  else
    raise exception 'Periodo no válido: %', p_period;
  end if;
  v_prev_end := v_prev_start + (v_now - v_start);

  return (
    with tx as (
      select t.kind, t.amount, t.occurred_at at time zone p_tz as at
      from public.transactions t
      where t.user_id = (select auth.uid())
    ),
    opening as (
      select coalesce(sum(tx.amount), 0) as balance from tx where tx.at < v_start
    ),
    buckets as (
      select b.start
      from generate_series(v_start, date_trunc(v_unit, v_now), v_step) as b (start)
    ),
    per_bucket as (
      select
        b.start,
        coalesce(sum(tx.amount) filter (where tx.kind = 'income'), 0) as income,
        coalesce(-sum(tx.amount) filter (where tx.kind = 'expense'), 0) as expense,
        coalesce(sum(tx.amount), 0) as net
      from buckets b
      left join tx on tx.at >= b.start and tx.at < b.start + v_step
      group by b.start
    ),
    running as (
      select
        p.start, p.income, p.expense,
        (select balance from opening) + sum(p.net) over (order by p.start) as balance
      from per_bucket p
    )
    select jsonb_build_object(
      'income', coalesce(sum(tx.amount) filter (where tx.kind = 'income' and tx.at >= v_start), 0),
      'expense', coalesce(-sum(tx.amount) filter (where tx.kind = 'expense' and tx.at >= v_start), 0),
      'prev_income', coalesce(sum(tx.amount) filter (
        where tx.kind = 'income' and tx.at >= v_prev_start and tx.at < v_prev_end), 0),
      'prev_expense', coalesce(-sum(tx.amount) filter (
        where tx.kind = 'expense' and tx.at >= v_prev_start and tx.at < v_prev_end), 0),
      'days_elapsed', extract(day from v_now - date_trunc('month', v_now))::int + 1,
      'days_in_month', extract(day from date_trunc('month', v_now) + interval '1 month' - interval '1 day')::int,
      'buckets', (
        select jsonb_agg(
          jsonb_build_object(
            'start', to_char(r.start, 'YYYY-MM-DD'),
            'income', r.income,
            'expense', r.expense,
            'balance', r.balance
          ) order by r.start)
        from running r
      )
    )
    from tx
  );
end;
$$;

revoke execute on function public.get_stats(text, text) from public, anon;
grant execute on function public.get_stats(text, text) to authenticated;
