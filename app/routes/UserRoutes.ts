'use strict'

import { Router } from 'express';
import UserController from '../controllers/UserController';

const routes = Router();

routes.get('/', UserController.get);
routes.post('/', UserController.post);
routes.delete('/:id', UserController.delete);

export default routes;