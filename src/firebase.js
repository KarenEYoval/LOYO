import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYuZRcVM4PBEbgrkSVWAmaGOyDVhT-UqU",
  authDomain: "loyo-59130.firebaseapp.com",
  projectId: "loyo-59130",
  storageBucket: "loyo-59130.appspot.com",
  messagingSenderId: "424343477052",
  appId: "1:424343477052:web:35f3ad1b5a84f04eb4dc39",
  measurementId: "G-KY8WV7F4GJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Ahora sí puedes usar db aquí
export const registrarUsuario = async (user, rol) => {
  await setDoc(doc(db, "usuarios", user.uid), {
    email: user.email,
    rol: rol,
  });
};

export const agregarProducto = async (producto) => {
  try {
    await addDoc(collection(db, "productos"), producto);
    console.log("Producto agregado!");
  } catch (error) {
    console.error("Error al agregar:", error);
  }
};

export const obtenerProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export { db, auth };
export default app;
