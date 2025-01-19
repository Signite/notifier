import express from 'express';

import ApiRouter from './routes/api.router';
import errorMiddleware from './middlewares/error.middleware';
import authMiddleware from './middlewares/auth.middleware';
import TgBot from './utils/telegram.util';
import config from './utils/config.utils';
import cors from 'cors';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || config.server.port || 3000;

//Init TG bot
console.log("Try init telegram bot");
if (config.telegram.token) {
    console.log("TELEGRAM_BOT_API_TOKEN exist. Init bot.");
    TgBot.init(config.telegram.token, config.telegram.name);
} else {
    console.log("Telegram bot data not found. Please enter the telegram bot token and bot name to use it");
}

const app = express();


app.use(cors());

app.use(express.json({limit: "20mb"}));
app.use((req, res, next) => {
    console.log("===== NEW REQUEST =====")
    console.log(new Date());
    console.log(req.url);
    // console.log(req.body);
    console.log("=======================");
    console.log("");
    next();
})

if (process.env.npm_lifecycle_event != 'dev') {
    app.use(authMiddleware);
}


app.use('/api', ApiRouter);
app.use(express.static("public"));

app.use(errorMiddleware);

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.listen(PORT, () => {
    console.log(`Server start at ${PORT} port.`);
})




