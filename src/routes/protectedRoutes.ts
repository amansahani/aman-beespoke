import { Router } from 'express';
import { hello } from '../controllers/protectedController';
import { verifyToken } from '../middlewares/authentication';

const protectedRouter = Router();

protectedRouter.use(verifyToken); // Apply the authentication middleware to all routes in this router

protectedRouter.get('/hello', hello);

export default protectedRouter;
