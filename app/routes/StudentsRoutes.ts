import { Router } from 'express';
import StudentController from '../controllers/StudentController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface StudentQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  ra: Joi.string().required().length(13),
  courseId: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.string().required().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
  password: Joi.string().required().min(6)
});

export interface StudentStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email()
});

export interface StudentUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', StudentController.list);
routes.get('/:id', validator.params(paramsSchema), StudentController.get);
routes.post('/', validator.body(bodyStoreSchema), StudentController.store);
routes.delete('/:id', validator.params(paramsSchema), StudentController.delete);
routes.put('/:id', validator.body(bodyUpdateSchema), StudentController.update);

export default routes;