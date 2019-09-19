import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { StudentQuerySchema, StudentStoreSchema, StudentUpdateSchema } from '../routes/StudentRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class StudentController {

  public async list(req: Request, res: Response): Promise<Response> 
  {
    if (!req.query.empty) {
      var label = Object.keys(req.query)[0];
      var value = Object.values(req.query)[0];
      var order = '';
      if (req.query.order) {
        order = ' ORDER BY ' + req.query.order;
      }
      if (req.query.approach == 'lk') {
        var formatQuery = " LIKE '%" + value + "%'";
      }
      else {
        var formatQuery = ' = ' + value;
      }
      let students = await Student.query('SELECT * from student WHERE ' + label + formatQuery + order);
      return res.json(students);
    }
    return res.json(await Student.find());
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentQuerySchema>;
    let student = await Student.findOne({ id: validatedRequest.params.id });

    if (!student) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return res.json(student);
  }

  public async store(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentStoreSchema>;
  
    const student = new Student();
    student.ra = validatedRequest.body.ra;
    student.course = validatedRequest.body.course;
    await student.save();

    return res.status(HttpStatus.CREATED).json(student);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentQuerySchema>;

    let student = await Student.findOne({ id: validatedRequest.params.id });

    if (student) {
      await student.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentUpdateSchema>;
    let student = await Student.findOne({ id: validatedRequest.params.id });

    if (student) {
      student.ra = validatedRequest.body.ra;
      student.course = validatedRequest.body.course;
      await student.save();

      return res.status(HttpStatus.OK).send(student);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new StudentController();