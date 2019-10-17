import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserTokenSchema, UserChangePasswordSchema }  from '../routes/AuthRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

class AuthController {

  public async token(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserTokenSchema>;
    let user = await User.findOne({email: validatedRequest.body.email});
    
    if (!user) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    if (!user.checkIfUnencryptedPasswordIsValid(validatedRequest.body.password)) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.CORE_SECRET ? process.env.CORE_SECRET: 'secret'
    );

    return res.send({
      'token': token
    });
  }

  public async changePassword(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserChangePasswordSchema>;
  
    let id = res.locals.jwtPayload.userId;
    let user = await User.findOne(id);

    if (!user) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    if (!user.checkIfUnencryptedPasswordIsValid(validatedRequest.body.oldPassword)) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    user.password = validatedRequest.body.newPassword;
    user.hashPassword();
    user.save();

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}

export default new AuthController();