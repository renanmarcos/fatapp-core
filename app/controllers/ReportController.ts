import { Request, Response } from "express-serve-static-core";
import { ValidatedRequest } from "express-joi-validation";
import { ActivityReportSchema, ActivityParamsSchema } from "../routes/ActivitiesRoutes";
import { Subscription } from "../models/Subscription";
import * as HttpStatus from 'http-status-codes';
import * as Excel from 'exceljs';
import { SendMail } from "../services/mail/SendEmail";
import { getConnection } from "typeorm";

class ReportController {

  public async generateActivityExcel(req: Request, res: Response): Promise<Response> {
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
      const font: Partial<Excel.Font> = { color: { argb: 'FFFFFFF' }, bold: true };
      const fill: Excel.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };

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
        helper.text = "Segue relatório em anexo";
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

  public async generateActivityChartAttended(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let report = await getConnection().query('select acronym, count(*) as qtde from activity left join subscription on activity.id = subscription.activityId   left join user on subscription.userId = user.id   left join student on user.id = student.userId left join course on student.courseId = course.id where activity.id = ' + validatedRequest.params.id + ' and attended = true group by acronym');
    if (report.length > 0) {
      return res.status(HttpStatus.OK).send(report);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async generateActivityChartNoAttended(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let report = await getConnection().query('select acronym, count(*) as qtde from activity left join subscription on activity.id = subscription.activityId   left join user on subscription.userId = user.id   left join student on user.id = student.userId left join course on student.courseId = course.id where activity.id = ' + validatedRequest.params.id + ' and attended = false group by acronym');
    if (report.length > 0) {
      return res.status(HttpStatus.OK).send(report);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }

  public async generateActivityChartAll(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let report = await getConnection().query('select acronym, count(*) as qtde from activity left join subscription on activity.id = subscription.activityId   left join user on subscription.userId = user.id   left join student on user.id = student.userId left join course on student.courseId = course.id where activity.id = ' + validatedRequest.params.id + ' group by acronym');
    if (report.length > 0) {
      return res.status(HttpStatus.OK).send(report);
    }
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
}

export default new ReportController();