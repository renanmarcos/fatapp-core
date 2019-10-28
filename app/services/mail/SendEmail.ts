import * as Nodemailer from 'nodemailer';
import { Response, Request } from 'express';
import { Attachment } from 'nodemailer/lib/mailer';

export class SendMail {

    public to: Array<string>;
    public subject: string;
    public text: string;
    public attachment: Attachment;
    
    public async send(): Promise<void> {
        let transporter = Nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: this.to,
            subject: this.subject,
            text: this.text,
            attachments: [this.attachment]
        });
    }
}