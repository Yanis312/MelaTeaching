-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('super_admin', 'prof', 'student', 'parent')),
  full_name text not null,
  phone text,
  avatar_url text,
  preferred_language text not null default 'fr' check (preferred_language in ('fr', 'ar', 'en')),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Super admin reads all" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'prof'))
);

-- STUDENTS
create table public.students (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  birth_year int,
  level text not null check (level in (
    'primaire_1','primaire_2','primaire_3','primaire_4','primaire_5',
    'cem_1','cem_2','cem_3','cem_4',
    'lycee_1as','lycee_2as','lycee_3as'
  )),
  school_name text,
  created_at timestamptz not null default now()
);
alter table public.students enable row level security;
create policy "Parent reads own children" on public.students for select using (
  parent_id = auth.uid() or profile_id = auth.uid()
);
create policy "Prof reads all students" on public.students for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('prof', 'super_admin'))
);
create policy "Parent creates children" on public.students for insert with check (parent_id = auth.uid());

-- COURSES
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  subject text not null check (subject in ('math', 'physique', 'chimie')),
  level_group text not null check (level_group in ('primaire', 'cem', 'lycee')),
  levels text[] not null,
  title text not null,
  description text,
  is_active boolean not null default true,
  color text not null default '#60a5fa'
);
alter table public.courses enable row level security;
create policy "Anyone approved reads courses" on public.courses for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);
create policy "Prof manages courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('prof', 'super_admin'))
);

-- PRICING RULES
create table public.pricing_rules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  duration_minutes int not null default 60,
  price decimal(10,2) not null,
  currency text not null default 'DZD',
  label text not null,
  day_type text not null default 'any' check (day_type in ('weekday', 'weekend', 'any'))
);
alter table public.pricing_rules enable row level security;
create policy "Approved users read pricing" on public.pricing_rules for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);
create policy "Prof manages pricing" on public.pricing_rules for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('prof', 'super_admin'))
);

-- AVAILABILITIES
create table public.availabilities (
  id uuid default uuid_generate_v4() primary key,
  prof_id uuid references public.profiles(id) on delete cascade not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_blocked boolean not null default false,
  recurrence text not null default 'once' check (recurrence in ('once', 'weekly')),
  recurrence_end_date date,
  note text
);
alter table public.availabilities enable row level security;
create policy "All approved read availabilities" on public.availabilities for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);
create policy "Prof manages availabilities" on public.availabilities for all using (
  prof_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin')
);

-- BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) not null,
  pricing_rule_id uuid references public.pricing_rules(id),
  requested_start timestamptz not null,
  requested_end timestamptz not null,
  confirmed_start timestamptz,
  confirmed_end timestamptz,
  status text not null default 'pending' check (status in ('pending','counter_proposed','accepted','rejected','cancelled')),
  prof_note text,
  student_note text,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid')),
  payment_date date,
  payment_amount decimal(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "Requester reads own bookings" on public.bookings for select using (requester_id = auth.uid());
create policy "Prof reads all bookings" on public.bookings for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('prof', 'super_admin'))
);
create policy "Requester creates booking" on public.bookings for insert with check (requester_id = auth.uid());
create policy "Prof updates bookings" on public.bookings for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('prof', 'super_admin'))
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger bookings_updated_at before update on public.bookings
  for each row execute function update_updated_at();

-- NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title_fr text not null,
  title_ar text not null,
  title_en text not null,
  body_fr text not null,
  body_ar text not null,
  body_en text not null,
  related_booking_id uuid references public.bookings(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "Users read own notifications" on public.notifications for select using (recipient_id = auth.uid());
create policy "Users update own notifications" on public.notifications for update using (recipient_id = auth.uid());

-- PUSH SUBSCRIPTIONS
create table public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null unique,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "Users manage own push subs" on public.push_subscriptions for all using (profile_id = auth.uid());

-- SEED: default courses
insert into public.courses (subject, level_group, levels, title, color) values
  ('math', 'primaire', array['primaire_1','primaire_2','primaire_3','primaire_4','primaire_5'], 'Maths Primaire', '#86efac'),
  ('math', 'cem', array['cem_1','cem_2','cem_3','cem_4'], 'Maths CEM', '#60a5fa'),
  ('math', 'lycee', array['lycee_1as','lycee_2as','lycee_3as'], 'Maths Lycée', '#1d4ed8'),
  ('physique', 'cem', array['cem_3','cem_4'], 'Physique CEM', '#818cf8'),
  ('physique', 'lycee', array['lycee_1as','lycee_2as','lycee_3as'], 'Physique Lycée', '#a78bfa'),
  ('chimie', 'lycee', array['lycee_1as','lycee_2as','lycee_3as'], 'Chimie Lycée', '#f472b6');
