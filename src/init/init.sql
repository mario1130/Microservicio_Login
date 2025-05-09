-- Crear el esquema 'kreator'
CREATE SCHEMA IF NOT EXISTS kreator;

-- Usar el esquema 'kreator'
SET search_path TO kreator;

-- Extensión necesaria
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Crear la tabla 'user' dentro del esquema 'kreator'
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mail VARCHAR(140) NOT NULL,
    name VARCHAR(100) DEFAULT ''::VARCHAR NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    rol_id UUID NOT NULL,
    request VARCHAR(45) DEFAULT 'Aprobado'::VARCHAR NOT NULL,
    user_photo VARCHAR(250),
    register_date TIMESTAMPTZ NOT NULL,
    last_update TIMESTAMPTZ NOT NULL,
    status INTEGER DEFAULT 0 NOT NULL,
    rating INTEGER,
    rating_comment VARCHAR(1000)
);


