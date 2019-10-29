import { Router } from 'express';
import ActivityController from '../controllers/ActivityController';
import ReportController from '../controllers/ReportController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export interface ActivityParamsSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().required(),
    targetAudience: Joi.array().required(),
    description: Joi.string().required(),
    initialDate: Joi.date().required(),
    finalDate: Joi.date().required(),
    obsActivity: Joi.string().required(),
    obsResource: Joi.string().required(),
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
    targetAudience: Joi.array().required(),
    description: Joi.string().required(),
    initialDate: Joi.date().required(),
    finalDate: Joi.date().required(),
    obsActivity: Joi.string().required(),
    obsResource: Joi.string().required(),
    roomId: Joi.number().required(),
    eventId: Joi.number().required(),
    speakerId: Joi.number().required()
});

export interface ActivityUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', ActivityController.index);
routes.get('/:id', validator.params(paramsSchema), ActivityController.get);
routes.post('/', validator.body(bodyStoreSchema), ActivityController.store);
routes.delete('/:id', validator.params(paramsSchema), ActivityController.destroy);
routes.put('/:id', validator.params(paramsSchema), validator.body(bodyUpdateSchema), ActivityController.update);

const bodyReportSchema = Joi.object({
    emails: Joi.array().required()
});

export interface ActivityReportSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyReportSchema>;
}

routes.post('/:id/excel', validator.params(paramsSchema), validator.body(bodyReportSchema), ReportController.generateActivityExcel);
routes.get('/:id/report', validator.params(paramsSchema), ReportController.generateActivityChart);

const bodyManageUserSchema = Joi.object({
    userId: Joi.number().required()
});
  
export interface ManageUserSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageUserSchema>;
}

routes.put('/:id/subscribe', validator.params(paramsSchema), validator.body(bodyManageUserSchema), ActivityController.subscribe);
routes.put('/:id/unsubscribe', validator.params(paramsSchema), validator.body(bodyManageUserSchema), ActivityController.unsubscribe);
routes.put('/:id/attendee', validator.params(paramsSchema), validator.body(bodyManageUserSchema), ActivityController.attendee);
routes.get('/:id/subscriptions', validator.params(paramsSchema), ActivityController.getSubscriptions);

const bodyRateSchema = Joi.object({
    userId: Joi.number().required(),
    numberOfStars: Joi.number().required().min(1).max(5)
});
  
export interface RateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyRateSchema>;
}

routes.post('/:id/rate', validator.params(paramsSchema), validator.body(bodyRateSchema), ActivityController.rate);

export default routes;