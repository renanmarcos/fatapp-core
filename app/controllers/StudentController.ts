import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { CourseEnum } from '../models/Enums/CourseEnum'

class StudentController {
  public async index (req: Request, res: Response): Promise<Response> {
    return res.json(await Student.find());
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const courses = new CourseEnum();
    const student = new Student();
    student.ra = 123454;
    student.curse = courses.ADS;
    await student.save();
    
    return res.json(student);
  }

  public async destroy (req: Request, res: Response): Promise<Response> {

    const student = await Student.find({ id: 1 });
    await student.remove();

    return res.json(student);
  }
}

export default new StudentController();