import { Router } from 'express';
import SpeakerController from '../controllers/SpeakerController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface SpeakerQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const getSchema = Joi.object({
    email: Joi.string().email()
});

export interface SpeakerGetSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getSchema>;
}

const bodyManageSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    secondPhone: Joi.string().allow(''),
    curriculum: Joi.string().required(),
});

export interface SpeakerManageSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageSchema>;
}

routes.get('/', SpeakerController.index);
routes.post('/', validator.body(bodyManageSchema), SpeakerController.manageSpeaker);
routes.delete('/:id', validator.params(paramsSchema), SpeakerController.delete);

export default routes;