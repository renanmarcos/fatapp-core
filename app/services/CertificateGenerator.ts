import { Subscription } from '../models/Subscription';
import * as fs from 'fs';
import path from 'path';
import { TemplateHandler } from 'easy-template-x';
import { SendMail } from './mail/SendEmail';

export class CertificateGenerator {
  
  private subscription : Subscription;

  constructor(subscription: Subscription) {
    this.subscription = subscription;
  }

  public async sendCertificate() {
    let activity = this.subscription.activity;
    let event = activity.event;
    let user = this.subscription.user;
    
    let partialPath = path.join(__dirname, '../../storage/');
    let completePath = partialPath + event.certificate.path;
    const templateFile = fs.readFileSync(completePath);
    
    let diffInDate = activity.finalDate.getDate() - activity.initialDate.getDate();
    let frequentedHours = activity.finalDate.getHours() - activity.initialDate.getHours();

    if (diffInDate > 0 && frequentedHours == 0) {
      frequentedHours = 24;
    } 

    if (diffInDate > 0) {
      frequentedHours += diffInDate * 24;
    }

    const data = {
      nome: user.name,
      palestra: activity.title,
      palestrante: activity.speaker.speakerName,
      edicao: event.edition,
      evento: event.title,
      dataAtividade: activity.initialDate.getDate(),
      cargaHoraria: frequentedHours + "h",
      dataAtual: new Date().getDate()
    };
    
    const handler = new TemplateHandler();
    const helper = new SendMail();
    helper.to = [user.email];
    helper.subject = "Certificado da atividade " + activity.title;
    helper.text = "Agradecemos a sua participação na atividade " + activity.title + ". O certificado está em anexo.";

    handler.process(templateFile, data).then(function (generatedDocument: Buffer) {
      helper.attachment = {
        content: generatedDocument,
        filename: activity.initialDate.getTime() + "-" + user.name + ".docx"
      };
      helper.send();
    }).catch((error) => console.log(error));
  }
}