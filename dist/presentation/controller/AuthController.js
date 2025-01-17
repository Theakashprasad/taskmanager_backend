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
exports.AuthController = void 0;
const ResponseStatus_1 = require("../../services/ResponseStatus");
const JwtUtils_1 = require("../../services/JwtUtils");
class AuthController {
    //the interactor help to access the user interface repository
    constructor(register) {
        //SIGN UP
        this.onSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, email, password } = req.body.data;
                const profilePic = "";
                const data = yield this._register.create(fullname, email, password, profilePic);
                res.status(ResponseStatus_1.ResponseStatus.OK).json({ message: fullname });
            }
            catch (error) {
                res.status(ResponseStatus_1.ResponseStatus.BadRequest).json(error);
                return;
            }
        });
        this.onLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body.data;
            try {
                const data = yield this._register.login(email, password);
                const JWTtoken = yield JwtUtils_1.JwtUtils.generateToken(data);
                console.log("asfd", JWTtoken);
                const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                console.log("data", data);
                res
                    .cookie("access_token", JWTtoken, {
                    expires: expiryDate,
                    httpOnly: true, // Ensures it’s not accessible via JS
                    secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
                })
                    .status(200)
                    .json({ data, success: true, token: JWTtoken });
            }
            catch (error) {
                res.status(ResponseStatus_1.ResponseStatus.BadRequest).json(error);
            }
        });
        this._register = register;
    }
}
exports.AuthController = AuthController;
