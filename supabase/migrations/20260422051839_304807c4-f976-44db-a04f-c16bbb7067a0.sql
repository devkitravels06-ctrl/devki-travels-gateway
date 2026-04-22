ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_bill_date ON public.bills(bill_date);