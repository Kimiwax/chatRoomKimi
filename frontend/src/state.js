"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const API_BASE_URL = "http://localhost:2000";
const rtdb_1 = require("./rtdb");
const database_1 = require("firebase/database");
const map_1 = require("lodash/map");
const state = {
    data: {
        fullName: "",
        email: "",
        userId: "",
        roomId: "",
        messages: [],
        rtbRoomId: ""
    },
    listeners: [],
    init() {
        const lastStorageState = localStorage.getItem("state");
    },
    listenRoom() {
        const cs = this.getState();
        const chatRoomsRef = (0, database_1.ref)(rtdb_1.rtdb, "/rooms/" + cs.rtbRoomId);
        (0, database_1.onValue)(chatRoomsRef, (snapshot) => {
            const currentState = this.getState();
            const messagesFromServer = snapshot.val();
            console.log(messagesFromServer);
            const messagesList = (0, map_1.default)(messagesFromServer.messages);
            currentState.messages = messagesList;
            this.setState(currentState);
        });
    },
    setEmailAndName(email, fullName) {
        const currentState = this.getState();
        currentState.fullName = fullName;
        currentState.email = email;
        this.setState(currentState);
    },
    setRoomId(roomId) {
        const currentState = this.getState();
        currentState.roomId = roomId;
        this.setState(currentState);
    },
    getState() {
        return this.data;
    },
    signIn(callback) {
        const cs = this.getState();
        if (cs.email) {
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email, fullname: cs.fullName })
            }).then(res => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                // console.log(data);
                this.setState(cs);
                callback();
            });
        }
        else {
            console.error("No hay un email en el state");
            callback(true);
        }
    },
    signUp(callback) {
        const cs = this.getState();
        if (cs.email) {
            fetch(API_BASE_URL + "/signup", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email, nombre: cs.fullName })
            }).then(res => {
                return res.json();
            }).then(data => {
                cs.userId = data.id;
                console.log(data);
                this.setState(cs);
                callback();
            });
        }
        else {
            console.error("No hay un email en el state");
            callback(true);
        }
    },
    askNewRoom(callback) {
        const cs = this.getState();
        if (cs.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then(res => {
                return res.json();
            }).then(data => {
                cs.roomId = data.id;
                this.setState(cs);
                if (callback) {
                    callback();
                }
            });
        }
        else {
            console.log("no hay userId");
        }
    },
    accesToRoom(callback) {
        const cs = this.getState();
        const roomId = cs.roomId;
        console.log(roomId + " Soy accesroom");
        fetch(API_BASE_URL + "/room/" + roomId + "?userId=" + cs.userId, {}).then(res => {
            return res.json();
        }).then(data => {
            cs.rtbRoomId = data.rtdbRoomId;
            console.log(data + "log");
            this.setState(cs);
            this.listenRoom();
            if (callback)
                callback();
        });
    },
    setName(pName) {
        const currentState = this.getState();
        currentState.nombre = pName;
        this.setState(currentState);
    },
    pushMessage(message) {
        const nombreDelState = this.data.fullName;
        const roomIDlargo = this.data.rtbRoomId;
        console.log(nombreDelState, message, roomIDlargo);
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ from: nombreDelState, messages: message, roomId: roomIDlargo })
        });
    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        localStorage.setItem("state", JSON.stringify(newState));
        console.log("Soy el state, he cambiado", this.data);
    },
    subscribe(callback) {
        this.listeners.push(callback);
    }
};
exports.state = state;
