"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRepository_1 = require("../../domain/repositories/userRepository");
const ValidateRequest_1 = require("../middleware/ValidateRequest");
const UserValidator_1 = require("../../services/UserValidator");
const UserRegister_1 = require("../../application/userCase/UserRegister");
const AuthController_1 = require("../controller/AuthController");
const router = (0, express_1.Router)();
const repository = new userRepository_1.UserRepository();
const register = new UserRegister_1.UserRegister(repository);
const controller = new AuthController_1.AuthController(register);
// For the test purposees
router.get("/a", (req, res) => {
    res.send('helo bhai');
});
router.post("/signUp", (0, ValidateRequest_1.validateRequest)(UserValidator_1.userSchema), controller.onSignup.bind(controller));
router.post("/login", 
// validateRequest(loginSchema), 
controller.onLogin.bind(controller));
exports.default = router;
