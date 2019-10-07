import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ValidatedRequest } from 'express-joi-validation';
import { ActivityStoreSchema, ActivityParamsSchema, ActivityUpdateSchema } from '../routes/ActivityRoutes';
import { Room } from '../models/Room';
import * as HttpStatus from 'http-status-codes';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';

class ActivityController {

  public async list(req: Request, res: Response): Promise<Response> {
    return res.json(await Activity.find({ relations: ['room', 'event', 'speaker'] }));
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
            activity.targetAudience = validatedRequest.body.targetAudience;
            activity.description = validatedRequest.body.description;
            activity.initialDate = validatedRequest.body.initialDate;
            activity.finalDate = validatedRequest.body.finalDate;
            activity.obsActivity = validatedRequest.body.obsActivity;
            activity.obsResource = validatedRequest.body.obsResource;
            activity.isActive = validatedRequest.body.isActive;
            activity.qrCode = validatedRequest.body.qrCode;
            activity.room = validatedRequest.body.roomId;
            activity.event = validatedRequest.body.eventId;
            activity.speaker = validatedRequest.body.speakerId;

            //await activity.save();
            //await activity.reload();
            console.log ('SUCESSO KRAE');
            return res.status(HttpStatus.CREATED).json(activity);
          }
          return res.status(HttpStatus.NOT_ACCEPTABLE).send('Activity date must be between Event date. ' + event.initialDate + ' to ' + event.finalDate);
        }
        return res.status(HttpStatus.NOT_FOUND).send('Speaker not found');
      }
      return res.status(HttpStatus.NOT_FOUND).send('Event not found');
    }
    return res.status(HttpStatus.NOT_FOUND).send('Room not found');
  }

  public async get(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ where: { id: validatedRequest.params.id }, relations: ['room', 'event', 'speaker'] });

    if (!activity) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.json(activity);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {
      await activity.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityUpdateSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {

      activity.title = validatedRequest.body.title;
      activity.type = validatedRequest.body.type;
      activity.targetAudience = validatedRequest.body.targetAudience;
      activity.description = validatedRequest.body.description;
      activity.initialDate = validatedRequest.body.initialDate;
      activity.finalDate = validatedRequest.body.finalDate;
      activity.obsActivity = validatedRequest.body.obsActivity;
      activity.obsResource = validatedRequest.body.obsResource;
      activity.isActive = validatedRequest.body.isActive;
      activity.qrCode = validatedRequest.body.qrCode;
      activity.room = validatedRequest.body.roomId;
      activity.event = validatedRequest.body.eventId;
      activity.speaker = validatedRequest.body.speakerId;

      await activity.save();
      await activity.reload();

      return res.status(HttpStatus.OK).send(activity);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ActivityController();