import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/api.error";
import NotifyGroupService from "../services/notifyGroup.service";

class NotifyGroupController {

    async GetGroup(req: Request, res: Response, next: NextFunction) {
        res.status(200).json(await NotifyGroupService.GetGroup());
    }

    async CreateGroup(req: Request, res: Response, next: NextFunction) {
        const group = req.body;
        if (!group.name) {
            return next(ApiError.BadRequest("Group name required"));
        }
        const result = await NotifyGroupService.CreateGroup(group.name);
        if (result) {
            res.status(201).json(result);
            return;
        }
        res.status(500).send();
    }

    async DeleteGroup(req: Request, res: Response, next: NextFunction) {
        const group = req.body;
        if (!group.name) {
            return next(ApiError.BadRequest("Group name required"));
        }
        const result = await NotifyGroupService.DeleteGroup(group.name);
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.status(500).send();
    }

    async AddMember(req: Request, res: Response, next: NextFunction) {
        const { group, member, type } = req.body;
        if (!group || !member) {
            return next(ApiError.BadRequest("Provide group and member name"));
        }
        const result = await NotifyGroupService.AddNotifyGroupMember(group, type, member);
        if (result) {
            res.status(201).send();
            return;
        }
        res.status(500).send();
    }

    async RemoveMember(req: Request, res: Response, next: NextFunction) {
        const { group, member, type } = req.body;
        if (!group || !member) {
            return next(ApiError.BadRequest("Provide group and member name"));
        }
        const result = await NotifyGroupService.RemoveNotifyGroupMember(group, type, member);
        if (result) {
            res.status(200).send();
            return;
        }
        res.status(500).send();
    }
}

export default new NotifyGroupController();