'use strict'

import { Router } from 'express';
import RoomTypeController from '../controllers/RoomTypeController';

const routes = Router();

routes.get('/', RoomTypeController.get);
routes.get('/:id', RoomTypeController.getById);
routes.post('/', RoomTypeController.post);
routes.delete('/:id', RoomTypeController.delete);
routes.put('/:id', RoomTypeController.put);

export default routes;