import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  // updateComment,
} from '../controller/commentController.js';

const router = Router();

router.get('/', getComments);
router.get('/:id', getComment);
router.post('/', createComment);
// router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
