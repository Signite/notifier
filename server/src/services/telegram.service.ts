import config from "../utils/config.utils";
import telegramUtil from "../utils/telegram.util";

class TelegramService {

    static async getSettings() {
        return { token: "", name: config.telegram.name };
    }

    static async setSettings(token: string, name: string) {
        config.telegram.setSettings(token, name);
        telegramUtil.init(config.telegram.token, config.telegram.name);
        return { successfully: true };
    }
}

export default TelegramService;