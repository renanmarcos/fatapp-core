import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ValidatedRequest } from 'express-joi-validation';
import { ActivityStoreSchema, ActivityParamsSchema, ActivityUpdateSchema } from '../routes/ActivityRoutes';
import { Room } from '../models/Room';
import * as HttpStatus from 'http-status-codes';

class ActivityController {

  public async list(req: Request, res: Response): Promise<Response> {
    return res.json(await Activity.find({relations: ['room']}));
  }

  public async store(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityStoreSchema>;

    let room = await Room.findOne({ id: validatedRequest.body.roomId });

    if (room) {
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
      activity.speakerName = validatedRequest.body.speakerName;
      activity.speakerEmail = validatedRequest.body.speakerEmail;
      activity.speakerPhone = validatedRequest.body.speakerPhone;
      activity.speakerCurriculum = validatedRequest.body.speakerCurriculum;
      activity.room = validatedRequest.body.roomId;
      await activity.save();
      await activity.reload();
      return res.status(HttpStatus.CREATED).json(activity);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async get(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ where: { id: validatedRequest.params.id }, relations: ['room'] });

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
      activity.speakerName = validatedRequest.body.speakerName;
      activity.speakerEmail = validatedRequest.body.speakerEmail;
      activity.speakerPhone = validatedRequest.body.speakerPhone;
      activity.speakerCurriculum = validatedRequest.body.speakerCurriculum;
      activity.room = validatedRequest.body.roomId;
      await activity.save();
      await activity.reload();

      return res.status(HttpStatus.OK).send(activity);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ActivityController();