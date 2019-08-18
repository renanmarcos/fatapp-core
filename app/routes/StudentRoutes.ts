'use strict'

import { Router } from 'express';
import StudentController from '../controllers/StudentController';

const routes = Router();

routes.get('/', StudentController.index);
routes.post('/', StudentController.store);
routes.delete('/', StudentController.destroy);

export default routes;