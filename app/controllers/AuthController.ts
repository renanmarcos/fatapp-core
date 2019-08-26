import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserStoreSchema, UserUpdateSchema, UserQuerySchema }  from '../routes/AuthRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class AuthController {

  public async login(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await User.find());
  }

  public async changePassword(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserQuerySchema>;
    let user = await User.findOne({ id: validatedRequest.params.id });

    if (!user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(user);
  }
}

export default new AuthController();