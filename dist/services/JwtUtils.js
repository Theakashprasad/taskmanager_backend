"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JwtUtils {
    // to generate token for sending to frontend
    static generateToken(val) {
        const expiresIn = "1h";
        const secret = process.env.MY_SECRET;
        console.log('token string', secret);
        const token = jsonwebtoken_1.default.sign({ id: val._id }, secret, {
            expiresIn,
        });
        console.log(token);
        return token;
    }
    // middleware for checking if the jwt token is valid or not
    static verifyToken(req, res, next) {
        const token = req.cookies.access_token;
        if (!token)
            return next(createError(401, "You are not authenticated!"));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.MY_SECRET);
            req.userId = decoded.id;
            next();
        }
        catch (error) {
            next(createError(401, "Invalid token"));
        }
    }
}
exports.JwtUtils = JwtUtils;
function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
