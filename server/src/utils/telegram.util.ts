import TelegramBot from "node-telegram-bot-api";

class TgBot {
    _bot: TelegramBot | null = null;

    async init(token: string, name: string) {
        this._bot?.stopPolling();
        const bot = new TelegramBot(token, {
            // request: {
            //     url:"api.telegram.org",
            //     proxy:""
            // }
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
            console.log('TG SendMessage Error',id, text);
        }

    }
};


export default new TgBot();