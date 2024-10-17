const firebase = require("firebase/compat/app");
require("firebase/compat/auth");

const firebaseConfig = {
    apiKey: "AIzaSyBq-1_2nKg6cuIDM2DaKjjsryar6lzdexQ",
    authDomain: "studyhiveauth.firebaseapp.com",
    databaseURL: "https://studyhiveauth-default-rtdb.firebaseio.com",
    projectId: "studyhiveauth",
    storageBucket: "studyhiveauth.appspot.com",
    messagingSenderId: "404852672633",
    appId: "1:404852672633:web:8d4d1e6f9d2ce3d8d7aca8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

module.exports = auth;