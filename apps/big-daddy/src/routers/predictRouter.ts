import { Router } from 'express';
import predictController from '../controllers/predictController';

const predictRouter = Router();

// Define routes
predictRouter.get('/coverLetter', predictController.coverLetterPredict);
// resumeRouter.get('/:id', predictController.getUserById);

export default predictRouter;
