import { Router } from 'express';
import EventController from '../controllers/EventController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import ReportController from '../controllers/ReportController';
import multer from 'multer';

const routes = Router();
const validator = createValidator();
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "storage/");
    },
    filename: function(req, file, callback) {
        callback(null, "events/" + file.originalname);
    }
});
const uploads = multer({ storage: storage });

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface EventQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    title: Joi.string().required(),
    edition: Joi.string().required(),
    initialDate: Joi.date().required(),
    finalDate: Joi.date().required(),
    certificateId: Joi.number().required()
});
  
export interface EventStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}
  
const bodyUpdateSchema = Joi.object({
    title: Joi.string(),
    edition: Joi.string(),
    initialDate: Joi.date(),
    finalDate: Joi.date(),
    certificateId: Joi.number()
});
  
export interface EventUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', EventController.list);
routes.get('/:id', validator.params(paramsSchema), EventController.get);
routes.post('/', uploads.single('banner'), validator.body(bodyStoreSchema), EventController.store);
routes.delete('/:id', validator.params(paramsSchema), EventController.delete);
routes.put('/:id', uploads.single('banner'), validator.params(paramsSchema), validator.body(bodyUpdateSchema), EventController.update);
routes.get('/:id/report', validator.params(paramsSchema), ReportController.generateEventReport);

export default routes;