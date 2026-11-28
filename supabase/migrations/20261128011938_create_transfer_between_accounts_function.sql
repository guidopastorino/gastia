-- Moves money between two accounts of the current user in one atomic step.
-- Runs with the caller's permissions, so RLS limits it to the user's own accounts.
create function public.transfer_between_accounts(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount numeric,
  p_note text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_amount numeric(14, 2) := round(p_amount, 2);
  v_transfer_id uuid := gen_random_uuid();
  v_from_name text;
  v_to_name text;
  v_balance numeric;
  v_note text := nullif(trim(p_note), '');
begin
  if v_amount is null or v_amount <= 0 then
    raise exception 'El monto debe ser mayor a 0';
  end if;
  if p_from_account_id = p_to_account_id then
    raise exception 'Elige dos cuentas distintas';
  end if;

  select name into v_from_name from public.accounts where id = p_from_account_id;
  select name into v_to_name from public.accounts where id = p_to_account_id;
  if v_from_name is null or v_to_name is null then
    raise exception 'Cuenta no encontrada';
  end if;

  select coalesce(sum(amount), 0) into v_balance
  from public.transactions where account_id = p_from_account_id;
  if v_balance < v_amount then
    raise exception 'Saldo insuficiente en %', v_from_name;
  end if;

  insert into public.transactions (account_id, kind, amount, title, transfer_id)
  values
    (p_from_account_id, 'transfer', -v_amount, coalesce(v_note, 'Transferencia a ' || v_to_name), v_transfer_id),
    (p_to_account_id, 'transfer', v_amount, coalesce(v_note, 'Transferencia de ' || v_from_name), v_transfer_id);

  return v_transfer_id;
end;
$$;

revoke execute on function public.transfer_between_accounts(uuid, uuid, numeric, text) from public, anon;
grant execute on function public.transfer_between_accounts(uuid, uuid, numeric, text) to authenticated;
