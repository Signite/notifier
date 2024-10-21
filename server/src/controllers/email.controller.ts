import { Request, Response, NextFunction } from "express";
import EmailService from "../services/email.service";

class EmailController {

    public async GetSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const settings = await EmailService.GetSettings();
            if (settings) res.status(200).json(settings)
        } catch (err) {
            next(err)
        }
    }

    public async SetSettings(req: Request, res: Response, next: NextFunction) {
        const { host, port, username, password } = req.body;
        try {
            if (await EmailService.SetSettings(host, port, username, password)) {
                res.status(200).json({ message: "Settings applied" });
            }
        } catch (err) {
            next(err)
        }
    }
}

export default new EmailController();