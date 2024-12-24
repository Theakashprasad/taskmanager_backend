import { Router } from "express";
import { UserRepository } from "../../domain/repositories/userRepository";

import { validateRequest } from "../middleware/ValidateRequest";
import { loginSchema, userSchema } from "../../services/UserValidator";
import { UserRegister } from "../../application/userCase/UserRegister";
import { AuthController } from "../controller/AuthController";
const router = Router();

const repository = new UserRepository();
const register = new UserRegister(repository);
const controller = new AuthController(register);

// For the test purposees
router.get("/a", (req, res) => {
  res.send('helo bhai')
});

router.post(
  "/signUp",
  validateRequest(userSchema),
  controller.onSignup.bind(controller)
);

router.post(
  "/login",
  // validateRequest(loginSchema), 
  controller.onLogin.bind(controller)
);

export default router;
