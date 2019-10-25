import { Router } from 'express';
import CertificateController from '../controllers/CertificateController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import multer from 'multer';

const routes = Router();
const validator = createValidator();
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "storage/");
    },
    filename: function(req, file, callback) {
        callback(null, "certificates/" + file.originalname);
    }
});
const uploads = multer({ storage: storage });

const paramsSchema = Joi.object().keys({
    id: Joi.string().required()
});

export interface CertificateParamsSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({});
  
export interface CertificateStoreSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

routes.get('/', CertificateController.index);
routes.post('/:id', validator.params(paramsSchema), uploads.single('certificate'), CertificateController.store);
routes.delete('/:id', validator.params(paramsSchema), CertificateController.delete);

export default routes;