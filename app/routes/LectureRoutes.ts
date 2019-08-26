import { Router } from 'express';
import LectureController from '../controllers/LectureController';

const routes = Router();

routes.get('/', LectureController.index);
routes.post('/', LectureController.store);
routes.delete('/', LectureController.destroy);

export default routes;