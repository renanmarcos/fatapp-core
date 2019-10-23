import { Speaker } from './../models/Speaker';
import { Request, Response } from 'express';
import { SpeakerManageSchema, SpeakerQuerySchema, SpeakerGetSchema } from '../routes/SpeakersRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';
import fs from 'fs';
import path from 'path';

class SpeakerController {
    
    public async index(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerGetSchema>;
        let speaker = await Speaker.findOne({ email: validatedRequest.query.email });

        if (speaker) {
            return res.status(HttpStatus.OK).json(speaker);
        }

        return res.json(await Speaker.find());
    }

    public async manageSpeaker(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerManageSchema>;
        let speaker = await Speaker.findOne({ email: validatedRequest.body.email });

        if (speaker) {
            speaker.name = validatedRequest.body.name;
            speaker.email = validatedRequest.body.email;
            speaker.phone = validatedRequest.body.phone;
            speaker.secondPhone = validatedRequest.body.secondPhone;
            speaker.curriculum = validatedRequest.body.curriculum;

            if (validatedRequest.file) {
                let completePath = path.join(__dirname, '../../storage/') + speaker.profilePicture;
                fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
                speaker.profilePicture = validatedRequest.file.filename;
            }

            await speaker.save();
            await speaker.reload();

            return res.status(HttpStatus.OK).send(speaker);
        } 

        speaker = new Speaker();
        speaker.name = validatedRequest.body.name;
        speaker.email = validatedRequest.body.email;
        speaker.phone = validatedRequest.body.phone;
        speaker.secondPhone = validatedRequest.body.secondPhone;
        speaker.curriculum = validatedRequest.body.curriculum;

        if (validatedRequest.file) {
            speaker.profilePicture = validatedRequest.file.filename;
        }

        await speaker.save();

        return res.status(HttpStatus.CREATED).json(speaker);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerQuerySchema>;
        let speaker = await Speaker.findOne({ id: validatedRequest.params.id });

        if (speaker) {
            let completePath = path.join(__dirname, '../../storage/') + speaker.profilePicture;
            fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
            await speaker.remove();
            return res.sendStatus(HttpStatus.NO_CONTENT);
        }

        return res.sendStatus(HttpStatus.NOT_FOUND);
    }
}

export default new SpeakerController();