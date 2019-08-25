'use strict'

import { Router } from 'express';
import StudentController from '../controllers/StudentController';

const routes = Router();

routes.get('students/', StudentController.get);
routes.get('students/:id', StudentController.getById);
routes.post('students/', StudentController.post);
routes.delete('students/:id', StudentController.delete);
routes.put('students/:id', StudentController.put);

export default routes;