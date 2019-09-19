import { Request, Response } from 'express';
import { Activity } from '../models/Activity';

class ActivityController {
  
  public async index(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Activity.find());
  }

  public async store(req: Request, res: Response): Promise<Response> 
  {
    let activity = new Activity();
    activity.title = "Test";
    activity.date = new Date();
    activity.speaker = "TestName";
    activity.description = "TestDescription";
    await activity.save();
    
    return res.json(activity);
  }

  public async destroy(req: Request, res: Response): Promise<Response> 
  {
    const activity = await Activity.findOne({ id: 1 });
    if (activity != undefined) await activity.remove();

    return res.status(201);
  }
}

export default new ActivityController();