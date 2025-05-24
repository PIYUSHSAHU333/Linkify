import { Router } from "express";
import {
  login,
  register,
  history,
  addHistory,
  verify,
} from "../controllers/users.controllers.js";
import { asyncWrap } from "../utils/wrapAsync.js";
const router = Router();

router.route("/verifyUser").get(asyncWrap(verify));
router.route("/login").post(asyncWrap(login));
router.route("/register").post(asyncWrap(register));
router.route("/getMeetingHistory").get(asyncWrap(history));
router.route("/addMeetingHistory").post(asyncWrap(addHistory));

export default router;
