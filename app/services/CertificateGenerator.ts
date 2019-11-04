import { Subscription } from '../models/Subscription';
import * as fs from 'fs';
import path from 'path';
import { TemplateHandler } from 'easy-template-x';
import { SendMail } from './mail/SendEmail';
import moment from 'moment';
import 'moment/locale/pt-br';
import address from 'address';
const TinyURL = require('tinyurl');

export class CertificateGenerator {
  
  private subscription: Subscription;
  private serverAddress: string;

  constructor(subscription: Subscription) {
    this.subscription = subscription;
    this.serverAddress = "http://" + address.ip() + ":" + (process.env.CORE_PORT || 3000);
    moment.locale('pt-BR');
  }

  public async sendCertificate() {
    let activity = this.subscription.activity;
    let event = activity.event;
    let user = this.subscription.user;
    
    let partialPath = path.join(__dirname, '../../storage/');
    let completePath = partialPath + event.certificate.path;
    const templateFile = fs.readFileSync(completePath);

    let frequentedHours = moment(activity.finalDate).diff(activity.initialDate, 'hours');
    var validatorUrl;
    
    await TinyURL.shorten(
      this.serverAddress + "/activities/validator?userId=" + user.id + "&activityId=" + activity.id, 
    ).then(function (res: any) {
      validatorUrl = res;
    });

    const data = {
      nome: user.name,
      palestra: activity.title,
      palestrante: activity.speaker.speakerName,
      edicao: event.edition,
      evento: event.title,
      dataAtividade: moment(activity.initialDate).format("L"),
      cargaHoraria: frequentedHours,
      dataAtual: moment().format("LL"),
      linkValidador: {
        _type: 'link',
        target: validatorUrl
      }
    };
    
    const handler = new TemplateHandler();
    const helper = new SendMail();
    helper.to = [user.email];
    helper.subject = "Certificado da atividade " + activity.title;
    helper.text = "Olá " + user.name  + ".\nAgradecemos a sua participação na atividade " + 
                  activity.title + "! Seu certificado está em anexo.\n\n" +
                  "Esse e-mail é automático, por favor não responda.";

    handler.process(templateFile, data).then(function (generatedDocument: Buffer) {
      helper.attachment = {
        content: generatedDocument,
        filename: activity.initialDate.getTime() + "-" + user.name + ".docx"
      };
      helper.send();
    }).catch((error) => console.log(error));
  }
}