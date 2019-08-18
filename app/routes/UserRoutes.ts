'use strict'

import { Router } from 'express';
import UserController from '../controllers/UserController';

const routes = Router();

routes.get('/', UserController.get);
routes.get('/:id', UserController.getById);
routes.post('/', UserController.post);
routes.delete('/:id', UserController.delete);
routes.put('/:id', UserController.put);


export default routes;