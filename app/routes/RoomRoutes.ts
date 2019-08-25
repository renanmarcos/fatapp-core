'use strict'

import { Router } from 'express';
import RoomController from '../controllers/RoomController';

const routes = Router();

routes.get('/', RoomController.get);
routes.get('/:id', RoomController.getById);
routes.post('/', RoomController.post);
routes.delete('/:id', RoomController.delete);
routes.put('/:id', RoomController.put);

export default routes;