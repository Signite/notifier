import { Request, Response, NextFunction } from "express";
import NotifierService from "../services/notifier.service";

class NotifierController {
    async SendNotify(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await NotifierService.SendMessage(req.body);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new NotifierController();