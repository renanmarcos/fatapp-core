import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Course } from '../services/enums/CourseEnum';
import ValidationContract from 'app/bin/validation';

class StudentController {
  public async get (req: Request, res: Response): Promise<Response> {
    return res.json(await Student.find());
  }

  public async post (req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      //Validate required fields
      _validationContract.isRequired(req.body.ra, 'RA is required');
      _validationContract.isRequired(req.body.course, 'Course is required');
      //Return bad request if validation fails.
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      if(!Course.ADS.includes(req.body.ra)) {
        res.status(400).send({
          message: "Course not available",
          validation: _validationContract.errors()
        }).end();
      }
      
      //If validation OK then create user.
      const student = new Student();
      student.ra = req.body.ra;
      student.course = req.body.course;
      await student.save();
      //Return created student.
      return res.json(student);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Return one and only one student by his id 
  public async getById(req: Request, res: Response) {
    try {
      return res.json(await Student.findOne({ id: req.params.id }));
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Remove student by id
  public async delete(req: Request, res: Response) {
    try {
      let student = await Student.findOne({ id: req.params.id });
      if (student) {
        await student.remove();
        return res.status(200).send('success');
      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }
  };

  //Update student
  public async put(req: Request, res: Response) {
    try {
      let student = await Student.findOne({ id: req.params.id });
      if (student) {

        //Avoid null or undefined params.
        if (req.body.ra == undefined || req.body.ra == null) req.body.ra = student.ra;
        if (req.body.course == undefined || req.body.course == null) req.body.course = student.course;
        
        //Update user and return the result
        await Student.update(req.params.id, { ra: req.body.ra, course: req.body.course });
        let updatedStudent = await Student.findOne({ id: req.params.id });
        return res.status(200).send(updatedStudent);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }
}

export default new StudentController();