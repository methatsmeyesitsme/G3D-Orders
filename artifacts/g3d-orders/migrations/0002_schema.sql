-- G3D Orders catalog + order desk (unowned, single-tenant studio)

create table if not exists product_lines (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  cover_image_url text not null default '',
  cover_gif_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  line_id text not null references product_lines(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  base_price_cents integer not null,
  image_url text not null default '',
  gif_url text not null default '',
  video_url text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  shapes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  firmness_options jsonb not null default '[]'::jsonb,
  texture_enabled boolean not null default true,
  texture_options jsonb not null default '[]'::jsonb,
  infill_pattern text not null default 'gyroid',
  size_mm integer not null default 50,
  extra_settings jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (line_id, slug)
);

create index if not exists products_line_id_idx on products (line_id);

create table if not exists orders (
  id text primary key,
  order_number text not null unique,
  customer_name text not null,
  status text not null default 'new',
  total_cents integer not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  line_name text not null,
  shape text not null default '',
  color text not null default '',
  firmness text not null default '',
  texture text not null default '',
  quantity integer not null,
  unit_price_cents integer not null,
  personalization text not null default '',
  g3dpg jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items (order_id);

create table if not exists site_settings (
  key text primary key,
  value text not null
);
