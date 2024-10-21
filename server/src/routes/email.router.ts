import { Router } from "express";
import emailController from "../controllers/email.controller";

// /api/emailer
const EmailRouter = Router();

EmailRouter.get('/', emailController.GetSettings);
EmailRouter.post('/', emailController.SetSettings)

export default EmailRouter