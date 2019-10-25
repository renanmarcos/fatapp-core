import * as Nodemailer from 'nodemailer';
import { Response, Request } from 'express';

export class SendMail {

    public async sendMail(params: Request, attachment: any, attachmentName: string): Promise<Response> {

        let transporter = Nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let to = params.query.email;
        let subject = params.body.subject;
        let text = params.body.text;
        let html = params.body.html;

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
            attachments:[
                {
                    "filename": attachmentName,
                    "content": attachment
                }
            ]
        });

        return
    }
}