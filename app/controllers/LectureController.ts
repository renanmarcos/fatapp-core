import { Request, Response } from 'express';
import { Lecture } from '../models/Lecture';

class LectureController {
  public async index (req: Request, res: Response): Promise<Response> {
    return res.json(await Lecture.find());
  }

  public async store (req: Request, res: Response): Promise<Response> {

    const lecture = new Lecture();
    lecture.title = "Test";
    lecture.date = new Date();
    lecture.speaker = "TestName";
    lecture.description = "TestDescription";
    await lecture.save();
    
    return res.json(lecture);
  }

  public async destroy (req: Request, res: Response): Promise<Response> {

    const lecture = await Lecture.findOne({ id: 1 });
    if (lecture != undefined) await lecture.remove();

    return res.status(201);
  }
}

export default new LectureController();