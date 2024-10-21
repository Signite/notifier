import { Router } from "express";
import contactController from "../controllers/contact.controller";

// /api/contact

const router = Router();

router.get('/', contactController.GetContact);
router.post('/', contactController.AddContact);
router.put('/', contactController.UpdateContact);
router.delete('/', contactController.RemoveContact);

export default router;