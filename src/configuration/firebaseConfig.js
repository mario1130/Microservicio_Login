import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYCcgUApIRY_mR3-iyO043T_UiVFVX58A",
    authDomain: "kreator3prueba.firebaseapp.com",
    projectId: "kreator3prueba",
    storageBucket: "kreator3prueba.firebasestorage.app",
    messagingSenderId: "108843857087",
    appId: "1:108843857087:web:f136ef475cde8eb61f420a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
