import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';

const routes = Router();
const validator = createValidator();

const bodyTokenSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6)
});

export interface UserTokenSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyTokenSchema>;
}

const bodyChangePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().min(6),
  newPassword: Joi.string().required().min(6)
});

export interface UserChangePasswordSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyChangePasswordSchema>;
}

routes.post('/token', validator.body(bodyTokenSchema), AuthController.token);
routes.post('/change-password', validator.body(bodyChangePasswordSchema), AuthController.changePassword);

export default routes;