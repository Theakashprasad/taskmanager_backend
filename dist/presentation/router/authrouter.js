"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRepository_1 = require("../../domain/repositories/userRepository");
const userController_1 = require("../controller/userController");
const UserIntercator_1 = require("../../application/interactor/UserIntercator");
const router = (0, express_1.Router)();
const repository = new userRepository_1.UserRepository();
const interactor = new UserIntercator_1.UserInteractor(repository);
const controller = new userController_1.UserController(interactor);
// For the test purposees
// router.post("/a", (req, res) => {
//   console.log(req.body);
// });
router.post("/signup", 
// validateRequest(userSchema),
controller.onSignup.bind(controller));
exports.default = router;
