import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAk6i_D75EzAgqZjk9Lg5mY1ivBDBa-qMk",
    authDomain: "whatsapp-57dbc.firebaseapp.com",
    projectId: "whatsapp-57dbc",
    storageBucket: "whatsapp-57dbc.appspot.com",
    messagingSenderId: "240622167001",
    appId: "1:240622167001:web:306fa4ba20dbb3a09fefc8",
  };

const app = !firebase.apps.length
 ? firebase.initializeApp(firebaseConfig)
 : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider };