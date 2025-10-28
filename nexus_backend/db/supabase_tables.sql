-- Supabase (Postgres) table definitions for NEXUS
-- Run these in the Supabase SQL Editor (https://app.supabase.com) -> SQL Editor -> New query
-- Users table (attendee / attendant / admin)
CREATE TABLE IF NOT EXISTS public.users (
    id bigserial PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    name text,
    role text DEFAULT 'attendee',
    created_at timestamptz DEFAULT now()
);
-- Devices (BLE devices owned by attendants)
CREATE TABLE IF NOT EXISTS public.devices (
    id bigserial PRIMARY KEY,
    attendant_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
    ble_id text UNIQUE NOT NULL,
    device_name text,
    is_active boolean DEFAULT false,
    last_activated timestamptz,
    created_at timestamptz DEFAULT now()
);
-- Sessions (optional: when an attendant starts a session)
CREATE TABLE IF NOT EXISTS public.sessions (
    id bigserial PRIMARY KEY,
    attendant_id bigint REFERENCES public.users(id) ON DELETE
    SET NULL,
        ble_id text,
        started_at timestamptz DEFAULT now(),
        ended_at timestamptz
);
-- Attendance
CREATE TABLE IF NOT EXISTS public.attendance (
    id bigserial PRIMARY KEY,
    device_id text,
    attendee_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
    session_id bigint REFERENCES public.sessions(id) ON DELETE
    SET NULL,
        timestamp timestamptz DEFAULT now(),
        status text DEFAULT 'Present',
        rssi_strength double precision
);
-- Optional: index for frequent lookups
CREATE INDEX IF NOT EXISTS idx_attendance_attendee ON public.attendance(attendee_id);


