import ApiError from "../exceptions/api.error";
import Emailer from "../utils/email.utils";
import telegramUtil from "../utils/telegram.util";
import ContactService from "./contact.service";
import NotifyGroupService from "./notifyGroup.service";

export interface iNotifyData {
    text: string | undefined,
    email: string[] | undefined,
    telegram: string[] | undefined,
    groups: string[] | undefined
}

class NotifierService {

    static async SendMessage(notifyData: iNotifyData): Promise<any> {
        if (!notifyData.text) throw ApiError.BadRequest("Text field required");
        const result = {
            errors: []
        }
        const emails: string[] = [];
        const telegramIds: string[] = [];
        const groups = await NotifyGroupService.GetGroup();
        const contacts = await ContactService.GetContact();

        if (notifyData.telegram) telegramIds.push(...notifyData.telegram);
        if (notifyData.email) emails.push(...notifyData.email);

        //Добавление данных из групп
        if (notifyData.groups) {
            for (let group of notifyData.groups) {
                const gInfo = groups.find(item => item.name = group)
                if (gInfo) {
                    gInfo.email.forEach((item) => {
                        const exist = contacts.find(contact => contact.name = item);
                        if (exist) emails.push(exist.email);
                    });
                    gInfo.telegram.forEach((item) => {
                        const exist = contacts.find(contact => contact.name = item);
                        if (exist) telegramIds.push(exist.telegramId);
                    });
                }
            }
        }

        //Отправка телеграм
        for (let id of new Set(telegramIds)) {
            telegramUtil.sendMessage(id, notifyData.text);
        }
        const emailsSet = new Set(emails);
        const emailsStr = Array.from(emailsSet).join(";");
        //Отправка почты
        const mailResult = await Emailer.sendSimpleMail({
            from: "",
            to: emailsStr,
            bcc: "",
            html: "Some erros",
            subject: "asda"
        })
        console.log('MailResult', mailResult);
        
        return { result };
    }
}

export default NotifierService;