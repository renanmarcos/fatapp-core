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
    start_at: Joi.string().required(),
    speaker: Joi.string().required(),
    description: Joi.string().required()
});
  
export interface ActivityStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
    title: Joi.string(),
    start_at: Joi.string(),
    speaker: Joi.string(),
    description: Joi.string()
});

export interface ActivityUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', ActivityController.index);
routes.get('/:id', validator.params(paramsSchema), ActivityController.get);
routes.post('/', validator.body(bodyStoreSchema), ActivityController.store);
routes.delete('/:id', validator.params(paramsSchema), ActivityController.destroy);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), ActivityController.update);

const bodyManageStudentSchema = Joi.object({
    studentId: Joi.number().required()
});
  
export interface ManageStudentSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageStudentSchema>;
}

routes.put('/:id/subscribe', validator.params(paramsSchema), validator.body(bodyManageStudentSchema), ActivityController.subscribe);
routes.put('/:id/unsubscribe', validator.params(paramsSchema), validator.body(bodyManageStudentSchema), ActivityController.unsubscribe);
routes.put('/:id/attendee', validator.params(paramsSchema), validator.body(bodyManageStudentSchema), ActivityController.attendee);

export default routes;