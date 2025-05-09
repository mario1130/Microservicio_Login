import amqplib from 'amqplib';
import crypto from 'crypto';
import fs from 'fs';
import 'dotenv/config';

let connection;
let channel;

// Configuración de cifrado
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');  // Clave de 32 bytes

// Validar longitud de la clave y el IV
if (key.length !== 32) {
    throw new Error('La clave debe ser de 32 bytes (64 caracteres hex).');
}

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'rabbitmq';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || '5671';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;



export async function connectRabbitMQ() {
    const tlsOptions = {
        ca: [fs.readFileSync('./certs/ca_certificate.pem')],
        cert: fs.readFileSync('./certs/server_certificate.pem'),
        key: fs.readFileSync('./certs/server_key.pem'),
        rejectUnauthorized: false
    };

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
        try {
            console.log(`Intentando conectar a RabbitMQ en ${RABBITMQ_HOST}:${RABBITMQ_PORT} usando TLS...`);
            connection = await amqplib.connect(`amqps://${RABBITMQ_HOST}:${RABBITMQ_PORT}`, tlsOptions);
            channel = await connection.createChannel();

            connection.on('close', () => {
                console.warn('Conexión con RabbitMQ cerrada.');
                connection = null;
                channel = null;
            });

            connection.on('error', (err) => {
                console.error('Error en la conexión con RabbitMQ:', err.message);
            });

            console.log('Conexión segura a RabbitMQ establecida');
            return { connection, channel };
        } catch (err) {
            attempts++;
            console.error(`Fallo al conectar a RabbitMQ. Intento ${attempts}/${MAX_RETRIES}`);
            if (attempts === MAX_RETRIES) {
                console.error('Se alcanzó el máximo de reintentos. Saliendo...');
                process.exit(1);
            }
            console.log(`Reintentando en ${RETRY_DELAY / 1000} segundos...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

export async function consume(queue, callback) {
    if (!queue) {
        throw new Error('El nombre de la cola no puede estar vacío.');
    }

    if (!channel) {
        console.warn('El canal no está disponible. Intentando reconectar...');
        await connectRabbitMQ(); // Si el canal está caído, reconéctalo
    }

    try {
        await channel.assertQueue(queue);
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                try {
                    const { encrypted, iv } = JSON.parse(msg.content.toString());

                    console.log('Mensaje recibido cifrado:', encrypted);
                    console.log('IV recibido:', iv);

                    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
                    let decrypted = decipher.update(encrypted, 'hex', 'utf8'); // Entrada en HEX, salida en UTF-8
                    decrypted += decipher.final('utf8');

                    console.log('Mensaje descifrado:', decrypted);

                    const data = JSON.parse(decrypted);
                    callback(data);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error al procesar el mensaje cifrado:', error);
                    channel.nack(msg); // Rechazar para reintento
                }
            }
        });
    } catch (error) {
        console.error(`Error al consumir mensajes de la cola "${queue}":`, error);
        throw error;
    }
}


export async function publish(queue, message) {
    if (!channel) {
        console.warn('El canal no está disponible. Intentando reconectar...');
        await connectRabbitMQ();
    }

    try {
        // Generar IV dinámico
        const dynamicIV = crypto.randomBytes(16);

        // Cifrar el mensaje con IV dinámico
        const cipher = crypto.createCipheriv(algorithm, key, dynamicIV);
        let encrypted = cipher.update(JSON.stringify(message), 'utf8', 'hex'); // Codificar entrada como UTF-8
        encrypted += cipher.final('hex');
        // Log para depurar
        console.log('Mensaje original:', message);
        console.log('Mensaje cifrado:', encrypted);
        console.log('IV utilizado:', dynamicIV.toString('hex'));

        // Enviar el mensaje cifrado y el IV
        await channel.assertQueue(queue);
        channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify({
                encrypted,
                iv: dynamicIV.toString('hex')
            }))
        );

        console.log(`Mensaje cifrado publicado en la cola "${queue}":`, encrypted);
    } catch (error) {
        console.error(`Error al publicar mensaje en la cola "${queue}":`, error);
        throw error;
    }
}