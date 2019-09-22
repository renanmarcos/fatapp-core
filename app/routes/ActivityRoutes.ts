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
routes.get('/:id', validator.params(paramsSchema), ActivityController.get);
routes.post('/', validator.body(bodyStoreSchema), ActivityController.store);
routes.delete('/:id', validator.params(paramsSchema), ActivityController.destroy);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), ActivityController.update);

const bodyManageStudentSchema = Joi.object({
    student_id: Joi.number().required(),
    attended: Joi.boolean().required()
  });
  
  export interface ManageStudentSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageStudentSchema>;
}

const bodyRemoveStudentSchema = Joi.object({
    activity_student_id: Joi.number().required()
  });
  
  export interface RemoveStudentSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyRemoveStudentSchema>;
  }

routes.post('/:id/subscribe', validator.params(paramsSchema), validator.body(bodyManageStudentSchema), ActivityController.subscribe);
routes.get('/:id/subscriptions', validator.params(paramsSchema), ActivityController.getSubscriptions);
routes.post('/:id/subscribe', validator.params(paramsSchema), validator.body(bodyRemoveStudentSchema), ActivityController.unsubscribe);

export default routes;