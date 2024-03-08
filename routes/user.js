import express from "express";
import {
  register,
  activateAccount,
  login,
  auth,
  findUser,
  sendResetPasswordCode,
  resetCodeValidations,
  changePasswords,
} from "../controllers/user.js";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/activate", userAuth, activateAccount);
router.post("/findUser", findUser);
router.post("/login", login);
router.post("/auth", userAuth, auth);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/resetCodeValidations", resetCodeValidations);
router.post("/changePasswords", changePasswords);

export default router;
