//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Desactiva la verificación de certificados TLS (solo para desarrollo)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';
import { connectRabbitMQ, consume } from './shared/rabbitmq.js';
import User from './src/models/userModel.js'; // Modelo de usuario
import authRoutes from './src/routes/authRoutes.js'; // Rutas de autenticación

dotenv.config();

const PORT = process.env.PORT || 3001;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'user_events';

const app = express();

// Middleware para habilitar CORS
app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true // Permitir encabezados de autenticación
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/login', authRoutes); // Prefijo para las rutas de autenticación

const uuidValidado = Joi.string()
    .pattern(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);

// Esquema de validación para eventos
const userCreatedSchema = Joi.object({
    id: uuidValidado.required(),
    mail: Joi.string().email().required(),
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    rol_id: uuidValidado.optional(),
    request: Joi.string().valid('Aprobado', 'Rechazado').required(),
    user_photo: Joi.string().allow(''),
    register_date: Joi.date().iso().required(),
    last_update: Joi.date().iso().required(),
    status: Joi.number().integer().required(),
    rating: Joi.number().allow(null),
    rating_comment: Joi.string().allow(null)
});

const userUpdatedSchema = Joi.object({
    id: uuidValidado.required(),
    mail: Joi.string().email().optional(),
    name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    rol_id: uuidValidado.optional(),
    request: Joi.string().valid('Aprobado', 'Rechazado').optional(),
    user_photo: Joi.string().allow(''),
    register_date: Joi.date().iso().optional(),
    last_update: Joi.date().iso().required(),
    status: Joi.number().integer().optional(),
    rating: Joi.number().allow(null),
    rating_comment: Joi.string().allow(null)
});

function validateUpdateEvent(event) {
    console.log('Datos del evento recibido para actualización:', event.data); // Log para inspección
    const { error } = userUpdatedSchema.validate(event.data);
    if (error) {
        throw new Error(`Evento de actualización inválido: ${error.message}`);
    }
}

function validateEvent(event) {
    console.log('Datos del evento recibido:', event.data); // Log para inspección
    const { error } = userCreatedSchema.validate(event.data);
    if (error) {
        throw new Error(`Evento inválido: ${error.message}`);
    }
}

// Función para intentar conectar a RabbitMQ en segundo plano
async function startRabbitMQ() {
    while (true) {
        try {
            const { connection, channel } = await connectRabbitMQ();
            console.log('Conectado a RabbitMQ desde el microservicio');

            // Manejar eventos de cierre y error de la conexión
            connection.on('close', () => {
                console.warn('Conexión con RabbitMQ cerrada. Intentando reconectar...');

            });

            connection.on('error', (err) => {
                console.error('Error en la conexión con RabbitMQ:', err.message);
            });

            // Consumir eventos de RabbitMQ
            consume(QUEUE_NAME, async (event) => {
                try {

                    if (event.eventType === 'UserCreated') {
                        validateEvent(event); // Validar el evento recibido
                        await User.insertUser(event.data); // Insertar en la base de datos
                        console.log('Usuario insertado en la base de datos:', event.data);
                    } else if (event.eventType === 'UserUpdated') {
                        validateUpdateEvent(event); // Validar el evento de actualización
                        await User.updateUser(event.data); // Actualizar en la base de datos
                        console.log('Usuario actualizado en la base de datos:', event.data);
                    } else {
                        console.warn('Evento no reconocido:', event.eventType);
                    }
                } catch (error) {
                    console.error('Error al procesar evento de RabbitMQ:', error);
                }
            });

            break; // Salir del bucle si la conexión es exitosa
        } catch (err) {
            console.log('Reintentando conexión a RabbitMQ en 10 segundos...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Esperar 10 segundos antes de reintentar
        }
    }
}

// Iniciar el servidor independientemente de RabbitMQ
app.listen(PORT, () => {
    console.log(`Microservicio de Login corriendo en http://localhost:${PORT}`);
});

// Iniciar la conexión a RabbitMQ en segundo plano
startRabbitMQ();
