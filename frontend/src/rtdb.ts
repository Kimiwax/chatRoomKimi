import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database"

const firebasedbt = {
  apiKey: "dd8R38OChnXXqD6haJbkSl75maTpZQEop5HzMhNh",
  databaseURL: "https://apx-dwf6-default-rtdb.firebaseio.com",
  authDomain: "apx-dwf6.firebaseapp.com",
};

const app = initializeApp(firebasedbt)
const rtdb = getDatabase(app)
export { rtdb };
