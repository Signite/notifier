import nodeMailer from 'nodemailer';
import config from './config.utils';
import { iNotifyClientsList, iNotifyDataV2 } from '../services/notifier.service';

class Emailer {
    public static async sendSimpleMail(mailInfo: { from: string, to: string, subject: string, html: string, bcc: string }) {
        const { host, port, username, password } = config.emailer;
        const { from, to, subject, html, bcc } = mailInfo;
        const transporter = nodeMailer.createTransport({
            host,
            port,
            auth: {
                user: username,
                pass: password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        try {
            let mail = await transporter.sendMail({
                from, to, subject, bcc, html
            });
            return ({ status: 'Mail sended', mail })
        } catch (err) {
            console.log(err);
            return ({ error: err });
        }
    };

    public static async sendEmail(notifyData: iNotifyDataV2, clients: iNotifyClientsList) {
        const { host, port, username, password } = config.emailer;
        // const { from, to, subject, html, bcc } = mailInfo;

        const transporter = nodeMailer.createTransport({
            host,
            port,
            auth: {
                user: username,
                pass: password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let attachments: { filename: string, content: Buffer, cid?: string }[] = [];

        if (notifyData.attachments && notifyData.attachments.length > 0) {
            for (const item of notifyData.attachments) {
                attachments.push({ filename: item.name, content: Buffer.from(item.data, 'base64'), cid: item.cid });
            }
        }
        if (notifyData.message?.email?.splitLetters) {
            for (const dest of clients.emails) {
                try {
                    let mail = await transporter.sendMail({
                        from: notifyData.message?.email?.from || username,
                        to: dest,
                        subject: notifyData.message?.email?.subject || "Notifier message!",
                        html: notifyData.message?.email?.html || notifyData.message?.text || "Пустое сообщение",
                        attachments
                    });
                    console.log(mail);
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            try {
                let mail = await transporter.sendMail({
                    from: notifyData.message?.email?.from || username,
                    to: Array.from(clients.emails).join(";"),
                    subject: notifyData.message?.email?.subject || "Notifier message!",
                    html: notifyData.message?.email?.html || notifyData.message?.text || "Пустое сообщение",
                    attachments
                });
                console.log(mail);
            } catch (err) {
                console.log(err);
            }
        }
    };
}

export default Emailer;

