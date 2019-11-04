import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { ValidatedRequest } from 'express-joi-validation';
import { ActivityStoreSchema, ActivityParamsSchema, ActivityUpdateSchema, ManageUserSchema, RateSchema, ActivityQuerySchema } from '../routes/ActivitiesRoutes';
import { Room } from '../models/Room';
import * as HttpStatus from 'http-status-codes';
import { Event } from '../models/Event';
import { Speaker } from '../models/Speaker';
import { Course } from '../models/Course';
import { Subscription } from '../models/Subscription';
import { Rating } from '../models/Rating';
import { User } from '../models/User';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { CertificateGenerator } from '../services/CertificateGenerator';
import moment from 'moment';
import 'moment/locale/pt-br';
import Mustache from 'mustache';
import address from 'address';

class ActivityController {

  public async index(req: Request, res: Response): Promise<Response> {
    return res.json(await Activity.find({ relations: ['room', 'event', 'speaker', 'targetAudience'] }));
  }

  public async validator(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityQuerySchema>;
    let subscription = await Subscription.findOne({
      where: {
        activity: validatedRequest.query.activityId,
        user: validatedRequest.query.userId
      },
      relations: ['user', 'activity', 'activity.speaker']
    });

    if (subscription && subscription.attended === true) {
      moment().locale('pt-BR');

      let activity = subscription.activity;
      let user = subscription.user;

      let view = {
        nome: user.name,
        atividade: activity.title,
        palestrante: activity.speaker.speakerName,
        dataInicialAtividade: moment(activity.initialDate).format("L"),
        dataFinalAtividade: moment(activity.finalDate).format("L"),
        horaInicialAtividade: moment(activity.initialDate).format("HH:mm"),
        horaFinalAtividade: moment(activity.finalDate).format("HH:mm"),
        cargaHoraria: moment(activity.finalDate).diff(activity.initialDate, 'hours'),
        linkValidador: "http://" + address.ip() + ":" + (process.env.CORE_PORT || 3000) 
                        + "/activities/validator?userId=" + user.id + "&activityId=" + activity.id,
        dataAtual: moment().format("LL")
      };

      let completePath = path.join(__dirname, '../../public/validator/index.html');
      let template = fs.readFileSync(completePath, 'utf-8');

      return res.type('html').send(
        Mustache.render(template, view)
      );
    }

    return res.type('html').send("<b>Esse certificado é inválido.</b>");
  }

  public async store(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityStoreSchema>;
    let room = await Room.findOne({ id: validatedRequest.body.roomId });
    let event = await Event.findOne({ id: validatedRequest.body.eventId });
    let speaker = await Speaker.findOne({ id: validatedRequest.body.speakerId });

    if (room && event && speaker) {
      if (event.initialDate < validatedRequest.body.initialDate && event.finalDate > validatedRequest.body.finalDate) {
        let activity = new Activity();

        activity.title = validatedRequest.body.title;
        activity.type = validatedRequest.body.type;
        activity.description = validatedRequest.body.description;
        activity.initialDate = validatedRequest.body.initialDate;
        activity.finalDate = validatedRequest.body.finalDate;
        activity.obsActivity = validatedRequest.body.obsActivity;
        activity.obsResource = validatedRequest.body.obsResource;
        activity.room = validatedRequest.body.roomId;
        activity.event = validatedRequest.body.eventId;
        activity.speaker = validatedRequest.body.speakerId;

        let courses = Array.from(validatedRequest.body.targetAudience);
        let arrayOfCourses = [];

        for (let i = 0; i < courses.length; i++) {
          let courseId: any = courses[i];
          let courseToFind = await Course.findOne({ id: courseId });
          
          if (!courseToFind) {
            return res.sendStatus(HttpStatus.NOT_FOUND);
          }
          
          arrayOfCourses.push(courseToFind);
        }

        activity.targetAudience = arrayOfCourses;
        await activity.save();

        let partialPath = 'activities/' + activity.id + '.svg';
        let completePath = path.join(__dirname, '../../storage/') + partialPath;
                                    
        let data = {
          'id': activity.id
        };
        
        await QRCode.toFile(
          completePath, 
          JSON.stringify(data),
          { type: 'svg' }
        );

        activity.qrCode = partialPath;
        await activity.save();
        await activity.reload();

        return res.status(HttpStatus.CREATED).json(activity);
      }

      moment.locale('pt-BR');
      return res.status(HttpStatus.NOT_ACCEPTABLE).send({
        "message": "A atividade precisa estar dentro do tempo do evento, entre " + 
                    moment(event.initialDate).format("LLL") + " até " + moment(event.finalDate).format("LLL")
      });
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async get(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ 
      where: { id: validatedRequest.params.id }, 
      relations: ['room', 'event', 'speaker', 'targetAudience'] 
    });

    if (!activity) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.json(activity);
  }

