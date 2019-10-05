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

const bodyStoreSchema = Joi.object({

    speakerName: Joi.string().required(),
    speakerEmail: Joi.string().required(),
    speakerPhone: Joi.string().required(),
    speakerPhone2: Joi.string(),
    speakerCurriculum: Joi.string().required(),
});

export interface SpeakerStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
    speakerName: Joi.string().required(),
    speakerEmail: Joi.string().required(),
    speakerPhone: Joi.string().required(),
    speakerPhone2: Joi.string(),
    speakerCurriculum: Joi.string().required(),
});

export interface SpeakerUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', SpeakerController.list);
routes.get('/:id', validator.params(paramsSchema), SpeakerController.get);
routes.post('/', validator.body(bodyStoreSchema), SpeakerController.store);
routes.delete('/:id', validator.params(paramsSchema), SpeakerController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), SpeakerController.update);

export default routes;