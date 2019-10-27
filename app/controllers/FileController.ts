import { Request, Response } from 'express';
import path from 'path';

class FileController {

  public async renderPath(req: Request, res: Response): Promise<void> 
  {
    let completePath = req.params.path;

    if (req.params.morePath) {
      completePath += "/" + req.params.morePath;
    }

    res.sendFile(completePath, { 
      root: path.join(__dirname, '../../storage') 
    });
  }
}

export default new FileController();