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
exports.UserRegister = void 0;
const HashUtils_1 = require("../../services/HashUtils");
class UserRegister {
    //_repostitory help to connect the iuser repository
    constructor(repository) {
        this.create = (fullname, email, password, profilePic) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield HashUtils_1.HashUtils.hashPassword(password);
                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${fullname}`;
                return yield this._repostitory.create(fullname, email, hashedPassword, (profilePic = boyProfilePic));
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.login = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._repostitory.findUser(email);
                if (!response)
                    return null;
                const comparePassword = yield HashUtils_1.HashUtils.comparePassword(password, response.password);
                if (comparePassword) {
                    return response;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this._repostitory = repository;
    }
}
exports.UserRegister = UserRegister;
