insert into site_settings (key, value)
values ('g3dpg_url', 'https://methatsmeyesitsme.github.io/Better-Bins/')
on conflict (key) do nothing;

insert into product_lines (id, slug, name, tagline, description, cover_image_url, cover_gif_url, sort_order)
values (
  'line_g3d_squish',
  'g3d-squish',
  'G3D Squish',
  'Lattice you can press.',
  'Printed gyroid structures with a closed outer skin. Choose the form, filament color, how far it yields, and how much grain sits on the surface. Every Squish is generated in G3DPG from the exact options on the order.',
  '/products/line-squish.jpg',
  '/products/squish-flex.gif',
  0
)
on conflict (id) do nothing;

insert into products (
  id, line_id, slug, name, description, base_price_cents,
  image_url, gif_url, video_url, gallery, shapes, colors, firmness_options,
  texture_enabled, texture_options, infill_pattern, size_mm, extra_settings,
  active, sort_order
) values
(
  'prod_classic_squish',
  'line_g3d_squish',
  'classic',
  'Classic Squish',
  'The original G3D Squish. A palm-sized gyroid body with rounded volume, printed as a single lattice so it flexes evenly in the hand. Customize the silhouette, filament, yield, and surface grain. Name is embossed into the G3DPG file so the print job matches the order.',
  2800,
  '/products/gumdrop.jpg',
  '/products/squish-flex.gif',
  '/products/squish-flex.mp4',
  '[{"url":"/products/gumdrop.jpg","kind":"image","alt":"Classic Squish gumdrop"},{"url":"/products/squish-flex.gif","kind":"gif","alt":"Squish flex"},{"url":"/products/squish-flex.mp4","kind":"video","alt":"Squish in hand"},{"url":"/products/cube.jpg","kind":"image","alt":"Cube form"},{"url":"/products/sphere.jpg","kind":"image","alt":"Sphere form"},{"url":"/products/macro.jpg","kind":"image","alt":"Gyroid close-up"}]'::jsonb,
  '[{"id":"gumdrop","label":"Gumdrop","priceDelta":0,"g3dpgValue":"gumdrop"},{"id":"cube","label":"Square / Cube","priceDelta":0,"g3dpgValue":"cube"},{"id":"sphere","label":"Ball / Sphere","priceDelta":0,"g3dpgValue":"sphere"},{"id":"cylinder","label":"Cylinder","priceDelta":200,"g3dpgValue":"cylinder"},{"id":"ring","label":"Ring / Torus","priceDelta":400,"g3dpgValue":"ring"}]'::jsonb,
  '[{"id":"black","label":"Black","hex":"#171717","priceDelta":0,"imageUrl":"/products/sphere-black.jpg"},{"id":"red","label":"Red","hex":"#c2302a","priceDelta":0,"imageUrl":"/products/cube-red.jpg"},{"id":"white","label":"White","hex":"#f4f1ea","priceDelta":0,"imageUrl":"/products/gumdrop.jpg"},{"id":"blue","label":"Blue","hex":"#1e4f8f","priceDelta":0,"imageUrl":"/products/gumdrop-blue.jpg"},{"id":"yellow","label":"Yellow","hex":"#d9a800","priceDelta":0},{"id":"orange","label":"Orange","hex":"#e06a2c","priceDelta":0}]'::jsonb,
  '[{"id":"super-soft","label":"Super Soft","priceDelta":0,"meta":{"thickness":0.8,"periods":2.0}},{"id":"soft","label":"Soft","priceDelta":0,"meta":{"thickness":1.2,"periods":2.2}},{"id":"medium","label":"Medium","priceDelta":200,"meta":{"thickness":1.5,"periods":2.5}},{"id":"firm","label":"Firm","priceDelta":300,"meta":{"thickness":2.1,"periods":2.8}},{"id":"super-firm","label":"Super Firm","priceDelta":500,"meta":{"thickness":2.8,"periods":3.2}}]'::jsonb,
  true,
  '[{"id":"none","label":"Smooth","priceDelta":0,"meta":{"toggle":false,"amount":0}},{"id":"light","label":"Light grain","priceDelta":100,"meta":{"toggle":true,"amount":25}},{"id":"moderate","label":"Moderate","priceDelta":200,"meta":{"toggle":true,"amount":50}},{"id":"heavy","label":"Heavy grain","priceDelta":400,"meta":{"toggle":true,"amount":85}}]'::jsonb,
  'gyroid',
  50,
  '{"quality":"192","rounded":true,"cornerRadius":5}'::jsonb,
  true,
  0
),
(
  'prod_pocket_squish',
  'line_g3d_squish',
  'pocket',
  'Pocket Squish',
  'A smaller gyroid body for a pocket or bag. Same color, firmness, and grain controls as Classic, scaled to 35mm. Prints faster, still a full G3DPG job.',
  1800,
  '/products/sphere.jpg',
  '/products/squish-flex.gif',
  '/products/squish-flex.mp4',
  '[{"url":"/products/sphere.jpg","kind":"image","alt":"Pocket Squish"},{"url":"/products/sphere-black.jpg","kind":"image","alt":"Black sphere"},{"url":"/products/squish-flex.gif","kind":"gif","alt":"Flex"},{"url":"/products/macro.jpg","kind":"image","alt":"Lattice"}]'::jsonb,
  '[{"id":"sphere","label":"Ball / Sphere","priceDelta":0,"g3dpgValue":"sphere"},{"id":"gumdrop","label":"Gumdrop","priceDelta":0,"g3dpgValue":"gumdrop"},{"id":"cube","label":"Square / Cube","priceDelta":0,"g3dpgValue":"cube"}]'::jsonb,
  '[{"id":"black","label":"Black","hex":"#171717","priceDelta":0,"imageUrl":"/products/sphere-black.jpg"},{"id":"red","label":"Red","hex":"#c2302a","priceDelta":0},{"id":"white","label":"White","hex":"#f4f1ea","priceDelta":0,"imageUrl":"/products/sphere.jpg"},{"id":"blue","label":"Blue","hex":"#1e4f8f","priceDelta":0},{"id":"yellow","label":"Yellow","hex":"#d9a800","priceDelta":0},{"id":"orange","label":"Orange","hex":"#e06a2c","priceDelta":0}]'::jsonb,
  '[{"id":"super-soft","label":"Super Soft","priceDelta":0,"meta":{"thickness":0.8,"periods":2.0}},{"id":"soft","label":"Soft","priceDelta":0,"meta":{"thickness":1.2,"periods":2.2}},{"id":"medium","label":"Medium","priceDelta":200,"meta":{"thickness":1.5,"periods":2.5}},{"id":"firm","label":"Firm","priceDelta":300,"meta":{"thickness":2.1,"periods":2.8}}]'::jsonb,
  true,
  '[{"id":"none","label":"Smooth","priceDelta":0,"meta":{"toggle":false,"amount":0}},{"id":"light","label":"Light grain","priceDelta":100,"meta":{"toggle":true,"amount":25}},{"id":"moderate","label":"Moderate","priceDelta":200,"meta":{"toggle":true,"amount":50}}]'::jsonb,
  'gyroid',
  35,
  '{"quality":"192","rounded":true,"cornerRadius":4}'::jsonb,
  true,
  1
),
(
  'prod_ring_squish',
  'line_g3d_squish',
  'ring',
  'Ring Squish',
  'A torus printed as a continuous gyroid. Fingers find the hole; the lattice still yields. Built around the Ring / Torus toolpath in G3DPG, with the rest of the Squish palette available.',
  3200,
  '/products/ring.jpg',
  '',
  '',
  '[{"url":"/products/ring.jpg","kind":"image","alt":"Ring Squish"},{"url":"/products/cylinder.jpg","kind":"image","alt":"Cylinder cousin"},{"url":"/products/macro.jpg","kind":"image","alt":"Gyroid"}]'::jsonb,
  '[{"id":"ring","label":"Ring / Torus","priceDelta":0,"g3dpgValue":"ring"},{"id":"cylinder","label":"Cylinder","priceDelta":0,"g3dpgValue":"cylinder"},{"id":"cube","label":"Square / Cube","priceDelta":200,"g3dpgValue":"cube"}]'::jsonb,
  '[{"id":"black","label":"Black","hex":"#171717","priceDelta":0},{"id":"red","label":"Red","hex":"#c2302a","priceDelta":0},{"id":"white","label":"White","hex":"#f4f1ea","priceDelta":0,"imageUrl":"/products/ring.jpg"},{"id":"blue","label":"Blue","hex":"#1e4f8f","priceDelta":0},{"id":"yellow","label":"Yellow","hex":"#d9a800","priceDelta":0},{"id":"orange","label":"Orange","hex":"#e06a2c","priceDelta":0}]'::jsonb,
  '[{"id":"soft","label":"Soft","priceDelta":0,"meta":{"thickness":1.2,"periods":2.2}},{"id":"medium","label":"Medium","priceDelta":200,"meta":{"thickness":1.5,"periods":2.5}},{"id":"firm","label":"Firm","priceDelta":300,"meta":{"thickness":2.1,"periods":2.8}},{"id":"super-firm","label":"Super Firm","priceDelta":500,"meta":{"thickness":2.8,"periods":3.2}}]'::jsonb,
  true,
  '[{"id":"none","label":"Smooth","priceDelta":0,"meta":{"toggle":false,"amount":0}},{"id":"light","label":"Light grain","priceDelta":100,"meta":{"toggle":true,"amount":25}},{"id":"moderate","label":"Moderate","priceDelta":200,"meta":{"toggle":true,"amount":50}},{"id":"heavy","label":"Heavy grain","priceDelta":400,"meta":{"toggle":true,"amount":85}}]'::jsonb,
  'gyroid',
  50,
  '{"quality":"192"}'::jsonb,
  true,
  2
)
on conflict (id) do nothing;
