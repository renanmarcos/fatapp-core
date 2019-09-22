import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ActivityStoreSchema, ActivityUpdateSchema, ActivityQuerySchema, ManageStudentSchema, RemoveStudentSchema, SubscriptionUpdateSchema } from '../routes/ActivityRoutes';
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
    let student = await Student.findOne({ id: validatedRequest.body.student_id });
    
    var diffDate = activity.start_at.getDate() - new Date().getDate();
    var diffMinutes = activity.start_at.getMinutes() - new Date().getMinutes();
    var diffHours = activity.start_at.getHours() - new Date().getHours();

    if(diffDate > 0 || diffHours > 0 || diffMinutes > 10) {
      if (activity && student) {
        let subscription = new Subscription();
        subscription.activity = activity;
        subscription.student = student;
        subscription.attended = validatedRequest.body.attended;
        await subscription.save();
        return res.status(HttpStatus.OK).send(subscription);
      }
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  return res.status(HttpStatus.BAD_REQUEST).send("O evento vai começar em menos de 10 minutos");
  }
  
  public async updateAttended(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<SubscriptionUpdateSchema>;
    let subscription = await Subscription.findOne({ id: validatedRequest.params.id });

    if (subscription) {
      subscription.attended = validatedRequest.body.attended;
      await subscription.save();
      await subscription.reload();

      return res.status(HttpStatus.OK).send(subscription);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getSubscriptions(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityQuerySchema>;
    let subscriptions = await Subscription.find({ where: { activity: validatedRequest.params.id }, relations: ['student'] });

    if (subscriptions) {
      return res.status(HttpStatus.OK).send(subscriptions);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async unsubscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RemoveStudentSchema>;
    let studentToRemove = await Subscription.findOne({ id: validatedRequest.body.activity_student_id });

    if (studentToRemove) {
      await studentToRemove.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

}

export default new ActivityController();