import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { EventStoreSchema, EventUpdateSchema, EventQuerySchema }  from '../routes/EventRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

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
    event.name = validatedRequest.body.name;
    await event.save();
    
    return res.status(HttpStatus.CREATED).json(event);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;
    let event = await Event.findOne({ id: validatedRequest.params.id });

    if (event) {
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
      event.name = validatedRequest.body.name;
      await event.save();
      await event.reload();

      return res.status(HttpStatus.OK).send(event);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new EventController();