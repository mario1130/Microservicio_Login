import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Cargar variables desde .env.db
dotenv.config({ path: '.env.db' });

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.on('connect', () => { });

pool.on('error', (err) => {
    console.error('Error en la conexión a PostgreSQL:', err);
});

export default pool;
