import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "../exceptions/api.error";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message, erros: err.errors });
        return;
    }
    res.status(500).json({ message: "Something wrong" });
}

export default errorMiddleware


