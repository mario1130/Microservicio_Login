import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Cargar variables desde .env.db
dotenv.config({ path: '.env.db' });

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.PG_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PG_PORT,
});

// const pool = new Pool({
//   user: 'postgres',        // Usuario de PostgreSQL
//   host: 'localhost',       // Dirección del servidor (local)
//   database: 'postgres',    // Nombre de la base de datos
//   password: '', // Contraseña del usuario
//   port: 5432,              // Puerto de PostgreSQL
// });

pool.on('connect', () => { });

pool.on('error', (err) => {
    console.error('Error en la conexión a PostgreSQL:', err);
});

export default pool;