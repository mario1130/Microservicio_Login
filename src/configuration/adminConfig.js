import fs from 'fs';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Leer la ruta desde el archivo .env
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Asegúrate de que la ruta esté definida
if (!serviceAccountPath) {
    throw new Error('La ruta al archivo de credenciales de Firebase no está definida en el archivo .env: ' + serviceAccountPath);
}

// Leer el archivo JSON de credenciales
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;