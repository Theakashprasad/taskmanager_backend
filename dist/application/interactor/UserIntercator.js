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
exports.UserInteractor = void 0;
class UserInteractor {
    //_repostitory help to connect the iuser repository
    constructor(repository) {
        this.signup = (fullname, email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.create(fullname, email, password);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this._repostitory = repository;
    }
}
exports.UserInteractor = UserInteractor;
