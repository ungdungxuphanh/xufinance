
CREATE TYPE public.tx_type AS ENUM ('income','expense');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Wallet',
  color TEXT NOT NULL DEFAULT '#6366f1',
  initial_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wallets" ON public.wallets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.tx_type NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Tag',
  color TEXT NOT NULL DEFAULT '#f59e0b',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own categories" ON public.categories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.category_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_notes TO authenticated;
GRANT ALL ON public.category_notes TO service_role;
ALTER TABLE public.category_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own category notes" ON public.category_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.wallets ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  type public.tx_type NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions" ON public.transactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_tx_user_date ON public.transactions (user_id, occurred_on);

CREATE OR REPLACE FUNCTION public.bootstrap_user(_display_name TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  INSERT INTO public.profiles (id, display_name)
  VALUES (uid, _display_name)
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = uid) THEN
    INSERT INTO public.wallets (user_id, name, icon, color, sort_order) VALUES
      (uid, 'Tiền mặt', 'Banknote', '#22c55e', 0),
      (uid, 'Momo', 'Smartphone', '#d946ef', 1),
      (uid, 'BIDV', 'Landmark', '#0ea5e9', 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE user_id = uid) THEN
    INSERT INTO public.categories (user_id, name, type, icon, color, sort_order) VALUES
      (uid, 'Lương', 'income', 'Briefcase', '#22c55e', 0),
      (uid, 'Thưởng', 'income', 'Gift', '#14b8a6', 1),
      (uid, 'Đầu tư', 'income', 'TrendingUp', '#0ea5e9', 2),
      (uid, 'Thức ăn', 'expense', 'UtensilsCrossed', '#f97316', 0),
      (uid, 'Mua sắm', 'expense', 'ShoppingBag', '#ec4899', 1),
      (uid, 'Di chuyển', 'expense', 'Car', '#6366f1', 2),
      (uid, 'Hoá đơn', 'expense', 'ReceiptText', '#eab308', 3),
      (uid, 'Giải trí', 'expense', 'Gamepad2', '#a855f7', 4),
      (uid, 'Sức khoẻ', 'expense', 'HeartPulse', '#ef4444', 5);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_user(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bootstrap_user(TEXT) TO authenticated;
