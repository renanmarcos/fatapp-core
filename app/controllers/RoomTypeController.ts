import { ValidationContract } from '../bin/validation';
import { Request, Response } from 'express';
import { RoomType } from '../models/RoomType';

class RoomTypeController {
  public async get(req: Request, res: Response): Promise<Response> {
    return res.json(await RoomType.find());
  }

  //Create user
  public async post(req: Request, res: Response) {
    try {
      let _validationContract = new ValidationContract();
      _validationContract.isRequired(req.body.name, 'Name is required');
     
      if (!_validationContract.isValid()) {
        res.status(400).send({
          message: "400 Bad Request",
          validation: _validationContract.errors()
        }).end();
        return res;
      }
      const roomType = new RoomType();
      roomType.name = req.body.name;
      await roomType.save();
      return res.json(roomType);
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      return res.json(await RoomType.findOne({ id: req.params.id }));
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error })
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      let result = await RoomType.findOne({ id: req.params.id });
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

  public async put(req: Request, res: Response) {
    try {
      let result = await RoomType.findOne({ id: req.params.id });
      if (result) {

        if (req.body.name == undefined || req.body.name == null) req.body.name = result.name;
        
        await RoomType.update(req.params.id, { name: req.body.name });
        let updatedResult = await RoomType.findOne({ id: req.params.id });
        return res.status(200).send(updatedResult);

      } else {
        res.status(404).send('404 Not Found');
      }
    } catch (error) {
      res.status(500).send({ message: '500 Internal Server Error', error: error });
    }

  }
}

export default new RoomTypeController();