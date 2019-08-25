'use strict'

import { Router } from 'express';
import RoomResourceController from '../controllers/RoomResourceController';

const routes = Router();

routes.get('/', RoomResourceController.get);
routes.post('/', RoomResourceController.post);
routes.delete('/:id', RoomResourceController.delete);

export default routes;