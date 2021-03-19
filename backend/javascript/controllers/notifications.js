"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToken = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const registerToken = async (req, res) => {
    const { token } = req.body;
    try {
        await firebase_admin_1.default.messaging().sendToDevice([token], {
            notification: {
                title: 'Manga Reader',
                body: 'Hello',
                sound: 'default'
            }
        }, {
            priority: 'high'
        });
        res.status(200).send('Yes jeje');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('error');
    }
};
exports.registerToken = registerToken;
