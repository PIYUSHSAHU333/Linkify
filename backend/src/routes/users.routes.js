import { Router } from "express";
import { login, register, history, addHistory } from "../controllers/users.controllers.js";

const router = Router()

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/getMeetingHistory").get(history)
router.route("/addMeetingHistory").post(addHistory)

export default router;