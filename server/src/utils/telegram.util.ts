import TelegramBot from "node-telegram-bot-api";
import { iNotifyClientsList, iNotifyDataV2 } from "../services/notifier.service";

//Activate this for sending files
// process.env.NTBA_FIX_319 = "true"; //Not know what is it
process.env.NTBA_FIX_350 = "true";

const PROXY = process.env.PROXY_HTTPS || ""

interface TelegramMessage {
    chatId: string;
    message: string;
    messageType: string;
    filtes: TelegramFile[];
}

interface TelegramFile {
    content: string,
    name: string;
}

class TgBot {
    _bot: TelegramBot | null = null;

    async init(token: string, name: string) {
        this._bot?.stopPolling();
        const bot = new TelegramBot(token, {
            request: {
                url: "api.telegram.org",
                proxy: PROXY
            },
            polling: true
        });

        bot.on("polling_error", err => { console.log(err.message); bot.stopPolling() });

        bot.on("text", async msg => {
            // console.log(msg);
            // console.log('TG TEXT');
            if (msg.from) {
                if (msg.text === `${name} show ids`) {
                    bot.sendMessage(
                        msg.chat.id,
                        `ИД чата \\- \`${String(msg.chat.id).replace('-', '\\-')}\`\\.`,
                        { parse_mode: "MarkdownV2" });
                    return;
                }
                if (msg.from.id === msg.chat.id) {
                    bot.sendMessage(
                        msg.chat.id,
                        "Для активации бота в группе:\n\\- Добавьте бота в группу\\.\n\\- Добавьте ид чата в панели управления оповещателя\n\nПолучить ИД пользователя/чата можно через инлайн команду @" + name + " \"Покажи идентификаторы\"\nP\\.S\\. Не забудьте активировать inline mode бота у @BotFather",
                        { parse_mode: "MarkdownV2" }
                    );
                    return;
                }
            }
        });

        bot.on("inline_query", (query) => {

            const { id } = query;
            // console.log(query, 'INLINE QUERY');
            bot.answerInlineQuery(id, [{ type: 'article', id: '1', title: 'Покажи идентификаторы', input_message_content: { message_text: `${name} show ids` } }]);
        });
        this._bot = bot;
    }

    async sendMessage(id: string, text: string) {
        try {
            const result = await this._bot?.sendMessage(id, text);
            return result;
        } catch (err) {
            console.log('TG SendMessage Error', id, text);
        }

    }

    async sendMessageV2(notifyData: iNotifyDataV2, clients: iNotifyClientsList) {
        try {
            if (notifyData.message) {
                if (notifyData.message.telegram?.content) {
                    for (const dest of clients.telegrams) {
                        await this._bot?.sendMessage(dest, notifyData.message.telegram.content, { parse_mode: notifyData.message.telegram.type });
                    }
                }
                else if (notifyData.message.text) {
                    for (const dest of clients.telegrams) {
                        await this._bot?.sendMessage(dest, notifyData.message.text);
                    }
                }
            }

            if (notifyData.attachments && notifyData.attachments.length > 0) {
                const cachedAttachments: { id: string, caption?: string }[] = [];
                for (const dest of clients.telegrams) {
                    if (cachedAttachments.length > 0) {
                        for (const item of cachedAttachments) {
                            await this._bot?.sendDocument(dest, item.id, { caption: item.caption });
                        }
                    } else {
                        for (const item of notifyData.attachments) {
                            const result = await this._bot?.sendDocument(dest, Buffer.from(item.data, 'base64'), { caption: item.caption }, { filename: item.name });
                            if (result?.document?.file_id) cachedAttachments.push({ id: result.document.file_id, caption: item.caption });
                        }
                    }
                }
            }
        } catch (err) {
            console.log('ERROR TELEGRAM SendMessageV2', err);
        }




        // }
        // if (notifyData.message?.telegram?.content)

        // if (notifyData.telegrams)
        // console.log(notifyData.telegrams && notifyData.attachments);
        // try {
        //     if (notifyData.telegrams && notifyData.attachments) {
        //         const result = await this._bot?.sendDocument(notifyData.telegrams[0], Buffer.from(notifyData.attachments[0].data, 'base64'));
        //         console.log('result ',result);
        //         return result;
        //     }
        // } catch (err) {
        //     console.log('TG SendMessageV2 Error');
        // }
    }
};


export default new TgBot();