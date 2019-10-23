import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { EventStoreSchema, EventUpdateSchema, EventQuerySchema } from '../routes/EventsRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import path from 'path';
import fs from 'fs';

class EventController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Event.find());
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;
    let event = await Event.findOne({ id: validatedRequest.params.id });

    if (!event) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(event);
  }

  public async store(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<EventStoreSchema>;
    let event = new Event();

    event.title = validatedRequest.body.title;
    event.edition = validatedRequest.body.edition;
    event.initialDate = validatedRequest.body.initialDate;
    event.finalDate = validatedRequest.body.finalDate;
    event.banner = validatedRequest.file.filename;

    await event.save();
    
    return res.status(HttpStatus.CREATED).json(event);
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

    if (event) {
      event.title = validatedRequest.body.title;
      event.edition = validatedRequest.body.edition;
      event.initialDate = validatedRequest.body.initialDate;
      event.finalDate = validatedRequest.body.finalDate;

      if (validatedRequest.file) {
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