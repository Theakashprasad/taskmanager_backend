"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const authrouter_1 = __importDefault(require("./presentation/router/authrouter"));
app.use('/', (req, res) => {
    res.send('helos');
});
app.use("/api/", authrouter_1.default);
app.listen(3000, () => {
    console.log('server is running ...');
});
