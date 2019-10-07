import { Speaker } from './../models/Speaker';
import { Request, Response } from 'express';
import { SpeakerManageSchema, SpeakerQuerySchema, SpeakerGetSchema } from '../routes/SpeakerRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class SpeakerController {

    
    public async get(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerGetSchema>;
        
        if (validatedRequest.body.speakerEmail == ''){
            return res.json(await Speaker.find());
        }else{
            let speaker = await Speaker.findOne({ speakerEmail: validatedRequest.body.speakerEmail });
            if (!speaker) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            }
            return res.json(speaker);
        }
        

        

    }

    public async manageSpeaker(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerManageSchema>;
        let speakerToUpdate = await Speaker.findOne({ speakerEmail: validatedRequest.body.speakerEmail });

        if (speakerToUpdate) {
            speakerToUpdate.speakerName = validatedRequest.body.speakerName;
            speakerToUpdate.speakerEmail = validatedRequest.body.speakerEmail;
            speakerToUpdate.speakerPhone = validatedRequest.body.speakerPhone;
            speakerToUpdate.speakerPhone2 = validatedRequest.body.speakerPhone2;
            speakerToUpdate.speakerCurriculum = validatedRequest.body.speakerCurriculum;

            await speakerToUpdate.save();
            await speakerToUpdate.reload();

            return res.status(HttpStatus.OK).send(speakerToUpdate);
        } else {
            let speaker = new Speaker();

            speaker.speakerName = validatedRequest.body.speakerName;
            speaker.speakerEmail = validatedRequest.body.speakerEmail;
            speaker.speakerPhone = validatedRequest.body.speakerPhone;
            speaker.speakerPhone2 = validatedRequest.body.speakerPhone2;
            speaker.speakerCurriculum = validatedRequest.body.speakerCurriculum;

            await speaker.save();

            return res.status(HttpStatus.CREATED).json(speaker);
        }
        
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerQuerySchema>;
        let speaker = await Speaker.findOne({ id: validatedRequest.params.id });

        if (speaker) {
            await speaker.remove();
            return res.sendStatus(HttpStatus.NO_CONTENT);
        }

        return res.sendStatus(HttpStatus.NOT_FOUND);
    };
}

export default new SpeakerController();