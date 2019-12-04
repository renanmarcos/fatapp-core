import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { EventStoreSchema, EventUpdateSchema, EventQuerySchema } from '../routes/EventsRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import path from 'path';
import fs from 'fs';
import { Certificate } from '../models/Certificate';
import { Activity } from '../models/Activity';

class EventController {

  public async index(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Event.find({ relations: ['certificate'] }));
  }

  public async getActivities(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;
    let event = await Event.findOne({ id: validatedRequest.params.id });

    if (event) {
      return res.json(await Activity.find({ 
        where: { event: event },
        relations: ['room', 'speaker', 'targetAudience'],
        order: { initialDate: "ASC" }
      }));
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;
    let event = await Event.findOne({ 
      where: { id: validatedRequest.params.id }, 
      relations: ['certificate'] 
    });

    if (!event) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(event);
  }

  public async store(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<EventStoreSchema>;
    let certificate = await Certificate.findOne({ id: validatedRequest.body.certificateId });

    if (certificate) {
      let event = new Event();
      event.title = validatedRequest.body.title;
      event.edition = validatedRequest.body.edition;
      event.description = validatedRequest.body.description;
      event.initialDate = validatedRequest.body.initialDate;
      event.finalDate = validatedRequest.body.finalDate;
      event.banner = validatedRequest.file.filename;
      event.certificate = certificate;
      await event.save();

      return res.status(HttpStatus.CREATED).json(event);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;
    let event = await Event.findOne({ id: validatedRequest.params.id });

    if (event) {
      let completePath = path.join(__dirname, '../../storage/') + event.banner;
      fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
      await event.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  };

  public async update(req: Request, res: Response): Promise<Response>  
  {
    let validatedRequest = req as ValidatedRequest<EventUpdateSchema>;
    let event = await Event.findOne({ id: validatedRequest.params.id });
    let certificate = await Certificate.findOne({ id: validatedRequest.body.certificateId });

    if (event && certificate) {
      event.title = validatedRequest.body.title;
      event.edition = validatedRequest.body.edition;
      event.description = validatedRequest.body.description;
      event.initialDate = validatedRequest.body.initialDate;
      event.finalDate = validatedRequest.body.finalDate;
      event.certificate = certificate;

      if (validatedRequest.file && event.banner !== validatedRequest.file.filename) {
        let completePath = path.join(__dirname, '../../storage/') + event.banner;
        fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
        event.banner = validatedRequest.file.filename;
      }
      
      await event.save();
      await event.reload();

      return res.status(HttpStatus.OK).send(event);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new EventController();