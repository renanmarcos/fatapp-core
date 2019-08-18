import { Request, Response } from 'express';
import { User } from '../models/User';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
  }

  public async store (req: Request, res: Response): Promise<Response> {

    const user = new User();
    user.name = "Test";
    user.email = "test@gmail.com";
    user.cpf = 123454;
    await user.save();
    
    return res.json(user);
  }

  public async destroy (req: Request, res: Response): Promise<Response> {

    const user = await User.find({ id: 1 });
    await user.remove();

    return res.json(user);
  }
}

export default new UserController();