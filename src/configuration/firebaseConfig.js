import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Configuración de Firebase
const firebaseConfig = {
    apiKey: 
    authDomain: 
    projectId: 
    storageBucket: 
    messagingSenderId: 
    appId: 
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
