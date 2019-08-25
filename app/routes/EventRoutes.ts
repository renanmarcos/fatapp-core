'use strict'

import { Router } from 'express';
import EventController from '../controllers/EventController';

const routes = Router();

routes.get('/', EventController.get);
routes.get('/:id', EventController.getById);
routes.post('/', EventController.post);
routes.delete('/:id', EventController.delete);
routes.put('/:id', EventController.put);

export default routes;