import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDb9YTLLoqWiz8n6DIjNNgIAHellTNnVlY",
  authDomain: "viso-maps.firebaseapp.com",
  projectId: "viso-maps",
  storageBucket: "viso-maps.appspot.com",
  messagingSenderId: "530246540568",
  appId: "1:530246540568:web:ec529cbd0150403b79126d",
  measurementId: "G-N0WHPX5RRF"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
