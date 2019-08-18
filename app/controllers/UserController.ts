import { ValidationContract } from './../bin/validation';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { STATUS_CODES } from 'http';

class UserController {
  public async get (req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
  }

  public async post (req: Request, res: Response): Promise<Response> {
    let _validationContract = new ValidationContract();

    _validationContract.isRequired(req.body.name, 'Name is required');
    _validationContract.isRequired(req.body.email, 'E-mail is required');
    _validationContract.isRequired(req.body.cpf, 'CPF is required');
    _validationContract.isRequired(req.body.password, 'Password is required');

    if(!_validationContract.isValid()){
      res.status(400).send({
          message: "400 Bad Request", 
          validation: _validationContract.errors()
      }).end();
      return res;
  }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.cpf = req.body.cpf;
    user.password = req.body.password

    await user.save();
    
    return res.json(user);
  }

  public async delete (req: Request, res: Response): Promise<Response> {

    const user = await User.findOne({ id: 1 });
    if (user != undefined) await user.remove();

    return res.status(201);
  }
}

export default new UserController();