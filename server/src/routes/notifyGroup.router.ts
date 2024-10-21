import { Router } from "express";
import notifyGroupController from "../controllers/notifyGroup.controller";

// /api/notifyGroup

const router = Router();

router.get('/', notifyGroupController.GetGroup);
router.post('/', notifyGroupController.CreateGroup);
router.delete('/', notifyGroupController.DeleteGroup);
router.post('/member', notifyGroupController.AddMember);
router.delete('/member', notifyGroupController.RemoveMember);


// router.put('/', contactController.UpdateContact);


export default router;