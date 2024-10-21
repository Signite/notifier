import fs from 'fs';
import express from 'express';
import sha256 from 'sha256';

import ApiRouter from './routes/api.router';
import errorMiddleware from './middlewares/error.middleware';
import authMiddleware from './middlewares/auth.middleware';
import TgBot from './utils/telegram.util';
import Emailer from './utils/email.utils';
import config from './utils/config.utils';
import cors from 'cors';
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
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.url);
    console.log(req.body);
    // console.log(req);
    next();
})
app.use(authMiddleware);

app.use('/api', ApiRouter);
app.use(express.static("public"));

app.use(errorMiddleware);

app.listen(config.server.port, () => {
    console.log(`Server start at ${config.server.port} port.`);
})




