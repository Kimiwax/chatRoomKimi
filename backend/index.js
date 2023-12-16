"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const nanoid_1 = require("nanoid");
const cors = require("cors");
const port = 2000;
const app = express();
app.use(express.json());
app.use(cors());
// Auth
// SignUp
const userCollection = db_1.firestore.collection("users");
const roomCollection = db_1.firestore.collection("rooms");
app.post("/signup", (req, res) => {
    const email = req.body.email;
    const nombre = req.body.nombre;
    userCollection.where("email", "==", email).get().then(searchResponse => {
        if (searchResponse.empty) {
            userCollection.add({ email, nombre }).then(newUserRef => {
                res.json({ id: newUserRef.id });
            });
        }
        else {
            res.status(400).json({ message: "User Already Exists 🤨" });
        }
    });
});
// //Verifica si existe el mail
app.post("/auth", (req, res) => {
    const { email } = req.body;
    userCollection.where("email", "==", email).get().then(searchResponse => {
        if (searchResponse.empty) {
            res.status(404).json({ message: "Not Found" });
        }
        else {
            res.json({ id: searchResponse.docs[0].id });
        }
    });
});
/*Alternativa donde solo se comprueba el email y se devuelve el id de ese email
app.post("/auth", (req, res) => {
  const { email } = req.body;

  userCollection
    .where("email", "==", email)
    .get()
    .then(searchResponse => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "Not Founds",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});
*/
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    userCollection.doc(userId.toString()).get().then(doc => {
        if (doc.exists) {
            const roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef.set({ messages: [], owner: userId }).then(() => {
                const roomLongId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999);
                roomCollection.doc(roomId.toString()).set({ rtdbRoomId: roomLongId }).then(() => {
                    res.json({ id: roomId.toString() });
                });
            });
        }
        else {
            res.status(401).json({ message: "no existis" });
        }
    });
});
// /Endpoit para reconectarse a una room
app.get("/room/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    userCollection.doc(userId.toString()).get().then(doc => {
        if (doc.exists) {
            roomCollection.doc(roomId).get().then(snap => {
                const data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({ message: "no existis" });
        }
    });
});
app.post("/messages", (req, res) => {
    const roomId = req.body.roomId;
    const chatRoom = db_1.rtdb.ref("rooms/" + roomId + "/messages");
    const message = {
        from: req.body.from,
        messages: req.body.messages
    };
    chatRoom.push(message, () => {
        res.json("Mensajes agregados correctamente");
        console.log(req.body);
    });
});
app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "../dist/index.html");
});
app.get("/", (req, res) => {
    res.send("el GET esta funcionando");
});
// Abre el puerto a la espera de ordenes
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
