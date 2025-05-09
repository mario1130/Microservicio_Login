import admin from '../configuration/adminConfig.js'

export async function validate(token_id) {
    try {
        // Verifica el token con Firebase Admin SDK

        const token = await admin.auth().verifyIdToken(token_id);

        return token;

    } catch (error) {
        console.error('Error al verificar el token:', error);
        return false;
    }
}

export default validate;