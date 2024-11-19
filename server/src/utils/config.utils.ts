import fs from "fs";
import sha256 from "sha256";

console.log("Config loading");

const CONFIG_FILE_PATH = "../data/config.json"

if (!fs.existsSync(CONFIG_FILE_PATH)) {
    console.log('Config file not exist. Create Config file');
    const baseConfig = {
        server: {
            port: 3000,
            username: 'admin',
            password: sha256('admin')
        },
        telegram: {
            token: '',
            name: ''
        },
        emailer: {
            host: '',
            port: '',
            username: '',
            password: ''
        }
    }

    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(baseConfig));
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf-8' }));

config.server.changePassword = (newPassword: string) => {
    config.server.password = sha256(newPassword);
    configSave();
};

config.telegram.setSettings = (token: string, name: string) => {
    if (token) config.telegram.token = token;
    config.telegram.name = name;
    configSave();
};

config.emailer.setSettings = (host: string, port: string, username: string, password: string) => {
    config.emailer.host = host;
    config.emailer.port = port;
    config.emailer.username = username;
    if (password) config.emailer.password = password;
    configSave();
}

console.log("Config loaded successfully");

function configSave() {
    try {
        fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
    } catch (err) {
        console.error("Config save failed!", err);
    }
}

export default config;