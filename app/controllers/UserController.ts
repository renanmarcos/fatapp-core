import { Request, Response } from 'express';
import { User } from '../models/User';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = {"success": true};
    
    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {

    const user = new User();
    user.name = "Test";
    user.email = "test@gmail.com";
    user.rg = 123454;
    await user.save();
    return res.json(user);
  }

  public async destroy (req: Request, res: Response): Promise<Response> {

    await connection.createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 1 })
    .execute();

    return res.json(User);
  }
}

export default new UserController();