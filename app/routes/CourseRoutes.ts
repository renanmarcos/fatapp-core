import { Router } from 'express';
import CourseController from '../controllers/CourseController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface CourseQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  name: Joi.string().required()
});

export interface CourseStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
  name: Joi.string()
});

export interface CourseUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', CourseController.list);
routes.get('/:id', validator.params(paramsSchema), CourseController.get);
routes.post('/', validator.body(bodyStoreSchema), CourseController.store);
routes.delete('/:id', validator.params(paramsSchema), CourseController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), CourseController.update);

export default routes;