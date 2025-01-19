import { Router } from "express";
import notifyRouter from "./notify.router";


// /api/v2
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "api v2 router" });
})

router.use('/notify', notifyRouter);

export default router;