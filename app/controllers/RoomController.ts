import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { RoomStoreSchema, RoomUpdateSchema, RoomParamsSchema, AddResourceSchema }  from '../routes/RoomRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import { Resource } from '../models/Resource';
import { RoomResource } from '../models/RoomResource';

class RoomController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Room.find( { relations: ['roomResources'] } ));
  }

  public async store(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<RoomStoreSchema>;

    let room = new Room();
    room.name = validatedRequest.body.name;
    room.capacity = validatedRequest.body.capacity;
    room.type = validatedRequest.body.type;
    await room.save();
    
    return res.status(HttpStatus.CREATED).json(room);
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });

    if (!room) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(room);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });

    if (room) {
      await room.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<RoomUpdateSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });

    if (room) {
      room.name = validatedRequest.body.name;
      room.capacity = validatedRequest.body.capacity;
      room.type = validatedRequest.body.type;
      await room.save();
      await room.reload();

      return res.status(HttpStatus.OK).send(room);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async addResource(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<AddResourceSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });
    let resource = await Resource.findOne({ id: validatedRequest.body.resource_id });

    if (room) {
      let roomResource = new RoomResource();
      roomResource.resource = resource;
      roomResource.room = room;
      roomResource.resourceAmmount = validatedRequest.body.resource_amount;
      await roomResource.save();

      return res.status(HttpStatus.OK).send({});
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getResources(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let room = await Room.findOne({where: {id: validatedRequest.params.id}, relations: ['roomResources']});

    if (room) {
      return res.status(HttpStatus.OK).send(room.roomResources);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new RoomController();