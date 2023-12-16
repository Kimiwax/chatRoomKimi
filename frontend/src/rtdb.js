"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const firebasedbt = {
    apiKey: "dd8R38OChnXXqD6haJbkSl75maTpZQEop5HzMhNh",
    databaseURL: "https://apx-dwf6-default-rtdb.firebaseio.com",
    authDomain: "apx-dwf6.firebaseapp.com",
};
const app = (0, app_1.initializeApp)(firebasedbt);
const rtdb = (0, database_1.getDatabase)(app);
exports.rtdb = rtdb;
