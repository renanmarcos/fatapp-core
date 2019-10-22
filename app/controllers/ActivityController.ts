import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ValidatedRequest } from 'express-joi-validation';
import { ActivityStoreSchema, ActivityParamsSchema, ActivityUpdateSchema, ManageUserSchema } from '../routes/ActivityRoutes';
import { Room } from '../models/Room';
import * as HttpStatus from 'http-status-codes';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';
import { Course } from '../models/Course';
import { Subscription } from '../models/Subscription';
import { User } from '../models/User';

class ActivityController {

  public async index(req: Request, res: Response): Promise<Response> {
    return res.json(await Activity.find({ relations: ['room', 'event', 'speaker', 'targetAudience'] }));
  }

  public async store(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityStoreSchema>;
    let room = await Room.findOne({ id: validatedRequest.body.roomId });
    let event = await Event.findOne({ id: validatedRequest.body.eventId });
    let speaker = await Speaker.findOne({ id: validatedRequest.body.speakerId });

    if (room) {
      if (event) {
        if (speaker) {
          if (event.initialDate < validatedRequest.body.initialDate && event.finalDate > validatedRequest.body.finalDate) {
            let activity = new Activity();

            activity.title = validatedRequest.body.title;
            activity.type = validatedRequest.body.type;
            activity.description = validatedRequest.body.description;
            activity.initialDate = validatedRequest.body.initialDate;
            activity.finalDate = validatedRequest.body.finalDate;
            activity.obsActivity = validatedRequest.body.obsActivity;
            activity.obsResource = validatedRequest.body.obsResource;
            activity.qrCode = "teste";
            activity.room = validatedRequest.body.roomId;
            activity.event = validatedRequest.body.eventId;
            activity.speaker = validatedRequest.body.speakerId;

            let courses = Array.from(validatedRequest.body.targetAudience);
            let arrayOfCourses = [];

            for (let i = 0; i < courses.length; i++) {
              let courseId: any = courses[i];
              let courseToFind = await Course.findOne({ id: courseId });
              if (!courseToFind){
                return res.status(HttpStatus.NOT_FOUND).send('Course not found. Please double check it and try again!\nId of course not found is ' + courseId);
              }
              arrayOfCourses.push(courseToFind);
            }

            activity.targetAudience = arrayOfCourses;

            await activity.save();
            await activity.reload();

            return res.status(HttpStatus.CREATED).json(await Activity.findOne({ where: { id: activity.id }, relations: ['room', 'event', 'speaker', 'targetAudience'] }));
          }
          return res.status(HttpStatus.NOT_ACCEPTABLE).send('Activity date must be between Event date. \n' + event.initialDate + ' to ' + event.finalDate);
        }
        return res.status(HttpStatus.NOT_FOUND).send('Speaker not found');
      }
      return res.status(HttpStatus.NOT_FOUND).send('Event not found');
    }
    return res.status(HttpStatus.NOT_FOUND).send('Room not found');
  }

  public async get(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ where: { id: validatedRequest.params.id }, relations: ['room', 'event', 'speaker', 'targetAudience'] });

    if (!activity) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.json(activity);
  }

  public async destroy(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
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
      let room = await Room.findOne({ id: validatedRequest.body.roomId });
      let event = await Event.findOne({ id: validatedRequest.body.eventId });
      let speaker = await Speaker.findOne({ id: validatedRequest.body.speakerId });

      if (room) {
        if (event) {
          if (speaker) {
            if (event.initialDate < validatedRequest.body.initialDate && event.finalDate > validatedRequest.body.finalDate) {

              activity.title = validatedRequest.body.title;
              activity.type = validatedRequest.body.type;
              activity.description = validatedRequest.body.description;
              activity.initialDate = validatedRequest.body.initialDate;
              activity.finalDate = validatedRequest.body.finalDate;
              activity.obsActivity = validatedRequest.body.obsActivity;
              activity.obsResource = validatedRequest.body.obsResource;
              activity.qrCode = "teste";
              activity.room = validatedRequest.body.roomId;
              activity.event = validatedRequest.body.eventId;
              activity.speaker = validatedRequest.body.speakerId;

              let courses = Array.from(validatedRequest.body.targetAudience);
              let arrayOfCourses = [];

              for (let i = 0; i < courses.length; i++) {
                let courseId: any = courses[i];
                let courseToFind = await Course.findOne({ id: courseId });
                arrayOfCourses.push(courseToFind);
              }

              activity.targetAudience = arrayOfCourses;

              await activity.save();
              await activity.reload();

              return res.status(HttpStatus.OK).json(await Activity.findOne({ where: { id: activity.id }, relations: ['room', 'event', 'speaker', 'targetAudience'] }));
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).send('Activity date must be between Event date. \n' + event.initialDate + ' to ' + event.finalDate);
          }
          return res.status(HttpStatus.NOT_FOUND).send('Speaker not found');
        }
        return res.status(HttpStatus.NOT_FOUND).send('Event not found');
      }
      return res.status(HttpStatus.NOT_FOUND).send('Room not found');
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async subscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });
    let user = await User.findOne({ id: validatedRequest.body.userId });
    
    var diffDate = activity.initialDate.getDate() - new Date().getDate();
    var diffHours = activity.initialDate.getHours() - new Date().getHours();

    if(diffDate > 0 || diffHours >= 1) {
      if (activity && user) {
        let subscription = new Subscription();
        subscription.activity = activity;
        subscription.user = user;
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
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let subscription = await Subscription.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        user: validatedRequest.body.userId 
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
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let user = await User.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        user: validatedRequest.body.userId 
      } 
    });

    if (user) {
      await user.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getSubscriptions(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let subscriptions = await Subscription.find({ 
      where: { activity: validatedRequest.params.id }, 
      relations: ['user', 'user.student', 'user.student.course'] 
    });

    if (subscriptions) {
      return res.status(HttpStatus.OK).send(subscriptions);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ActivityController();