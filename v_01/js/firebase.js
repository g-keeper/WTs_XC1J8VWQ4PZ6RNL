import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";

const apiKey = "AIzaSyBSKOkDD7QfjTvEIwv-snfYbf17oyb5zyA";
const authDomain = "tehb-a3106.firebaseapp.com";
const databaseURL = "https://tehb-a3106-default-rtdb.europe-west1.firebasedatabase.app";

const app = initializeApp({ apiKey, authDomain, databaseURL });
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

async function init_session(user) {
  if (user) {
    load_screen(1);
    auth_message.classList.remove('active');
    auth_sing_out.style.backgroundImage = `url(${user.photoURL})`;
    application(ref, get, set, getDatabase(app));
  } else {
    load_screen(2);
    auth_sign_in.onclick = () => {
      auth_message.classList.remove('active');
      signInWithPopup(auth, provider)
      .catch(e => auth_message.classList.add('active'));
    }
  }
}

onAuthStateChanged(auth, init_session);

auth_sing_out.onclick = () => {
  if (confirm('Выйти из приложения?'))
    signOut(auth).then(e => window.location.reload());
}