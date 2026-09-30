-- ====================================================================
-- AgriVision AI - Production PostgreSQL Database Schema & RLS Policies
-- Execute this script in your Supabase SQL Editor
-- ====================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    ph_level DECIMAL(3,1) NOT NULL,
    nitrogen_ppm INT NOT NULL,
    phosphorus_ppm INT NOT NULL,
    potassium_ppm INT NOT NULL,
    irrigation_type VARCHAR(50) DEFAULT 'Drip Irrigation',
    season VARCHAR(50) DEFAULT 'Kharif',
    crop_type VARCHAR(50) DEFAULT 'Wheat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    recommendations JSONB NOT NULL,
    risk_factors JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Row Level Security (RLS) & Data Isolation Rules
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- Profile RLS Policy
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);

-- Fields RLS Policy
DROP POLICY IF EXISTS "Users can manage own fields" ON public.fields;
CREATE POLICY "Users can manage own fields" 
ON public.fields FOR ALL 
USING (auth.uid() = user_id);

-- Advisories RLS Policy
DROP POLICY IF EXISTS "Users can manage own advisories" ON public.advisories;
CREATE POLICY "Users can manage own advisories" 
ON public.advisories FOR ALL 
USING (
    field_id IN (SELECT id FROM public.fields WHERE user_id = auth.uid())
);
