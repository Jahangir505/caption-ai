-- Run this in Supabase SQL Editor after the main schema

-- Increment usage count atomically
create or replace function increment_usage(uid uuid)
returns void as $$
begin
  update usage
  set count = count + 1,
      updated_at = now()
  where user_id = uid;
end;
$$ language plpgsql security definer;

-- Allow users to delete their own account (called from settings)
create or replace function delete_user()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;

-- Service role policies needed for webhook routes (bypasses RLS)
-- These are automatically handled by the service role key in webhook routes.

-- Allow insert on profiles from service role (for webhook)
create policy "Service role can manage profiles"
  on profiles for all
  using (true)
  with check (true);

-- Allow insert on subscriptions from service role (for webhook)
create policy "Service role can manage subscriptions"
  on subscriptions for all
  using (true)
  with check (true);
