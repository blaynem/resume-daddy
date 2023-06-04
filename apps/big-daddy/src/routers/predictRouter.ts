import { Router } from 'express';
import predictController from '../controllers/predictController';

const predictRouter = Router();

// Define routes
predictRouter.post('/coverLetter', predictController.coverLetterPredict);
predictRouter.post('/summary', predictController.summaryPredict);
predictRouter.post('/resume', predictController.resumeRewritePredict);
predictRouter.post('/experiences', predictController.experiencesPredict);
predictRouter.post('/questions', predictController.questionAnswerPredict);

export default predictRouter;
