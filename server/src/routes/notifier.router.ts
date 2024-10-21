import { Router } from "express";
import notifierController from "../controllers/notifier.controller";

// /api/notifier
const router = Router();

router.post('/', notifierController.SendNotify)

export default router;