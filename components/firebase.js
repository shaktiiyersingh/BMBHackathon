import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAUZCYcXT-uPNGLxYlU7lXWpw4qz0LDDJk",
    authDomain: "learning-react-a228b.firebaseapp.com",
    databaseURL: "https://learning-react-a228b-default-rtdb.firebaseio.com",
    projectId: "learning-react-a228b",
    storageBucket: "learning-react-a228b.appspot.com",
    messagingSenderId: "636446916577",
    appId: "1:636446916577:web:5d0623f2a94d2d185cdca0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore
const db = firebase.firestore();

export default db;
