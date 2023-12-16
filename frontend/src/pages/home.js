"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const state_1 = require("../state");
class Home extends HTMLElement {
    connectedCallback() {
        this.render();
        const listRooms = this.querySelector(".form-select");
        const roomId = this.querySelector(".roomIdDiv");
        const roomIdInp = this.querySelector(".roomIdInp");
        const input = this.querySelector('input[type="email"]');
        const form = this.querySelector("form");
        const inputEmail = this.querySelector(".form-email");
        const inputName = this.querySelector(".form-name");
        listRooms.addEventListener('change', () => {
            listRooms.value == "existingRoom" ? (roomId.style.display = "block", roomIdInp.disabled = false) : (roomId.style.display = "none", roomIdInp.disabled = true);
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (listRooms.value == "newRoom") {
                state_1.state.setEmailAndName(inputEmail.value, inputName.value);
                state_1.state.signIn(() => {
                    const currentState = state_1.state.getState();
                    if (currentState.userId) {
                        state_1.state.askNewRoom(() => {
                            state_1.state.accesToRoom();
                            router_1.Router.go("/chat");
                        });
                    }
                    else {
                        state_1.state.signUp(() => {
                            state_1.state.askNewRoom(() => {
                                state_1.state.accesToRoom();
                                router_1.Router.go("/chat");
                            });
                        });
                    }
                });
            }
            else if (listRooms.value == "existingRoom") {
                state_1.state.setEmailAndName(inputEmail.value, inputName.value);
                state_1.state.setRoomId(roomIdInp.value);
                state_1.state.signIn(() => {
                    const currentState = state_1.state.getState();
                    if (currentState.userId) {
                        state_1.state.accesToRoom();
                        router_1.Router.go("/chat");
                    }
                    else {
                        state_1.state.signUp(() => {
                            state_1.state.accesToRoom();
                            router_1.Router.go("/chat");
                        });
                    }
                });
            }
        });
    }
    render() {
        const style = document.createElement("style");
        this.innerHTML = `
        <main class="container-fluid d-flex flex-column align-items-center pb-5 mainForm w-100">
    <section class="mainForm-section mb-5 col-12 col-sm-6 col-xxl-5">
      <h2 class="display-6 h2 text-center m-5 fw-bold">Kimi Chat</h2>
      <div class="container-fluid w-100">
      <form>
        <div class="mb-3">
          <label for="personEmail" class="form-label fw-bold fs-5">Email</label>
          <input type="email" class="form-control rounded-pill form-email" id="personEmail" placeholder="Introduce tu email"
            required>
        </div>
        <div class="mb-3">
          <label for="personName" class="form-label fw-bold fs-5">Nombre</label>
          <input type="text" class="form-control rounded-pill form-name" id="personName" placeholder="Introduce tu nombre"
            required>
        </div>
        <div class="mb-3">
          <label for="roomList" class="form-label fw-bold fs-5">Room</label>
          <select class="form-select rounded-pill" aria-label="Default select example" id="roomList">
            <option value="newRoom">Nuevo Room</option>
            <option value="existingRoom">Room Existente</option>
          </select>
        </div>
        <div class="mb-3 roomIdDiv" style="display: none;">
          <label for="roomId" class="form-label fw-bold fs-5"">Room ID</label>
                <input type="number" class="form-control rounded-pill no-arrow roomIdInp" id="roomId"
            placeholder="Introduce el ID" name="roomId" required disabled>
        </div>
        <div class="mb-3 d-flex justify-content-center">
          <button type="submit" class="btn btn-success w-50 mt-4" id="btn-submit">Submit</button>
        </div>
        </form>
      </div>
    </section>
  </main>
        `;
        style.innerHTML = `
        *{
            background-color:#1D2033;
            color:#FFFF;
            font-family: 'Poppins', sans-serif;
        }

        .btn{
            width:200px;
        }

        .form-label{
            font-weight:700;
            font-size:20px;
        }

        .container-form{
            width:400px;
            height:400px;
            border: solid 3px #3A3C4C;
            display:flex;
            flex-direction: row;
            justify-content: center;
        }
        .form-input{
            height:50px;
        }

        .form{
            width:300px;
        
        }

        .container-button{
            margin-top:30px;
        }

        
        `;
        this.appendChild(style);
    }
}
customElements.define("home-page", Home);
