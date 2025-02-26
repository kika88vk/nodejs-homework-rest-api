import express from "express";
import authController from "../../controllers/auth-controller.js";
import { isEmptyBody, authenticate, upload } from "../../middlewares/index.js";
import { validateBody } from '../../decorators/index.js';
import { userLoginSchema, userRegisterSchema, userEmailSchema } from "../../models/User.js";

const userRegisterValidate = validateBody(userRegisterSchema);
const userLoginValidate = validateBody(userLoginSchema);
const userEmailValidate = validateBody(userEmailSchema);

const authRouter = express.Router();


authRouter.post("/register", isEmptyBody, userRegisterValidate, authController.register);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("verify", isEmptyBody, userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/login", isEmptyBody, userLoginValidate, authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/", authenticate, authController.updateSubscription);

authRouter.patch("/avatars", upload.single("avatarURL"), authenticate, authController.updateAvatar);


export default authRouter;