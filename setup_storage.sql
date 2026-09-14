-- Create the "images" bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Create policy to allow public viewing
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'images' );

-- Create policy to allow authenticated uploads
create policy "Allow Uploads"
on storage.objects for insert
to public
with check ( bucket_id = 'images' );

-- Create policy to allow authenticated updates
create policy "Allow Updates"
on storage.objects for update
to public
using ( bucket_id = 'images' );

-- Create policy to allow authenticated deletes
create policy "Allow Deletes"
on storage.objects for delete
to public
using ( bucket_id = 'images' );
