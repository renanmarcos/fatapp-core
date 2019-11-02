import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { StudentQuerySchema, StudentStoreSchema, StudentUpdateSchema } from '../routes/StudentsRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import { User } from '../models/User';
import { Course } from '../models/Course';
import jwt from 'jsonwebtoken';

class StudentController {

  public async list(req: Request, res: Response): Promise<Response> 
  {    
    return res.json(await Student.find({relations: ['course', 'user']}));
  }

  public async get(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentQuerySchema>;
    let student = await Student.findOne({ 
      where: { id: validatedRequest.params.id },
      relations: ['course', 'user']
    });

    if (!student) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.json(student);
  }

  public async store(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<StudentStoreSchema>;
    let course = await Course.findOne(validatedRequest.body.courseId);
    let user = await User.findOne({ 
      where: [
        { cpf: validatedRequest.body.cpf },
        { email: validatedRequest.body.email }
      ] 
    });
    
    if (user) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        message: 'CPF ou Email já existente'
      });
    }

    if (course) {
      let user = new User();
      user.name = validatedRequest.body.name;
      user.email = validatedRequest.body.email;
      user.cpf = validatedRequest.body.cpf;
      user.password = validatedRequest.body.password;
      user.hashPassword();
      await user.save();

      let student = new Student();
      student.ra = validatedRequest.body.ra;
      student.course = course;
      student.user = user;
      await student.save();

      let token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.CORE_SECRET ? process.env.CORE_SECRET: 'secret'
      );

      return res.status(HttpStatus.CREATED).json({
        token: token,
        student
      });
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
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
    let student = await Student.findOne({
      where: { id: validatedRequest.params.id },
      relations: ['user', 'course']
    });

    if (student) {
      let user = student.user;
      let newEmail = validatedRequest.body.email;
      let anotherUser = await User.find({ where: { email: newEmail } });
      
      if (newEmail !== user.email && anotherUser.length > 1) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
          message: 'Email já existente'
        }); 
      }

      user.name = validatedRequest.body.name;
      user.email = validatedRequest.body.email;
      await user.save();

      let course = await Course.findOne({ id: validatedRequest.body.courseId } );
      student.course = course;
      student.ra = validatedRequest.body.ra;
      await student.save();
      await student.reload();

      return res.status(HttpStatus.OK).send(student);
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new StudentController();