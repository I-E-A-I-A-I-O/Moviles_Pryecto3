"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notifications_1 = __importDefault(require("./routers/notifications"));
const app = express_1.default();
const port = process.env.PORT || 8000;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use('/notifications', notifications_1.default);
app.listen(port, () => {
    console.info(`Server running at port ${port}`);
});
