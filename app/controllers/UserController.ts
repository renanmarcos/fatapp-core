import { Request, Response } from 'express';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = {"success": true};
    
    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const user =  {"success": true};

    return res.json(user);
  }
}

export default new UserController();