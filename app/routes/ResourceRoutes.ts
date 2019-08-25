'use strict'

import { Router } from 'express';
import ResourceController from '../controllers/ResourceController';

const routes = Router();

routes.get('/', ResourceController.get);
routes.get('/:id', ResourceController.getById);
routes.post('/', ResourceController.post);
routes.delete('/:id', ResourceController.delete);
routes.put('/:id', ResourceController.put);

export default routes;