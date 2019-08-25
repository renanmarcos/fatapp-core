import { ValidationContract } from '../bin/validation';
import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { STATUS_CODES } from 'http';

class EventController {
  //Return all users
  public async get(req: Request, res: Response): Promise<Response> {
    return res.json(await Event.find());
  }

  //Create user
  public async post(req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      //Validate required fields
      _validationContract.isRequired(req.body.name, 'Name is required');
     
      //Return bad request if validation fails.
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      //If validation OK then create user.
      const event = new Event();
      event.name = req.body.name;
      await event.save();
      //Return created user.
      return res.json(event);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Return one and only one user by his id 
  public async getById(req: Request, res: Response) {
    try {
      return res.json(await Event.findOne({ id: req.params.id }));
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Remove user by id
  public async delete(req: Request, res: Response) {
    try {
      let result = await Event.findOne({ id: req.params.id });
      if (result) {
        await result.remove();
        return res.status(200).send('success');
      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }
  };

  //Update user
  public async put(req: Request, res: Response) {
    try {
      let result = await Event.findOne({ id: req.params.id });
      if (result) {

        //Avoid null or undefined params.
        if (req.body.name == undefined || req.body.name == null) req.body.name = result.name;
        
        //Update user and return the result
        await Event.update(req.params.id, { name: req.body.name });
        let updatedResult = await Event.findOne({ id: req.params.id });
        return res.status(200).send(updatedResult);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }
}

export default new EventController();