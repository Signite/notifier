import { NextFunction, Request, Response } from "express";
import TelegramService from "../services/telegram.service";

class TelegramController {

    async getSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const settings = await TelegramService.getSettings();
            if (settings) res.status(200).json(settings);
        } catch (err) {
            next(err);
        }
    }

    async setSettings(req: Request, res: Response, next: NextFunction) {
        const { token, name } = req.body;
        try {
            if (await TelegramService.setSettings(token, name)) {
                res.status(200).json({ mesaage: "Setting applied" });
            }
        } catch (err) {
            next(err);
        }
    }

}

export default new TelegramController();