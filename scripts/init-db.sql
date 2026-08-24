-- pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- KVKK: users tablosuna index ek (Drizzle migration sonrası da çalışır)
-- Bu dosya sadece ilk kurulumda çalışır
