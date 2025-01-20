import { Request, Response, NextFunction } from "express";
import NotifierService from "../services/notifier.service";

class NotifierController {
    async SendNotify(req: Request, res: Response, next: NextFunction) {
        try {
            //Convert to new Addresses
            req.body.emails = req.body.email;
            req.body.telegrams = req.body.telegram;
            //Convert END

            const result = await NotifierService.SendMessage(req.body);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    async NotifyV2(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await NotifierService.SendMessageV2(req.body);
            console.log(result);

            res.status(200).json(JSON.parse(JSON.stringify(result, (_key, value) => (value instanceof Set ? [...value] : value))));
        } catch (err) {
            next(err);
        }
    }
}

export default new NotifierController();