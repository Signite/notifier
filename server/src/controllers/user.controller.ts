import { NextFunction, RequestHandler } from "express";
import { Request, Response } from 'express';
import UserService from "../services/user.service";
import ApiError from "../exceptions/api.error";

class UserController {

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password, newPassword } = req.body;
            const result = await UserService.ChangePassword(username, password, newPassword);
            if (result.successfully) {
                res.status(200).json({ message: "Password was changed successfully" });
            } else {
                throw ApiError.InternalServerError("Password not be changed");
            }
        } catch (err) {
            next(err)
        }
    }
}

export default new UserController();