import { Router } from 'express';
import RoomController from '../controllers/RoomController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface RoomParamsSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  name: Joi.string().required(),
  capacity: Joi.number().required(),
  type: Joi.string().required()
});

export interface RoomStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
    name: Joi.string(),
    capacity: Joi.number(),
    type: Joi.string()
});

export interface RoomUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', RoomController.list);
routes.get('/:id', validator.params(paramsSchema), RoomController.get);
routes.post('/', validator.body(bodyStoreSchema), RoomController.store);
routes.delete('/:id', validator.params(paramsSchema), RoomController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), RoomController.update);

const bodyAddResourceSchema = Joi.object({
  resource_id: Joi.string().required(),
  resource_amount: Joi.string().required()
});

export interface AddResourceSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyAddResourceSchema>;
}


routes.post('/:id/resources', validator.params(paramsSchema), validator.body(bodyAddResourceSchema), RoomController.addResource);
routes.get('/:id/resources', validator.params(paramsSchema), RoomController.getResources);
export default routes;