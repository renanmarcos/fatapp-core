import { Request, Response } from 'express';
import { Speaker } from '../models/Speaker';
import { SpeakerStoreSchema, SpeakerUpdateSchema, SpeakerQuerySchema } from '../routes/SpeakerRoutes';
import { ValidatedRequest } from 'express-joi-validation';
import * as HttpStatus from 'http-status-codes';

class SpeakerController {

    public async list(req: Request, res: Response): Promise<Response> {
        return res.json(await Speaker.find());
    }

    public async get(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerQuerySchema>;
        let speaker = await Speaker.findOne({ speakerEmail: validatedRequest.body.speakerEmail });

        if (!speaker) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }

        return res.json(speaker);
    }

    public async store(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerStoreSchema>;
        let speaker = new Speaker();

        speaker.speakerName = validatedRequest.body.speakerName;
        speaker.speakerEmail = validatedRequest.body.speakerEmail;
        speaker.speakerPhone = validatedRequest.body.speakerPhone;
        speaker.speakerPhone2 = validatedRequest.body.speakerPhone2;
        speaker.speakerCurriculum = validatedRequest.body.speakerCurriculum;

        await speaker.save();

        return res.status(HttpStatus.CREATED).json(speaker);
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

    public async update(req: Request, res: Response): Promise<Response> {
        let validatedRequest = req as ValidatedRequest<SpeakerUpdateSchema>;
        let speaker = await Speaker.findOne({ id: validatedRequest.params.id });

        if (speaker) {
            speaker.speakerName = validatedRequest.body.speakerName;
            speaker.speakerEmail = validatedRequest.body.speakerEmail;
            speaker.speakerPhone = validatedRequest.body.speakerPhone;
            speaker.speakerPhone2 = validatedRequest.body.speakerPhone2;
            speaker.speakerCurriculum = validatedRequest.body.speakerCurriculum;

            await speaker.save();
            await speaker.reload();

            return res.status(HttpStatus.OK).send(speaker);
        }

        return res.sendStatus(HttpStatus.NOT_FOUND);
    }
}

export default new SpeakerController();