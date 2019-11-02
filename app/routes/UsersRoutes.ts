import { Router } from 'express';
import UserController from '../controllers/UserController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface UserQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.string().required().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
  password: Joi.string().required().min(6)
});

export interface UserStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  courseId: Joi.number(),
  ra: Joi.string().length(13)
});

export interface UserUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', UserController.list);
routes.get('/:id', validator.params(paramsSchema), UserController.get);
routes.delete('/:id', validator.params(paramsSchema), UserController.delete);
routes.post('/', validator.body(bodyStoreSchema), UserController.store);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), UserController.update);
routes.get('/:id/subscriptions', validator.params(paramsSchema), UserController.getSubscriptions);

export default routes;