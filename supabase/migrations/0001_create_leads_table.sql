-- Create the leads table for the Connect with Marlenyi form.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  instagram_handle text not null,

  contact_method text not null check (
    contact_method in ('Text', 'Call', 'Email', 'Instagram DM')
  ),

  intent text check (
    intent in (
      'Buy a home',
      'Sell a property',
      'Relocate to or from Southwest Florida',
      'Purchase an investment property',
      'Other'
    )
  ),

  message text not null,

  -- CRM fields
  status text not null default 'new' check (
    status in ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')
  ),
  notes text
);

-- Newest leads first in the admin view.
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- Lock down anonymous access. The API route uses the service_role key, which
-- bypasses RLS. When the admin dashboard adds auth, add a SELECT policy for
-- authenticated users here.
alter table public.leads enable row level security;
