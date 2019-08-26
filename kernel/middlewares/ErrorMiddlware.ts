import { NextFunction, Request, Response, RequestHandler } from 'express';
import HttpException from '../../app/controllers/exceptions/HttpException';

const errorMiddleware: RequestHandler  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  Promise.resolve(next()).catch(() => {
    console.log(12);
  })
}

export default errorMiddleware;