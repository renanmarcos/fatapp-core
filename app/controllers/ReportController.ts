import { Request, Response } from "express-serve-static-core";
import { ValidatedRequest } from "express-joi-validation";
import { ActivityParamsSchema } from "../routes/ActivityRoutes";
import { Subscription } from "../models/Subscription";
import * as HttpStatus from 'http-status-codes';
import * as Excel from 'exceljs';
import { SendMail } from "../services/mail/sendEmail";


class ReportController {

  public async generateActivityReport(req: Request, res: Response): Promise<Response> {
    let validatedRequest = req as ValidatedRequest<ActivityParamsSchema>;
    let subscriptions = await Subscription.find({
      relations: ['user', 'user.student', 'user.student.course', 'activity', 'activity.event'],
      where: { activity: validatedRequest.params.id }

    });

    if (subscriptions) {
      let workbook = new Excel.Workbook();
      let worksheetLGP = workbook.addWorksheet("Lista Geral de Presença");

      worksheetLGP.columns = [
        { header: 'Nome', key: 'name', width: 30 },
        { header: 'Presença', key: 'presenca', width: 15 },
        { header: 'RA', key: 'ra', width: 30 },
        { header: 'Curso', key: 'curso', width: 50 }
      ];

      let i = 0;
      for (i = 0; i < subscriptions.length; i++) {
        if (subscriptions[i].user.student) {
          worksheetLGP.addRow({
            name: subscriptions[i].user.name,
            presenca: subscriptions[i].attended,
            ra: subscriptions[i].user.student.ra,
            curso: subscriptions[i].user.student.course.name
          });
        } else {
          worksheetLGP.addRow({
            name: subscriptions[i].user.name,
            presenca: subscriptions[i].attended,
            ra: '-',
            curso: 'Público Externo'
          });
        }
      }

      worksheetLGP.autoFilter = 'A1:D1';
      const font = { color: { argb: 'FFFFFFF' }, bold: true };

      worksheetLGP.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
      worksheetLGP.getCell('A1').font = font;
      worksheetLGP.getCell('B1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
      worksheetLGP.getCell('B1').font = font;
      worksheetLGP.getCell('C1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
      worksheetLGP.getCell('C1').font = font;
      worksheetLGP.getCell('D1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '993535' } };
      worksheetLGP.getCell('D1').font = font;

      let fileName = subscriptions[0].activity.event.title + ' ' + subscriptions[0].activity.event.edition + ' - ' + subscriptions[0].activity.title + '.xlsx';
      let email = req.query.email;

      if (email) {
        let sendEmail = new SendMail();
        let mailParams = req;
        await workbook.xlsx.writeBuffer().then(async function (buffer) {
        await sendEmail.sendMail(mailParams, buffer, fileName);
          res.end('Email enviado');
        });
      } else {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        await workbook.xlsx.write(res).then(function () {
          res.end('Realizando download');
        });
      }
    } else {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
  }
}

export default new ReportController();