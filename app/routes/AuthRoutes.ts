import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import * as Joi from '@hapi/joi';
import { ValidatedRequestSchema, createValidator, ContainerTypes } from 'express-joi-validation';
import 'joi-extract-type';
import { checkJwt } from "../middlewares/CheckJwt";

const routes = Router();
const validator = createValidator();

const paramsSchema = Joi.object().keys({
  id: Joi.string().required()
});

export interface UserQuerySchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof paramsSchema>;
}

const bodyStoreSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  cpf: Joi.string().required(),
  password: Joi.string().required()
});

export interface UserStoreSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyStoreSchema>;
}

const bodyUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  cpf: Joi.string(),
  password: Joi.string()
});

export interface UserUpdateSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: Joi.extractType<typeof bodyUpdateSchema>;
}

routes.post("/login", validator.body(bodyStoreSchema), AuthController.login);
routes.post("/register", validator.body(bodyStoreSchema), AuthController.register);
routes.post("/change-password", validator.body(bodyStoreSchema), [checkJwt], AuthController.changePassword);

export default routes;