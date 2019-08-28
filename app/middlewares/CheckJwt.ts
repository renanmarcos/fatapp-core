
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as HttpStatus from 'http-status-codes';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string> req.headers["auth"];
  let jwtPayload;
  
  try {
    jwtPayload = <any> jwt.verify(token, process.env.CORE_SECRET ? process.env.CORE_SECRET : '');
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED).send();
  }

  const { userId, email } = jwtPayload;
  const newToken = jwt.sign(
    { userId, email }, 
    process.env.CORE_SECRET ? process.env.CORE_SECRET : '', 
    { expiresIn: "1h"}
  );
  res.setHeader("token", newToken);

  next();
};