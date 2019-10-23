import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { RoomStoreSchema, RoomUpdateSchema, RoomParamsSchema, ManageResourceSchema, RemoveResourceSchema } from '../routes/RoomsRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import { Resource } from '../models/Resource';
import { RoomResource } from '../models/RoomResource';

class RoomController {

  public async list(req: Request, res: Response): Promise<Response> {
    return res.json(await Room.find({}));
  }

  public async store(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RoomStoreSchema>;

    let room = new Room();
    room.name = validatedRequest.body.name;
    room.capacity = validatedRequest.body.capacity;
    room.type = validatedRequest.body.type;
    await room.save();

    return res.status(HttpStatus.CREATED).json(room);
  }

  public async get(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });

    if (!room) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.json(room);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let room = await Room.findOne({ id: validatedRequest.params.id });

    if (room) {
      await room.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> {
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

  public async manageResource(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageResourceSchema>;
    let resource = await RoomResource.findOne({ 
      where: { 
        room: validatedRequest.params.id, 
        resource: validatedRequest.body.resourceId 
      } 
    });
    
    if (resource) {
      resource.amount = validatedRequest.body.resource_amount;
      await resource.save();
      await resource.reload();
    
      return res.status(HttpStatus.OK).send(resource);
    } 
    
    let room = await Room.findOne({ id: validatedRequest.params.id });
    let newResource = await Resource.findOne({ id: validatedRequest.body.resourceId });

    if (room && newResource) {
      let roomResource = new RoomResource();
      roomResource.resource = newResource;
      roomResource.room = room;
      roomResource.amount = validatedRequest.body.resourceAmount;
      await roomResource.save();

      return res.status(HttpStatus.OK).send({});
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getResources(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RoomParamsSchema>;
    let resources = await RoomResource.find({ where: { room: validatedRequest.params.id }, relations: ['resource'] });

    if (resources) {
      return res.status(HttpStatus.OK).send(resources);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async removeResource(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RemoveResourceSchema>;
    let resource = await RoomResource.findOne({ 
      where: { 
        resource: validatedRequest.params.resourceId,
        room: validatedRequest.params.id
      } 
    });

    if (resource) {
      await resource.remove();

      return res.sendStatus(HttpStatus.OK);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new RoomController();