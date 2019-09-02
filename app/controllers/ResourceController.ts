import { Request, Response } from 'express';
import { Resource } from '../models/Resource';
import { ResourceStoreSchema, ResourceUpdateSchema, ResourceQuerySchema }  from '../routes/ResourceRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class ResourceController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Resource.find({ relations: ["rooms"] }));
  }

  public async store(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<ResourceStoreSchema>;

    let resource = new Resource();
    resource.name = validatedRequest.body.name;
    await resource.save();
    
    return res.status(HttpStatus.CREATED).json(resource);
  }

  public async get(req: Request, res: Response): Promise<Response>  
  {
    let validatedRequest = req as ValidatedRequest<ResourceQuerySchema>;
    let resource = await Resource.findOne({ id: validatedRequest.params.id });

    if (!resource) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(resource);
  }

  public async delete(req: Request, res: Response): Promise<Response>  
  {
    let validatedRequest = req as ValidatedRequest<ResourceQuerySchema>;
    let resource = await Resource.findOne({ id: validatedRequest.params.id });

    if (resource) {
      await resource.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  };

  public async update(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<ResourceUpdateSchema>;
    let resource = await Resource.findOne({ id: validatedRequest.params.id });

    if (resource) {
      resource.name = validatedRequest.body.name;
      await resource.save();
      await resource.reload();

      return res.status(HttpStatus.OK).send(resource);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ResourceController();