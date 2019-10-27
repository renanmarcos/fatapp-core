import { Router } from 'express';
import FileController from '../controllers/FileController';

const routes = Router();

routes.get('/:path/:morePath*?', FileController.renderPath);

export default routes;