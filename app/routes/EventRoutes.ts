import { Router } from 'express';
import EventController from '../controllers/EventController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface EventQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    name: Joi.string().required()
});
  
export interface EventStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}
  
const bodyUpdateSchema = Joi.object({
    name: Joi.string()
});
  
export interface EventUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', EventController.list);
routes.get('/:id', validator.params(paramsSchema), EventController.get);
routes.post('/', validator.body(bodyStoreSchema), EventController.store);
routes.delete('/:id', validator.params(paramsSchema), EventController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), EventController.update);

export default routes;