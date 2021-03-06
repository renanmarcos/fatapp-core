import { Router } from 'express';
import SpeakerController from '../controllers/SpeakerController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import multer from 'multer';
import path from 'path';

const routes = Router();
const validator = createValidator();
const allowedExtensions = ['.png', '.jpg', '.jpeg'];
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "storage/");
    },
    filename: function(req, file, callback) {
        callback(null, "speakers/" + file.originalname);
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

export interface SpeakerQuerySchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const getSchema = Joi.object({
    speakerEmail: Joi.string().email()
});

export interface SpeakerGetSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof getSchema>;
}

const bodyManageSchema = Joi.object({
    speakerName: Joi.string().required(),
    speakerEmail: Joi.string().required().email(),
    speakerPhone: Joi.string().required(),
    speakerPhone2: Joi.string(),
    speakerCurriculum: Joi.string().required(),
});

export interface SpeakerManageSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyManageSchema>;
}

routes.get('/', SpeakerController.index);
routes.post('/', uploads.single('speakerPicture'), validator.body(bodyManageSchema), SpeakerController.manageSpeaker);
routes.delete('/:id', validator.params(paramsSchema), SpeakerController.delete);

export default routes;