  public async destroy(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {
      let completePath = path.join(__dirname, '../../storage/') + activity.qrCode;
      fs.unlink(completePath, () => console.log('Deleted file: ' + completePath));
      await activity.remove();

      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async update(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ActivityUpdateSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });

    if (activity) {
      let room = await Room.findOne({ id: validatedRequest.body.roomId });
      let event = await Event.findOne({ id: validatedRequest.body.eventId });
      let speaker = await Speaker.findOne({ id: validatedRequest.body.speakerId });

      if (room && event && speaker) {
        if (event.initialDate < validatedRequest.body.initialDate && event.finalDate > validatedRequest.body.finalDate) {

          activity.title = validatedRequest.body.title;
          activity.type = validatedRequest.body.type;
          activity.description = validatedRequest.body.description;
          activity.initialDate = validatedRequest.body.initialDate;
          activity.finalDate = validatedRequest.body.finalDate;
          activity.obsActivity = validatedRequest.body.obsActivity;
          activity.obsResource = validatedRequest.body.obsResource;
          activity.room = validatedRequest.body.roomId;
          activity.event = validatedRequest.body.eventId;
          activity.speaker = validatedRequest.body.speakerId;

          let courses = Array.from(validatedRequest.body.targetAudience);
          let arrayOfCourses = [];

          for (let i = 0; i < courses.length; i++) {
            let courseId: any = courses[i];
            let courseToFind = await Course.findOne({ id: courseId });
            arrayOfCourses.push(courseToFind);
          }

          activity.targetAudience = arrayOfCourses;

          await activity.save();
          await activity.reload();

          return res.status(HttpStatus.OK).json(activity);
        }

        moment.locale('pt-BR');
        return res.status(HttpStatus.NOT_ACCEPTABLE).send({
          "message": "A atividade precisa estar dentro do tempo do evento, entre " + 
                      moment(event.initialDate).format("LLL") + " até " + moment(event.finalDate).format("LLL")
        });
      }
    }
    
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async subscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });
    let user = await User.findOne({ id: validatedRequest.body.userId });
    moment.locale('pt-BR');

    let allowedSubscribeTime = moment(activity.initialDate).subtract(1, 'hour');

    if(moment().isSameOrBefore(allowedSubscribeTime)) {
      if (activity && user) {
        let subscription = new Subscription();
        subscription.activity = activity;
        subscription.user = user;
        subscription.attended = false;

        try {
          await subscription.save();
        } catch(ex) {
          return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
            message: "Já está inscrito nessa atividade"
          });
        }

        return res.status(HttpStatus.OK).send(subscription);
      }

      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    return res.status(HttpStatus.BAD_REQUEST).send({
      "message": "A atividade começará dentro de 1 hora"
    });
  }
  
  public async attendee(req: Request, res: Response): Promise<Response> 
  {
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let subscription = await Subscription.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        user: validatedRequest.body.userId,
      },
      relations: ['user', 'activity', 'activity.speaker', 'activity.event', 'activity.event.certificate']
    });

    if (subscription) {
      subscription.attended = true;
      await subscription.save();
      await subscription.reload();

      let generator = new CertificateGenerator(subscription);
      generator.sendCertificate();

      return res.status(HttpStatus.OK).send(subscription);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async unsubscribe(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ManageUserSchema>;
    let subscription = await Subscription.findOne({ 
      where: { 
        activity: validatedRequest.params.id, 
        user: validatedRequest.body.userId 
      } 
    });

    if (subscription) {
      await subscription.remove();
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async getSubscriptions(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let subscriptions = await Subscription.find({ 
      where: { activity: validatedRequest.params.id }, 
      relations: ['user', 'user.student', 'user.student.course'] 
    });

    if (subscriptions) {
      return res.status(HttpStatus.OK).send({
        subscriptions: subscriptions,
        total: subscriptions.length
      });
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async rate(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<RateSchema>;
    let activity = await Activity.findOne({ id: validatedRequest.params.id });
    let user = await User.findOne({ id: validatedRequest.body.userId });

    if (activity && user) {
      let rating = new Rating();
      rating.user = user;
      rating.activity = activity;
      rating.numberOfStars = validatedRequest.body.numberOfStars;
      await rating.save();

      return res.status(HttpStatus.OK).send(rating);
    }

    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ActivityController();