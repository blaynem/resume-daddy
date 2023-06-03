import { Router } from 'express';
import predictController from '../controllers/predictController';

const predictRouter = Router();

// Define routes
predictRouter.get('/coverLetter', predictController.coverLetterPredict);
predictRouter.get('/summary', predictController.summaryPredict);
predictRouter.get('/resume', predictController.resumeRewritePredict);
predictRouter.get('/experiences', predictController.experiencesPredict);

export default predictRouter;
