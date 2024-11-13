import nodeMailer from "nodemailer";
import {mailConfig} from "../config/mail.config.js";
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = (to, subject, httmContent) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.POST,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD,
        }
    })

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: httmContent,
    }
    return transport.sendMail(options);
}