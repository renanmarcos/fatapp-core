import { Router } from 'express';
import ResourceController from '../controllers/ResourceController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface ResourceQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  name: Joi.string().required()
});

export interface ResourceStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
  name: Joi.string()
});

export interface ResourceUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', ResourceController.list);
routes.get('/:id', validator.params(paramsSchema), ResourceController.get);
routes.post('/', validator.body(bodyStoreSchema), ResourceController.store);
routes.delete('/:id', validator.params(paramsSchema), ResourceController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), ResourceController.update);

export default routes;