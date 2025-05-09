// import { collection, addDoc } from "firebase/auth";
import { db } from "./firebaseConfig.js";

// Guardar historial de inicio de sesión en Firestore
export async function saveLoginHistory(user) {
    const loginHistoryRef = collection(db, "loginHistory");
    return addDoc(loginHistoryRef, {
        userId: user.uid,
        email: user.email,
        loginTime: new Date().toISOString(),
    })
        .then(() => console.log("Historial de inicio de sesión guardado."))
        .catch(error => console.error("Error al guardar el historial: ", error));
}
