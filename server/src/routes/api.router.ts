import { Router } from "express";
import userRouter from './user.router';
import telegramRouter from './telegram.router';
import notifierRouter from './notifier.router';
import contactRouter from './contact.router';
import notifyGroupRouter from './notifyGroup.router';
import EmailRouter from "./email.router";
// /api
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: "api router" });
})

router.use('/user', userRouter);
router.use('/telegram', telegramRouter);
router.use('/notify', notifierRouter);
router.use('/contact', contactRouter);
router.use('/notifyGroup', notifyGroupRouter);
router.use('/email', EmailRouter);


export default router;