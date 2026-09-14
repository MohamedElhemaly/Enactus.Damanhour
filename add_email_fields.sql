-- Add custom email subject and body fields to the forms table
ALTER TABLE public.forms
ADD COLUMN IF NOT EXISTS email_subject text,
ADD COLUMN IF NOT EXISTS email_body text;
