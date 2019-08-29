import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as HttpStatus from 'http-status-codes';
import unless from 'express-unless';

export function requiresAuth() {

  const checkJwtMiddleware = <unless.RequestHandler>((req: Request, res: Response, next: NextFunction) => {
      authMiddleware(req, res, next);
  });

  checkJwtMiddleware.unless = unless;

  return checkJwtMiddleware;
};

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = <string> req.headers["token"];
  let jwtPayload;
  
  try {
    jwtPayload = <any> jwt.verify(token, process.env.CORE_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED).send();
  }

  const { userId, email } = jwtPayload;
  const newToken = jwt.sign(
    { userId, email }, 
    process.env.CORE_SECRET, 
    { expiresIn: "1h"}
  );
  res.setHeader("token", newToken);

  next();
};