-- Enactus Damanhour - Supabase Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 2. Create Tables

create table public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.sections (
    id uuid default uuid_generate_v4() primary key,
    section_key text unique not null,
    title text,
    subtitle text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.hero_content (
    id uuid default uuid_generate_v4() primary key,
    title text,
    subtitle text,
    cta_primary_text text,
    cta_primary_link text,
    cta_secondary_text text,
    cta_secondary_link text,
    background_image text,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    image_url text,
    link text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.team_members (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    role text not null,
    category text default 'leaders', -- 'leaders', 'advisors', 'all-members'
    image_url text,
    linkedin_url text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.events (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    image_url text,
    location text,
    time_info text,
    event_date date,
    event_month text,
    event_day integer,
    registration_link text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.partners (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    image_url text,
    link text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.news_items (
    id uuid default uuid_generate_v4() primary key,
    badge_icon text default 'fas fa-newspaper',
    badge_text text,
    title text not null,
    link text,
    date_text text,
    image_url text,
    image_caption text,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.contact_info (
    id uuid default uuid_generate_v4() primary key,
    type text not null,
    label text not null,
    value text not null,
    icon text,
    link text,
    sort_order integer default 0,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.social_links (
    id uuid default uuid_generate_v4() primary key,
    platform text not null,
    url text not null,
    icon_class text not null,
    sort_order integer default 0,
    is_visible boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.forms (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    is_active boolean default true,
    send_email boolean default true,
    email_template_id text,
    success_message text default 'Form submitted successfully!',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.form_fields (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    label text not null,
    type text not null, -- 'text', 'email', 'textarea', 'select', 'radio', 'checkbox'
    placeholder text,
    is_required boolean default false,
    options jsonb, -- array of options for select/radio/checkbox
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.form_submissions (
    id uuid default uuid_generate_v4() primary key,
    form_id uuid references public.forms(id) on delete cascade,
    data jsonb not null,
    email text,
    status text default 'new',
    submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Set up Row Level Security (RLS)

-- Enable RLS on all tables
alter table public.site_settings enable row level security;
alter table public.sections enable row level security;
alter table public.hero_content enable row level security;
alter table public.projects enable row level security;
alter table public.team_members enable row level security;
alter table public.events enable row level security;
alter table public.partners enable row level security;
alter table public.news_items enable row level security;
alter table public.contact_info enable row level security;
alter table public.social_links enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;

-- Public read access policies
create policy "Public read access for site_settings" on public.site_settings for select using (true);
create policy "Public read access for sections" on public.sections for select using (is_visible = true);
create policy "Public read access for hero_content" on public.hero_content for select using (true);
create policy "Public read access for projects" on public.projects for select using (is_visible = true);
create policy "Public read access for team_members" on public.team_members for select using (is_visible = true);
create policy "Public read access for events" on public.events for select using (is_visible = true);
create policy "Public read access for partners" on public.partners for select using (is_visible = true);
create policy "Public read access for news_items" on public.news_items for select using (is_visible = true);
create policy "Public read access for contact_info" on public.contact_info for select using (true);
create policy "Public read access for social_links" on public.social_links for select using (is_visible = true);
create policy "Public read access for forms" on public.forms for select using (is_active = true);
create policy "Public read access for form_fields" on public.form_fields for select using (true);

-- Public insert access for form submissions
create policy "Public insert access for form_submissions" on public.form_submissions for insert with check (true);

-- Authenticated (Admin) full access policies
create policy "Admin full access for site_settings" on public.site_settings for all using (auth.role() = 'authenticated');
create policy "Admin full access for sections" on public.sections for all using (auth.role() = 'authenticated');
create policy "Admin full access for hero_content" on public.hero_content for all using (auth.role() = 'authenticated');
create policy "Admin full access for projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admin full access for team_members" on public.team_members for all using (auth.role() = 'authenticated');
create policy "Admin full access for events" on public.events for all using (auth.role() = 'authenticated');
create policy "Admin full access for partners" on public.partners for all using (auth.role() = 'authenticated');
create policy "Admin full access for news_items" on public.news_items for all using (auth.role() = 'authenticated');
create policy "Admin full access for contact_info" on public.contact_info for all using (auth.role() = 'authenticated');
create policy "Admin full access for social_links" on public.social_links for all using (auth.role() = 'authenticated');
create policy "Admin full access for forms" on public.forms for all using (auth.role() = 'authenticated');
create policy "Admin full access for form_fields" on public.form_fields for all using (auth.role() = 'authenticated');
create policy "Admin full access for form_submissions" on public.form_submissions for all using (auth.role() = 'authenticated');

-- 4. Initial Seed Data (Hero Content)
insert into public.hero_content (title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, background_image)
values (
    'Transform Lives Through<br><span class="gradient-text">Entrepreneurial Action</span>',
    'Empowering student-led initiatives at Damanhour University to create sustainable social impact through innovation',
    'Explore Projects',
    '#projects',
    'Get Involved',
    '#contact',
    'images/download1.webp'
);

-- Seed basic forms
insert into public.forms (title, description, is_active, send_email, success_message)
values (
    'Membership Application',
    'Join Enactus Damanhour and make an impact.',
    true,
    true,
    'Thank you for applying! We will review your application and contact you soon.'
);

-- 5. Set up Storage bucket for images
-- NOTE: If this fails, create the bucket manually via the Supabase dashboard
insert into storage.buckets (id, name, public) values ('enactus-images', 'enactus-images', true) ON CONFLICT DO NOTHING;

-- Storage policies
create policy "Public read access for images" on storage.objects for select using (bucket_id = 'enactus-images');
create policy "Admin upload access for images" on storage.objects for insert with check (auth.role() = 'authenticated' and bucket_id = 'enactus-images');
create policy "Admin update access for images" on storage.objects for update using (auth.role() = 'authenticated' and bucket_id = 'enactus-images');
create policy "Admin delete access for images" on storage.objects for delete using (auth.role() = 'authenticated' and bucket_id = 'enactus-images');
