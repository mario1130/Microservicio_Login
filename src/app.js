import express from 'express';

// Importar rutas desde archivos modulares
import authRoutes from './routes/authRoutes.js'; // Manejo de autenticación
import userRoutes from './routes/userRoutes.js'; // Manejo de autenticación

const PORT = process.env.PORT || 3000;


const app = express();
app.use(express.json());

// Usar las rutas importadas
app.use('/login', authRoutes); // Prefijo para ir a auth routes
app.use('/user', userRoutes); // Prefijo para ir a user routes

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})