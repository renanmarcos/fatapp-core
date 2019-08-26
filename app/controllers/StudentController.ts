import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { StudentQuerySchema, StudentStoreSchema, StudentUpdateSchema } from '../routes/StudentRoutes';
import { ValidatedRequest } from 'express-joi-validation';

class StudentController {

  public async list(req: Request, res: Response): Promise<Response> {
    return res.json(await Student.find());
  }

  public async get(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<StudentQuerySchema>;

    return res.json(await Student.findOne({ id: validatedRequest.params.id }));
  }

  public async store(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<StudentStoreSchema>;
      
    const student = new Student();
    student.ra = validatedRequest.body.ra;
    student.course = validatedRequest.body.course;
    await student.save();
      
    return res.json(student);
  }

  public async delete(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<StudentQuerySchema>;

    let student = await Student.findOne({ id: validatedRequest.params.id });

    if (student) {
      await student.remove();
      return res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  };

  public async update(req: Request, res: Response) {
    let validatedRequest = req as ValidatedRequest<StudentUpdateSchema>;

    let student = await Student.findOne({ id: validatedRequest.params.id });

    if (student) {
      student.ra = validatedRequest.body.ra;
      student.course = validatedRequest.body.course;
      await student.save();

      return res.status(200).send(student);
    } else {
      res.status(404).send('404 Not Found');
    }
  }
}

export default new StudentController();