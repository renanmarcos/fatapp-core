import { Router } from 'express';
import EventController from '../controllers/EventController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import multer from 'multer';
import path from 'path';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';

const routes = Router();
const validator = createValidator();
const allowedExtensions = ['.png', '.jpg', '.jpeg'];
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "storage/");
    },
    filename: function(req, file, callback) {
        callback(null, "events/" + file.originalname);
    }
});
const uploads = multer({ 
    storage: storage, 
    fileFilter: function (req, file, callback) {
        var extension = path.extname(file.originalname);
        if(!allowedExtensions.includes(extension)) 
            return callback(
                new Error('Só é permitido o envio de arquivos nos formatos: ' + allowedExtensions), 
                false
            );

        callback(null, true);
    }
});

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface EventQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    title: Joi.string().required(),
    edition: Joi.string().required(),
    description: Joi.string().required(),
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
    description: Joi.string(),
    initialDate: Joi.date(),
    finalDate: Joi.date(),
    certificateId: Joi.number()
});
  
export interface EventUpdateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.get('/', EventController.index);
routes.get('/:id', validator.params(paramsSchema), EventController.get);
routes.post('/', uploads.single('banner'), validator.body(bodyStoreSchema), EventController.store);
routes.delete('/:id', validator.params(paramsSchema), EventController.delete);
routes.put('/:id', uploads.single('banner'), validator.params(paramsSchema), validator.body(bodyUpdateSchema), EventController.update);

routes.get('/:id/activities', validator.params(paramsSchema), EventController.getActivities);

export default routes;