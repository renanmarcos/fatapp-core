import { Router } from 'express';
import ActivityController from '../controllers/ActivityController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface ActivityQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    speaker: Joi.string().required(),
    description: Joi.string().required()
});
  
export interface ActivityStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
    title: Joi.string(),
    date: Joi.date(),
    speaker: Joi.string(),
    description: Joi.string()
});

export interface ActivityUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', ActivityController.index);
routes.post('/', ActivityController.store);
routes.delete('/', ActivityController.destroy);

export default routes;