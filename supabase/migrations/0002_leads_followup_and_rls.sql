-- Add CRM workflow fields and RLS policies for the leads table.

-- When a lead needs to be followed up, store the date.
alter table public.leads
  add column if not exists follow_up_at timestamptz;

create index if not exists leads_follow_up_at_idx
  on public.leads (follow_up_at)
  where follow_up_at is not null;

-- Row Level Security policies.
--
-- INSERTs come from the public form via the API route (service_role bypasses
-- RLS), so no INSERT policy is needed here.
--
-- For SELECT/UPDATE/DELETE we allow any authenticated user. Access to /admin
-- is gated by the ADMIN_EMAILS allowlist in middleware, and only Marlenyi can
-- get a session in the first place. When team support is added later, narrow
-- these policies with a tenant_id or organization_id check.

create policy "authenticated_select_leads"
  on public.leads
  for select
  to authenticated
  using (true);

create policy "authenticated_update_leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_delete_leads"
  on public.leads
  for delete
  to authenticated
  using (true);
