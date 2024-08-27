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
  getProfile,
  updateProf,
  updateCover,
  updateBio,
  addFriend,
  cancelRequest,
  follow,
  unFollow,
  acceptRequest,
  unFriend,
  deleteRequest,
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
router.get("/getProfile/:username", userAuth, getProfile);
router.put("/updateProf", userAuth, updateProf);
router.put("/updateCover", userAuth, updateCover);
router.put("/updateCover/bio", userAuth, updateBio);
router.put("/addFriend/:id", userAuth, addFriend);
router.put("/cancelRequest/:id", userAuth, cancelRequest);
router.put("/follow/:id", userAuth, follow);
router.put("/unFollow/:id", userAuth, unFollow);
router.put("/acceptRequest/:id", userAuth, acceptRequest);
router.put("/unFriend/:id", userAuth, unFriend);
router.put("/deleteRequest/:id", userAuth, deleteRequest);

export default router;
