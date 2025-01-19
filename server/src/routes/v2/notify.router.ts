import { Router } from "express";
import notifierController from "../../controllers/notifier.controller";

// /api/v2/notifier
const router = Router();

router.post('/', notifierController.NotifyV2)

export default router;