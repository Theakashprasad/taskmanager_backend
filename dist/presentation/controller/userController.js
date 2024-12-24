"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ResponseStatus_1 = require("../../services/ResponseStatus");
class UserController {
    //the interactor help to access the user interface repository
    constructor(interactor) {
        //signup fucntionalities and call the interactor
        //SIGN UP
        this.onSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return res
                        .status(ResponseStatus_1.ResponseStatus.BadRequest)
                        .json({ message: "No User Data Provided" });
                }
                const { fullname, email, password } = req.body;
                const generateRandomString = () => {
                    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
                };
                const otp = generateRandomString();
                const data = yield this._interactor.signup(fullname, email, password);
                return res.status(ResponseStatus_1.ResponseStatus.OK).json({ message: `Check ${email}` });
            }
            catch (error) {
                return res.status(ResponseStatus_1.ResponseStatus.BadRequest).json(error);
            }
        });
        this._interactor = interactor;
    }
}
exports.UserController = UserController;
