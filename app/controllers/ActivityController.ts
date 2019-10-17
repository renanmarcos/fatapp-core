import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ActivityStoreSchema, ActivityUpdateSchema, ActivityQuerySchema, ManageStudentSchema} from '../routes/ActivityRoutes';
import { Subscription } from '../models/Subscription';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import { Student } from '../models/Student';

class ActivityController {
  
  public async index(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Activity.find());
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityQuerySchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (!activity) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(activity);
  }

  public async store(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityStoreSchema>;

    let activity = new Activity();
    activity.title = validatedRequest.body.title;
    activity.start_at = validatedRequest.body.start_at;
    activity.speaker = validatedRequest.body.speaker;
    activity.description = validatedRequest.body.description;
    await activity.save();
    
    return res.json(activity);
  }

  public async destroy(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityQuerySchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {
      await activity .remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityUpdateSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {
      activity.title = validatedRequest.body.title;
      activity.start_at = validatedRequest.body.start_at;
      activity.speaker = validatedRequest.body.speaker;
      activity.description = validatedRequest.body.description;
      await activity.save();
      await activity.reload();

      return res.status(HttpStatus.OK).send(activity);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async subscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageStudentSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });
    let student = await Student.findOne({ id: validatedRequest.body.studentId });
    
    var diffDate = activity.start_at.getDate() - new Date().getDate();
    var diffHours = activity.start_at.getHours() - new Date().getHours();

    if(diffDate > 0 || diffHours >= 1) {
      if (activity && student) {
        let subscription = new Subscription();
        subscription.activity = activity;
        subscription.student = student;
        subscription.attended = false;
        await subscription.save();

        return res.status(HttpStatus.OK).send(subscription);
      }

      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.status(HttpStatus.BAD_REQUEST).send("O evento vai começar em menos de 10 minutos");
  }
  
  public async attendee(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ManageStudentSchema>;
    let subscription = await Subscription.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        student: validatedRequest.body.studentId 
      } 
    });

    if (subscription) {
      subscription.attended = true;
      await subscription.save();
      await subscription.reload();

      return res.status(HttpStatus.OK).send(subscription);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async unsubscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageStudentSchema>;
    let subscription = await Subscription.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        student: validatedRequest.body.studentId 
      } 
    });

    if (subscription) {
      await subscription.remove();

      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ActivityController();