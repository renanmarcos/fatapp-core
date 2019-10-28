import { Router } from 'express';
import CertificateController from '../controllers/CertificateController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import multer from 'multer';
import path from 'path';

const routes = Router();
const validator = createValidator();
const allowedExtensions = ['.docx'];
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "storage/");
    },
    filename: function(req, file, callback) {
        callback(null, "certificates/" + file.originalname);
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

export interface CertificateParamsSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
    name: Joi.string().required()
});
  
export interface CertificateStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

routes.get('/', CertificateController.index);
routes.post('/', uploads.single('certificate'), validator.body(bodyStoreSchema), CertificateController.store);
routes.delete('/:id', validator.params(paramsSchema), CertificateController.delete);

export default routes;