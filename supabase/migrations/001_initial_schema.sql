-- ============================================================
-- StoryForge Kids — Supabase Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                   TEXT NOT NULL,
  email                  TEXT UNIQUE NOT NULL,
  password_hash          TEXT NOT NULL,
  subscription_status    TEXT NOT NULL DEFAULT 'free'
                           CHECK (subscription_status IN ('free','active','past_due','canceled','trialing')),
  stripe_customer_id     TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  books_this_month       INTEGER NOT NULL DEFAULT 0,
  month_reset_at         TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BOOKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.books (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age  INTEGER NOT NULL CHECK (child_age BETWEEN 0 AND 18),
  theme      TEXT NOT NULL DEFAULT 'adventure'
               CHECK (theme IN ('adventure','fantasy','space','ocean','dinosaurs','superheroes','animals','magic')),
  content    TEXT,
  status     TEXT NOT NULL DEFAULT 'generating'
               CHECK (status IN ('generating','complete','error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHARACTERS (Queen Aurora series)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.characters (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  visual_notes  TEXT,
  personality   TEXT,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS (mirrors Stripe state)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                         UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id              TEXT UNIQUE NOT NULL,
  stripe_subscription_id          TEXT UNIQUE,
  plan                            TEXT NOT NULL DEFAULT 'free'
                                    CHECK (plan IN ('free','starter','pro','enterprise')),
  status                          TEXT NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active','canceled','past_due','trialing','incomplete','incomplete_expired','unpaid')),
  books_per_month                 INTEGER NOT NULL DEFAULT 2,
  images_per_month                INTEGER NOT NULL DEFAULT 0,
  current_month_books_created     INTEGER NOT NULL DEFAULT 0,
  current_month_images_generated  INTEGER NOT NULL DEFAULT 0,
  current_period_start            TIMESTAMPTZ,
  current_period_end              TIMESTAMPTZ,
  canceled_at                     TIMESTAMPTZ,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount                   INTEGER NOT NULL,   -- cents
  currency                 TEXT NOT NULL DEFAULT 'usd',
  status                   TEXT NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','succeeded','failed','refunded')),
  payment_type             TEXT NOT NULL DEFAULT 'subscription'
                             CHECK (payment_type IN ('subscription','one_time','book_purchase')),
  description              TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MARKETING CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketing_content (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id    UUID REFERENCES public.books(id) ON DELETE SET NULL,
  type       TEXT NOT NULL DEFAULT 'social'
               CHECK (type IN ('social','email','ad','description','press_release')),
  platform   TEXT,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHAT HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content    TEXT NOT NULL,
  model      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_sessions_token       ON public.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id     ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at  ON public.sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_books_user_id        ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status         ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_created_at     ON public.books(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_characters_user_id   ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_default   ON public.characters(is_default) WHERE is_default = TRUE;

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id         ON public.subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_user_id     ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id   ON public.payments(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_marketing_book_id    ON public.marketing_content(book_id);
CREATE INDEX IF NOT EXISTS idx_marketing_user_id    ON public.marketing_content(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_user_id         ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at      ON public.chat_messages(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketing_updated_at
  BEFORE UPDATE ON public.marketing_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages     ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by server-side tRPC)
-- anon/public role has NO access — all access goes through server

-- Allow service_role full access (server-side only)
CREATE POLICY "service_role_all_users"             ON public.users             FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_sessions"          ON public.sessions          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_books"             ON public.books             FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_characters"        ON public.characters        FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_subscriptions"     ON public.subscriptions     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_payments"          ON public.payments          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_marketing"         ON public.marketing_content FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_chat"              ON public.chat_messages     FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- SEED: Default Characters (Queen Aurora series)
-- ============================================================
INSERT INTO public.characters (name, description, visual_notes, personality, is_default)
VALUES
  (
    'Queen Aurora Lightbringer',
    '5-year-old protagonist with a vivid imagination',
    'Wild curly red hair, big round glasses, homemade cardboard crown painted gold, colorful pajamas',
    'Strong-willed, imaginative, sees herself as a dragon queen. Reframes challenges as royal adventures.',
    TRUE
  ),
  (
    'Apprentice Azrael',
    'Aurora''s baby sister, the "hatchling"',
    'Baby wrapped in pink blanket, curious dark eyes, drools a lot',
    'Innocent, adorable, looks up to Aurora as her mentor',
    TRUE
  ),
  (
    'The King (Dad)',
    'Aurora''s father, patient and supportive',
    'Tired but loving dad, often has messy hair from lack of sleep',
    'Patient, plays along with Aurora''s imagination, uses reframing techniques',
    TRUE
  ),
  (
    'The Queen (Mom)',
    'Aurora''s mother, wise and understanding',
    'Warm, caring mom with dark circles under eyes but always smiling',
    'Understanding, creative in handling Aurora''s strong will, empathetic',
    TRUE
  )
ON CONFLICT DO NOTHING;