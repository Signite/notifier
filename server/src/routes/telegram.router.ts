import { Router } from "express";
import telegramController from "../controllers/telegram.controller";

// /api/telegram
const router = Router();

router.get('/', telegramController.getSettings);
router.post('/', telegramController.setSettings);

export default router