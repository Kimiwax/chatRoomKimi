"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./pages/home");
require("./pages/chat");
require("./router");
const state_1 = require("./state");
state_1.state.init();
/*
import { state } from "./state";

(function () {
  state.init();
  state.setEmailAndName("pame@gmais.com", "Pamela");
  state.signIn(err => {
    if (err) console.log("Hubo un error en el signIn");
    state.askNewRoom(() => {
      state.accesToRoom();
    });
  });

 
  state.init();
  const cs = state.getState();
})();
*/ 
