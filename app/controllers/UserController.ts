import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserStoreSchema, UserUpdateSchema, UserQuerySchema }  from '../routes/UserRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import { Subscription } from '../models/Subscription';
import jwt from 'jsonwebtoken';

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
    let user = await User.findOne({where: {cpf: validatedRequest.body.cpf}});
    
    if (user) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        error: 'CPF já existe'
      });
    }

    user = new User();
    user.name = validatedRequest.body.name;
    user.email = validatedRequest.body.email;
    user.cpf = validatedRequest.body.cpf;
    user.password = validatedRequest.body.password;
    user.hashPassword();
    await user.save();

    let token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.CORE_SECRET ? process.env.CORE_SECRET: 'secret'
    );
    
    return res.status(HttpStatus.CREATED).json({
      token: token,
      user
    });
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
      await user.save();
      await user.reload();

      return res.status(HttpStatus.OK).send(user);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getSubscriptions(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<UserQuerySchema>;
    let subscriptions = await Subscription.find({ 
      where: { user: validatedRequest.params.id }, 
      relations: ['activity'] 
    });

    if (subscriptions) {
      return res.status(HttpStatus.OK).send(subscriptions);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new UserController();