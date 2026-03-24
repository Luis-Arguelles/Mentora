-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Documents Table (Main File Info)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade default auth.uid(),
  file_name text not null,
  r2_path text not null,
  file_hash text, -- For duplicate detection
  file_status text default 'uploaded' check (file_status in ('uploaded', 'processing', 'indexed', 'error')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Document Sections Table (The "Chunks")
create table if not exists public.document_sections (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  content text not null,
  token_count int,
  embedding vector(768) -- Optimized for Google/Free models
);

-- 4. RLS for Documents
alter table public.documents enable row level security;
alter table public.document_sections enable row level security;

create policy "Users can manage their own documents" on documents 
  for all using (auth.uid() = user_id);

create policy "Users can view sections of their own documents" on document_sections
  for select using (
    exists (
      select 1 from documents 
      where documents.id = document_sections.document_id 
      and documents.user_id = auth.uid()
    )
  );

-- 5. Performance Index for Vector Search
-- Uses Cosine Similarity (standard for RAG)
create index on public.document_sections using ivfflat (embedding vector_cosine_ops);