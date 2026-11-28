-- Every new user starts with two accounts so they can add income and transfer right away.
-- Runs as the table owner because it fires on auth.users, outside the user's RLS scope.
create function public.create_default_accounts()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.accounts (user_id, name, icon)
  values
    (new.id, 'Cuenta principal', 'wallet-outline'),
    (new.id, 'Ahorros', 'save-outline');
  return new;
end;
$$;

-- Only the trigger calls it; never expose it through the API.
revoke execute on function public.create_default_accounts() from public, anon, authenticated;

create trigger on_auth_user_created_create_default_accounts
  after insert on auth.users
  for each row execute function public.create_default_accounts();

-- Users who signed up before this migration get the same accounts.
insert into public.accounts (user_id, name, icon)
select u.id, d.name, d.icon
from auth.users u
cross join (values ('Cuenta principal', 'wallet-outline'), ('Ahorros', 'save-outline')) as d (name, icon)
where not exists (select 1 from public.accounts a where a.user_id = u.id);
