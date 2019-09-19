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

export interface ActivityParamsSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().required(),
    targetAudience: Joi.string().required(),
    description: Joi.string().required(),
    initialDate: Joi.date().required(),
    finalDate: Joi.date().required(),
    obsActivity: Joi.string().required(),
    obsResource: Joi.string().required(),
    isActive: Joi.boolean().required(),
    qrCode: Joi.string().required(),
    speakerName: Joi.string().required(),
    speakerEmail: Joi.string().required(),
    speakerPhone: Joi.string().required(),
    speakerCurriculum: Joi.string().required(),
    roomId: Joi.number().required(),
    
});
  
export interface ActivityStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
    title: Joi.string(),
    type: Joi.string(),
    targetAudience: Joi.string(),
    description: Joi.string(),
    initialDate: Joi.date(),
    finalDate: Joi.date(),
    obsActivity: Joi.string(),
    obsResource: Joi.string(),
    isActive: Joi.boolean(),
    qrCode: Joi.string(),
    speakerName: Joi.string(),
    speakerEmail: Joi.string(),
    speakerPhone: Joi.string(),
    speakerCurriculum: Joi.string(),
    roomId: Joi.number(),
});

export interface ActivityUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/',ActivityController.list);
routes.get('/:id', validator.params(paramsSchema), ActivityController.get);
routes.post('/', validator.body(bodyStoreSchema), ActivityController.store);
routes.delete('/:id', validator.params(paramsSchema), ActivityController.delete);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), ActivityController.update);

export default routes;