import { Request, Response } from 'express';
import { User } from '../models/User';
import { UserStoreSchema, UserUpdateSchema, UserQuerySchema }  from '../routes/AuthRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class AuthController {

  public async login(req: Request, res: Response): Promise<Response> 
  {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send(token);
  }

  public async register(req: Request, res: Response): Promise<Response>
  {
    return res.json();
  }

  public async changePassword(req: Request, res: Response): Promise<Response> 
  {
     //Get ID from JWT
     const id = res.locals.jwtPayload.userId;

     //Get parameters from the body
     const { oldPassword, newPassword } = req.body;
     if (!(oldPassword && newPassword)) {
       res.status(400).send();
     }
 
     //Get user from the database
     const userRepository = getRepository(User);
     let user: User;
     try {
       user = await userRepository.findOneOrFail(id);
     } catch (id) {
       res.status(401).send();
     }
 
     //Check if old password matchs
     if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
       res.status(401).send();
       return;
     }
 
     //Validate de model (password lenght)
     user.password = newPassword;
     const errors = await validate(user);
     if (errors.length > 0) {
       res.status(400).send(errors);
       return;
     }
     //Hash the new password and save
     user.hashPassword();
     userRepository.save(user);
 
     res.status(204).send();
  }
}

export default new AuthController();