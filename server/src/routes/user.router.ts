import { Router } from "express";
import userController from "../controllers/user.controller";


// /api/user
const router = Router();

router.post('/',  userController.changePassword);

export default router

