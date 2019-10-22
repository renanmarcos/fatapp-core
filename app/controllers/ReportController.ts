import { Request, Response } from "express-serve-static-core";
import { ValidatedRequest } from "express-joi-validation";
import { ActivityParamsSchema } from "../routes/ActivityRoutes";
import { Subscription } from "../models/Subscription";
import * as HttpStatus from 'http-status-codes';

class ReportController {

public async generateActivityReport(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let subscriptions = await Subscription.find({ 
      relations: ['user', 'user.student', 'user.student.course'],
      where: { activity: validatedRequest.params.id }
       
    });

    if (subscriptions) {
      return res.status(HttpStatus.OK).send(subscriptions);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ReportController();