import { Request, Response } from 'express';
import { User } from '../models/user';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = {"success": true};
    
    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {

    const user = new User();
    user.name = "Test";
    user.email = "test@gmail.com";
    user.rg = 3034034343;
    return res.json(user);
  }
}

export default new UserController();