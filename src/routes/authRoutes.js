import express from 'express';
import { validate } from '../utils/token.js';
import authController from '../controllers/authController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

const { validateFilterUsers } = userMiddleware;

const router = express.Router();


router.post('/by-mail', validateFilterUsers, authController.getUserByEmail);

// Ruta para iniciar sesión con Google
router.post('/login', async (req, res) => {
    const { token_id } = req.body;
    const decodedToken = await validate(token_id);
    if (decodedToken.uid != '') {
        authController.login(decodedToken, res);
    } else {
        res.status(401).json({ message: 'Token inválido' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', async (req, res) => {
    authController.logout(req, res);
});

// Ruta para restablecer contraseña
router.post('/reset-password', async (req, res) => {
    authController.resetPassword(req, res);
});

export default router;