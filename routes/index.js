import { Router } from 'express';
import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';
import commentRoutes from './commentRoutes.js';

const router = Router();

router.use('/comment', commentRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);

export default router;
