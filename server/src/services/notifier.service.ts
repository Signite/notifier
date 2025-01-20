import { ParseMode } from "node-telegram-bot-api";
import ApiError from "../exceptions/api.error";
import Emailer from "../utils/email.utils";
import telegramUtil from "../utils/telegram.util";
import ContactService from "./contact.service";
import NotifyGroupService from "./notifyGroup.service";

interface iNotifyAddresses {
    emails?: string[] | undefined,
    telegrams?: string[] | undefined,
    groups?: string[] | undefined
}

export interface iNotifyData extends iNotifyAddresses {
    text: string | undefined,
}

interface iNotifyAttachment {
    type?: string,
    name: string,
    caption?: string,
    cid?: string,
    data: string
}

export interface iNotifyDataV2 extends iNotifyAddresses {
    message?: {
        text?: string,
        telegram?: {
            type: ParseMode,
            content: string
        },
        email?: {
            splitLetters: boolean,
            from?: string,
            html?: string,
            subject?: string,
        }
    },
    attachments?: iNotifyAttachment[]
}

export interface iNotifyClientsList {
    emails: Set<string>,
    telegrams: Set<string>
}

class NotifierService {

    static async SendMessage(notifyData: iNotifyData): Promise<any> {
        if (!notifyData.text) throw ApiError.BadRequest("Text field required");
        const result = {
            errors: []
        }
        const clients = await getNotifyClientList(notifyData);

        //Отправка телеграм                
        for (let id of clients.telegrams) {
            telegramUtil.sendMessage(id, notifyData.text);
        }

        const emailsSet = clients.emails;
        const emailsStr = Array.from(emailsSet).join(";");

        // Отправка почты
        if (emailsStr) {
            const mailResult = await Emailer.sendSimpleMail({
                from: "",
                to: emailsStr,
                bcc: "",
                html: "Some erros",
                subject: "asda"
            })
            console.log('MailResult', mailResult);
        }

        return { result };
    }

    static async SendMessageV2(data: iNotifyDataV2): Promise<any> {

        const clients = await getNotifyClientList(data);

        if (clients.telegrams?.size > 0) {
            telegramUtil.sendMessageV2(data, clients);
        }

        if (clients.emails?.size > 0) {
            Emailer.sendEmail(data, clients);
        }

        return clients;
    }
}


async function getNotifyClientList(notifyAddresses: iNotifyAddresses): Promise<iNotifyClientsList> {

    const emails: string[] = [];
    const telegramIds: string[] = [];
    const groups = await NotifyGroupService.GetGroup();
    const contacts = await ContactService.GetContact();

    if (notifyAddresses.telegrams) telegramIds.push(...notifyAddresses.telegrams);
    if (notifyAddresses.emails) emails.push(...notifyAddresses.emails);

    //Добавление данных из групп
    if (notifyAddresses.groups) {
        for (let group of notifyAddresses.groups) {
            const gInfo = groups.find(item => item.name == group)
            if (gInfo) {
                gInfo.email.forEach((item) => {
                    const exist = contacts.find(contact => contact.name == item);
                    if (exist) emails.push(exist.email);
                });
                gInfo.telegram.forEach((item) => {
                    const exist = contacts.find(contact => contact.name == item);
                    if (exist) telegramIds.push(exist.telegramId);
                });
            }
        }
    }

    return ({ telegrams: new Set(telegramIds), emails: new Set(emails) });
}

export default NotifierService;