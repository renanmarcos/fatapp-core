import { ValidationContract } from './../bin/validation';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { STATUS_CODES } from 'http';

class UserController {
  //Return all users
  public async get(req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
  }

  //Create user
  public async post(req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      //Validate required fields
      _validationContract.isRequired(req.body.name, 'Name is required');
      _validationContract.isRequired(req.body.email, 'E-mail is required');
      _validationContract.isRequired(req.body.cpf, 'CPF is required');
      _validationContract.isRequired(req.body.password, 'Password is required');
      //Return bad request if validation fails.
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      //If validation OK then create user.
      const user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.cpf = req.body.cpf;
      user.password = req.body.password;
      await user.save();
      //Return created user.
      return res.json(user);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Return one and only one user by his id 
  public async getById(req: Request, res: Response) {
    try {
      return res.json(await User.findOne({ id: req.params.id }));
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Remove user by id
  public async delete(req: Request, res: Response) {
    try {
      let user = await User.findOne({ id: req.params.id });
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
      let user = await User.findOne({ id: req.params.id });
      if (user) {

        //Avoid null or undefined params.
        if (req.body.name == undefined || req.body.name == null) req.body.name = user.name;
        if (req.body.email == undefined || req.body.email == null) req.body.email = user.email;
        if (req.body.cpf == undefined || req.body.cpf == null) req.body.cpf = user.cpf;
        if (req.body.password == undefined || req.body.password == undefined) req.body.password = user.password;
        
        //Update user and return the result
        await User.update(req.params.id, { name: req.body.name, email: req.body.email, cpf: req.body.cpf, password: req.body.password });
        let updatedUser = await User.findOne({ id: req.params.id });
        return res.status(200).send(updatedUser);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }
}

export default new UserController();