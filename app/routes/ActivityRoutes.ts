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
    roomId: Joi.number().required(),
    eventId: Joi.number().required(),
    speakerId: Joi.number().required()

    
});
  
export interface ActivityStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({

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
    roomId: Joi.number().required(),
    eventId: Joi.number().required(),
    speakerId: Joi.number().required()
    
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