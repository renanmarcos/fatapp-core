import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserStoreSchema, UserUpdateSchema, UserQuerySchema }  from '../routes/UserRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class UserController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await User.find());
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserQuerySchema>;
    let user = await User.findOne({ id: validatedRequest.params.id });

    if (!user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(user);
  }

  public async store(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserStoreSchema>;

    const user = new User();
    user.name = validatedRequest.body.name;
    user.email = validatedRequest.body.email;
    user.cpf = validatedRequest.body.cpf;
    user.password = validatedRequest.body.password;
    user.hashPassword();
    await user.save();
    
    return res.status(HttpStatus.CREATED).json(user);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserQuerySchema>;
    let user = await User.findOne({ id: validatedRequest.params.id });

    if (user) {
      await user.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<UserUpdateSchema>;

    let user = await User.findOne({ id: validatedRequest.params.id });

    if (user) {
      user.name = validatedRequest.body.name;
      user.email = validatedRequest.body.email;
      user.cpf = validatedRequest.body.cpf;
      user.password = validatedRequest.body.password;
      user.hashPassword();
      await user.save();
      await user.reload();

      return res.status(HttpStatus.OK).send(user);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new UserController();