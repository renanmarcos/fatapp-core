import { ValidationContract } from '../bin/validation';
import { Request, Response } from 'express';
import { RoomResource } from '../models/RoomResource';

class RoomResourceController {
  //Return all users
  public async get(req: Request, res: Response){
    if(req.query.roomId == null || req.query.roomId == undefined){
      return res.json(await RoomResource.find( {select: ["roomId"], where: { resourceId: req.query.resourceId}, relations: ['room', 'resource']}));
    }else if(req.query.resourceId == null || req.query.resourceId == undefined){
      return res.json(await RoomResource.find({ where: { roomId: req.query.roomId}, relations: ['room', 'resource']}));
    }else{
      return res.json(await RoomResource.find({ where: { roomId: req.query.roomId, resourceId: req.query.resourceId}, relations: ['room', 'resource']}));
    }
  }

  //Create user
  public async post(req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      //Validate required fields
      _validationContract.isRequired(req.body.roomId, 'Room id is required');
      _validationContract.isRequired(req.body.resourceId, 'Resource id is required');
     
      //Return bad request if validation fails.
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      //If validation OK then create user.
      const roomResource = new RoomResource();
      roomResource.roomId = req.body.roomId;
      roomResource.resourceId = req.body.resourceId;
      roomResource.resourceAmmount = req.body.resourceAmmount;

      await roomResource.save();
      //Return created user.
      return res.json(roomResource);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  //Remove user by id
  public async delete(req: Request, res: Response) {
    try {
      let user = await RoomResource.findOne({ where: { roomId: req.body.roomId, resourceId: req.body.resourceId}});
      if (user) {
        await user.remove();
        return res.status(200).send('success');
      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }
  }

  public async put(req: Request, res: Response) {
    try {
      let result = await RoomResource.findOne({ id: req.params.id });
      if (result) {

        if (req.body.resourceAmmount == undefined || req.body.resourceAmmount == null) req.body.name = result.resourceAmmount;
        
        await RoomResource.update(req.params.id, { resourceAmmount: req.body.resourceAmmount });
        let updatedResult = await RoomResource.findOne({ id: req.params.id });
        return res.status(200).send(updatedResult);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }

}

export default new RoomResourceController();