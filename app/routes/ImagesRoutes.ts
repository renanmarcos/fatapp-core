import { Router } from 'express';
import ImageController from '../controllers/ImageController';

const routes = Router();

routes.get('/:path/:morePath*?', ImageController.renderPath);

export default routes;