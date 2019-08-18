import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Course } from '../services/enums/CourseEnum';

class StudentController {
  public async index (req: Request, res: Response): Promise<Response> {
    return res.json(await Student.find());
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const student = new Student();
    student.ra = 123454;
    student.course = Course.ADS;
    await student.save();
    
    return res.json(student);
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    const student = await Student.findOne({ id: 1 });
    if (student != undefined) await student.remove();

    return res.status(201);
  }
}

export default new StudentController();