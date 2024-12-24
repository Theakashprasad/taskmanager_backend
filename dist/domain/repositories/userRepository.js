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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
class UserRepository {
    constructor() {
        this.create = (fullname, email, password, profilePic) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    fullname,
                    email,
                    password,
                    profilePic,
                };
                const newuser = yield userModel_1.default.create(user);
                console.log(newuser, "created");
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.findUser = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newuser = yield userModel_1.default.findOne({ email });
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;