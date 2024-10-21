import config from "../utils/config.utils"

class EmailService {

    public static async GetSettings() {
        const { host, port, username } = config.emailer;
        return { host, port, username, password: "" }
    }

    public static async SetSettings(host: string, port: string, username: string, password: string) {
        config.emailer.setSettings(host, port, username, password);
        return { successfully: true };
    }

}

export default EmailService;