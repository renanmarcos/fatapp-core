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
    speakerEmail: Joi.string().allow('')
});

export interface SpeakerGetSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getSchema>;
}

const bodyManageSchema = Joi.object({

    speakerName: Joi.string().required(),
    speakerEmail: Joi.string().required(),
    speakerPhone: Joi.string().required(),
    speakerPhone2: Joi.string().allow(''),
    speakerCurriculum: Joi.string().required(),
});

export interface SpeakerManageSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageSchema>;
}

routes.get('/', SpeakerController.get);
routes.post('/', validator.body(bodyManageSchema), SpeakerController.manageSpeaker);
routes.delete('/:id', validator.params(paramsSchema), SpeakerController.delete);

export default routes;