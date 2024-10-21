import nodeMailer from 'nodemailer';
import config from './config.utils';

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
}

export default Emailer;

// const {taskName, taskLink, errorText} = req.body;
//     let decodedBase64String = (new Buffer(errorText, 'base64')).toString('utf-8'); for save from escape symbols in json
//  mailer.sendSimpleMail({
//     from: 'Техническая поддержка контакт центра <support_kc@esplus.ru>',
//     to: 'Pavel.Bannikov@esplus.ru,Karina.Satuchina@esplus.ru,Ivan.Eyukin@esplus.ru,Maksim.Assonov@esplus.ru,Evgeniy.Kiss@esplus.ru,Dmitriy.Sannikov@esplus.ru,Denis.A.Stepanov@esplus.ru',
//     subject: `Naumen. Ошибка при выполнении задачи "${taskName}"`,
//     bcc: 'stanislav.s.ostrin@tplusgroup.ru',
//     html: `<div>
//             <h3>Произошла ошибка при выполнении задачи</h3>
//             <h3>Задача - ${taskName}</h3>
//             <h3>Ссылка на задачу - ${taskLink}</h3>
//             <h3>Описание ошибки:</h3>
//             <h4>${decodedBase64String}</h4>
//            </div>`
// }, config.mailer);

