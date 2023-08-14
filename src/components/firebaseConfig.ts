import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore/lite'

const firebaseConfig = {
    apiKey: "AIzaSyCa9E042ZIok4nq0YJNMjzIPV89F35NG3Q",
    authDomain: "todo-list-1c7e9.firebaseapp.com",
    databaseURL: "https://todo-list-1c7e9-default-rtdb.firebaseio.com",
    projectId: "todo-list-1c7e9",
    storageBucket: "todo-list-1c7e9.appspot.com",
    messagingSenderId: "397861056617",
    appId: "1:397861056617:web:ed58006e685cbf0c1c32f8",
    measurementId: "G-WGMN5RWSGF"
  };
  

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);