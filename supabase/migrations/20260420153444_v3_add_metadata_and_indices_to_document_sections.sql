-- 1. Add metadata column to document_sections if it doesn't exist
ALTER TABLE public.document_sections 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 2. Create a GIN index on metadata for fast filtering 
-- (Useful if you want to search only within a specific book later)
CREATE INDEX IF NOT EXISTS idx_sections_metadata ON public.document_sections USING GIN (metadata);

-- 3. Add an index for the r2_path in the documents table to prevent duplicates
CREATE INDEX IF NOT EXISTS idx_documents_r2_path ON public.documents (r2_path);