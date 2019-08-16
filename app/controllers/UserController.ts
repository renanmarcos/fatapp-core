import { Request, Response } from 'express';
import { TestEntity } from '../models/TestEntity';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    return res.json(await TestEntity.find());
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const test = new TestEntity();
    test.firstName = "Timber";
    test.lastName = "Saw";
    test.isActive = true;
    await test.save();

    return res.json(test);
  }
}

export default new UserController();