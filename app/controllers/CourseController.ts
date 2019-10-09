import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { CourseStoreSchema, CourseUpdateSchema, CourseQuerySchema }  from '../routes/CourseRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class CourseController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Course.find({ }));
  }

  public async store(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<CourseStoreSchema>;

    let course = new Course();
    course.name = validatedRequest.body.name;
    await course.save();
    
    return res.status(HttpStatus.CREATED).json(course);
  }

  public async get(req: Request, res: Response): Promise<Response>  
  {
    let validatedRequest = req as ValidatedRequest<CourseQuerySchema>;
    let course = Course.findOne({ id: validatedRequest.params.id });

    if (!course) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    
    return res.json(course);
  }

  public async delete(req: Request, res: Response): Promise<Response>  
  {
    let validatedRequest = req as ValidatedRequest<CourseQuerySchema>;
    let course = await Course.findOne({ id: validatedRequest.params.id });

    if (course) {
      await course.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  };

  public async update(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<CourseUpdateSchema>;
    let course = await Course.findOne({ id: validatedRequest.params.id });

    if (course) {
      course.name = validatedRequest.body.name;
      await course.save();
      await course.reload();

      return res.status(HttpStatus.OK).send(course);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new CourseController();