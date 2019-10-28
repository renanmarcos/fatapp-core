import { Request, Response } from 'express';
import { CertificateParamsSchema, CertificateStoreSchema } from '../routes/CertificatesRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import path from 'path';
import fs from 'fs';
import { Certificate } from '../models/Certificate';

class CertificateController {

  public async index(req: Request, res: Response): Promise<Response> 
  {
    return res.json(await Certificate.find());
  }

  public async store(req: Request, res: Response): Promise<Response>
  {
    let validatedRequest = req as ValidatedRequest<CertificateStoreSchema>;
    let certificateFile = validatedRequest.file;

    if (certificateFile) {
      let certificate = new Certificate();
      certificate.name = validatedRequest.body.name;
      certificate.path = certificateFile.filename;
      await certificate.save();

      return res.status(HttpStatus.CREATED).json(certificate);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async delete(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<CertificateParamsSchema>;
    let certificate = await Certificate.findOne({ id: validatedRequest.params.id });

    if (certificate) {
      let completePath = path.join(__dirname, '../../storage/') + certificate.path;
      fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
      await certificate.remove();

      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new CertificateController();