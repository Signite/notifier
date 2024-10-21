import { NextFunction, Request, Response } from "express";
import ContactService from "../services/contact.service";
import ApiError from "../exceptions/api.error";

class ContactController {

    async GetContact(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(await ContactService.GetContact());
    }

    async AddContact(req: Request, res: Response, next: NextFunction) {
        const contact = req.body;
        if (!contact.name) {
            return next(ApiError.BadRequest("Contact name required"));
        }
        const result = await ContactService.AddContact(contact);
        if (result) {
            res.status(201).json(result);
            return;
        }
        res.status(500).send();
    }

    async UpdateContact(req: Request, res: Response, next: NextFunction) {
        const contact = req.body;
        if (!contact.name) {
            return next(ApiError.BadRequest("Contact name required"));
        }
        const result = await ContactService.UpdateContact(contact);
        if (result) {
            res.status(201).json(result);
            return;
        }
        res.status(500).send();
    }

    async RemoveContact(req: Request, res: Response, next: NextFunction) {
        const contact = req.body;
        if (!contact.name) {
            return next(ApiError.BadRequest("Contact name required"));
        }
        const result = await ContactService.RemoveContact(contact);
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.status(500).send();
    }
}

export default new ContactController();