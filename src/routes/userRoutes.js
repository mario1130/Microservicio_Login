import express from 'express';
import userController from '../controllers/userController.js';
import userMiddleware from '../middlewares/userMiddleware.js';
const { validateFilterUsers } = userMiddleware;
const router = express.Router();


router.post('/by-mail', validateFilterUsers, userController.getUserByEmail);


export default router;