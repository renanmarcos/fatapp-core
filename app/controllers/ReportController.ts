import { Request, Response } from "express-serve-static-core";
import { ValidatedRequest } from "express-joi-validation";
import { ActivityReportSchema } from "../routes/ActivitiesRoutes";
import { EventQuerySchema } from "../routes/EventsRoutes";
import { Subscription } from "../models/Subscription";
import { Event } from "../models/Event";
import * as HttpStatus from 'http-status-codes';
import * as Excel from 'exceljs';
import { SendMail } from "../services/mail/SendEmail";
import { Activity } from "app/models/Activity";
import { getRepository, getConnection } from "typeorm";

class ReportController {

  public async generateActivityReport(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityReportSchema>;
    let subscriptions = await Subscription.find({
      relations: ['user', 'user.student', 'user.student.course', 'activity', 'activity.event'],
      where: { activity: validatedRequest.params.id }
    });

    
    if (subscriptions.length > 0) {
      let workbook = new Excel.Workbook();
      let worksheetLGP = workbook.addWorksheet("Lista Geral de Presença");

      worksheetLGP.columns = [
        { header: 'Nome', key: 'nome', width: 30 },
        { header: 'Presença', key: 'presenca', width: 15 },
        { header: 'RA', key: 'ra', width: 30 },
        { header: 'Curso', key: 'curso', width: 50 }
      ];

      for (let i = 0; i < subscriptions.length; i++) {
        let ra = '-';
        let curso = 'Público Externo';

        if (subscriptions[i].user.student) {
          ra = subscriptions[i].user.student.ra;
          curso = subscriptions[i].user.student.course.name;
        }

        worksheetLGP.addRow({
          nome: subscriptions[i].user.name,
          presenca: subscriptions[i].attended,
          ra: ra,
          curso: curso
        });
      }

      worksheetLGP.autoFilter = 'A1:D1';
      const font : Partial<Excel.Font> = { color: { argb: 'FFFFFFF' }, bold: true };
      const fill : Excel.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };

      worksheetLGP.getRow(1).eachCell(function (cell: Excel.Cell, column: number) {
        cell.fill = fill;
        cell.font = font;
      });

      let event = subscriptions[0].activity.event;
      let activity = subscriptions[0].activity;
      let fileName = event.title + ' ' + event.edition + ' - ' + activity.title + '.xlsx';
      let emails = req.body.emails;

      if (emails.length > 0) {
        let helper = new SendMail();
        helper.to = emails;
        helper.text =  "Segue relatório em anexo";
        helper.subject = "Relatório " + fileName;
        
        workbook.xlsx.writeBuffer().then(function (buffer: any) {
          helper.attachment = {
            content: buffer,
            filename: fileName
          };
          helper.send();
        }).catch((error) => console.log(error));

        return res.status(HttpStatus.OK).send({
          message: "O relatório está sendo gerado e será enviado por email em breve"
        });
      }

      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      let buffer = await workbook.xlsx.writeBuffer();
      return res.send(buffer);
    }
      return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async generateEventReport(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<EventQuerySchema>;

    // let qtdeAtividades = await getRepository('Activity').createQueryBuilder('activity')
    // .where('activity.event = :id', {id: validatedRequest.params.id})
    // .getCount();

    // let qtdeInscritos = await getRepository('Activity').createQueryBuilder('activity')
    // .select('title')
    // .where('activity.event = :id', {id: validatedRequest.params.id})
    // .andWhere('activity.id = subscriptions.activity')
    // .getMany();

    let query = await getConnection().query('select title, attended, acronym, count(*) from activity left join subscription on activity.id = subscription.activityId   left join user on subscription.userId = user.id   left join student on user.id = student.userId left join course on student.courseId = course.id group by title, attended, acronym');
    //.select('title')
    //.addSelect('attended')
    //.addSelect('acronym')
    //.addSelect('count(*)')
    //.from('activity', 'activity')
    //.addFrom('subscription','subscription')
    //.groupBy('title')
    //.addGroupBy('attended')

    console.log(query);


    

    // let event = await Event.findOne({
    // relations: ['activity', 'activity.subscriptions', 'activity.subscriptions.user', 'activity.subscriptions.user.student', 'activity.subscriptions.user.student.course'],
    //   where: { id: validatedRequest.params.id }
    //  });

   

    // let qtdeAtividades = event.activity.length;

    // let arr = []
    //  let keys = Object.keys(event.activity[0].subscriptions.keys)
    //  console.log('IDS de usuario ------------------->>>> ' + keys)

    // for (let i = 0; i < event.activity.length; i++){
    //    let groupby = await getRepository('Subscription').createQueryBuilder('subscription')
    //    .where('subscription.activity = :id', {id: event.activity[i].id})
    //    .getCount();
    //    let qtdeInscritos = event.activity[i].subscriptions.length;
    //    let title = event.activity[i].title;
    //   arr.push('{"' + title + '":"' + qtdeInscritos + '"}');
    // }

    
    
    // let str = '{"teste":['+ arr.toString() +']}';
    // let obj = JSON.parse(str);
    // console.log('QUANTIDADE DE ATIVIDADES: ' + qtdeAtividades);
    // console.log('Inscritos por atividade: ' + obj);



    // if (event) {
    //   let workbook = new Excel.Workbook();
    //   let worksheetLGP = workbook.addWorksheet("Lista Geral de Presença");

    //   worksheetLGP.columns = [
    //     { header: 'Atividade', key: 'atividade', width: 30 },
    //     { header: 'Nome', key: 'nome', width: 30 },
    //     { header: 'Presença', key: 'presenca', width: 15 },
    //     { header: 'RA', key: 'ra', width: 30 },
    //     { header: 'Curso', key: 'curso', width: 50 }
    //   ];
    //   for (let i = 0; i < event.length; i++) {
    //     for (let j = 0; j < event[i].activity.length; j++) {
    //       for (let k = 0; k < event[i].activity[j].subscriptions.length; k++) {
    //         if (event[i].activity[j].subscriptions[k].user.student) {
    //           worksheetLGP.addRow({
    //             atividade: event[i].activity[j].title,
    //             nome: event[i].activity[j].subscriptions[k].user.name,
    //             presenca: event[i].activity[j].subscriptions[k].attended,
    //             ra: event[i].activity[j].subscriptions[k].user.student.ra,
    //             curso: event[i].activity[j].subscriptions[k].user.student.course.name
    //           });
    //         } else {
    //           worksheetLGP.addRow({
    //             atividade: event[i].activity[j].title,
    //             nome: event[i].activity[j].subscriptions[k].user.name,
    //             presenca: event[i].activity[j].subscriptions[k].attended,
    //             ra: '-',
    //             curso: 'Público Externo'
    //           });
    //         }
    //       }
    //     }
    //   }

    //   worksheetLGP.autoFilter = 'A1:E1';
    //   const font = { color: { argb: 'FFFFFFF' }, bold: true };

    //   worksheetLGP.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
    //   worksheetLGP.getCell('A1').font = font;
    //   worksheetLGP.getCell('B1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
    //   worksheetLGP.getCell('B1').font = font;
    //   worksheetLGP.getCell('C1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
    //   worksheetLGP.getCell('C1').font = font;
    //   worksheetLGP.getCell('D1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
    //   worksheetLGP.getCell('D1').font = font;
    //   worksheetLGP.getCell('E1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
    //   worksheetLGP.getCell('E1').font = font;

    //   let fileName = event[0].title + ' ' + event[0].edition + '.xlsx';
    //   let email = req.query.email;

    //   if (email) {
    //     let sendEmail = new SendMail();
    //     let mailParams = req;
    //     await workbook.xlsx.writeBuffer().then(async function (buffer) {
    //       await sendEmail.sendMail(mailParams, buffer, fileName);
    //       res.end('Email enviado');
    //     });
    //   } else {
    //     res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     await workbook.xlsx.writeBuffer().then(async function (buffer) {
    //       res.send(buffer);
    //     });
    //   }
    // }else{
       return res.status(HttpStatus.OK).send(query);
    // }
  }
}

export default new ReportController();