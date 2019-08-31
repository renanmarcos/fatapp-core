import { ValidationContract } from '../bin/validation';
import { Request, Response } from 'express';
import { Room } from '../models/Room';

class RoomController {
  //Return all users
  public async get(req: Request, res: Response): Promise<Response> {
    return res.json(await Room.find( { relations: ['resources'] } ));
  }

  //Create user
  public async post(req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      //Validate required fields
      _validationContract.isRequired(req.body.name, 'Name is required');
      _validationContract.isRequired(req.body.type, 'Type is required');
      _validationContract.isRequired(req.body.capacity, 'Capacity is required');
     
      //Return bad request if validation fails.
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      //If validation OK then create user.
      const room = new Room();
      room.name = req.body.name;
      room.capacity = req.body.capacity;
      room.type = req.body.type;

      await room.save();
      //Return created user.
      return res.json(room);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Return one and only one user by his id 
  public async getById(req: Request, res: Response) {
    try {
      return res.json(await Room.findOne({ id: req.params.id }));
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Remove user by id
  public async delete(req: Request, res: Response) {
    try {
      let user = await Room.findOne({ id: req.params.id });
      if (user) {
        await user.remove();
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
      let result = await Room.findOne({ id: req.params.id });
      if (result) {

        //Avoid null or undefined params.
        if (req.body.name == undefined || req.body.name == null) req.body.name = result.name;
        if (req.body.type == undefined || req.body.type == null) req.body.type = result.type;
        if (req.body.capacity == undefined || req.body.capacity == null) req.body.capacity = result.capacity;
        //Update user and return the result

        await Room.update(req.params.id, { name: req.body.name, type: req.body.type, capacity: req.body.capacity});

        let updatedResult = await Room.findOne({ id: req.params.id });
        return res.status(200).send(updatedResult);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }
}

export default new RoomController();