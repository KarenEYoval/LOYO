// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYuZRcVM4PBEbgrkSVWAmaGOyDVhT-UqU",
  authDomain: "loyo-59130.firebaseapp.com",
  projectId: "loyo-59130",
  storageBucket: "loyo-59130.appspot.com", // CORREGIDO: debe ser .appspot.com
  messagingSenderId: "424343477052",
  appId: "1:424343477052:web:35f3ad1b5a84f04eb4dc39",
  measurementId: "G-KY8WV7F4GJ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

// Función para agregar un producto a Firestore
export const agregarProducto = async (producto) => {
  try {
    await addDoc(collection(db, "productos"), producto);
    console.log("Producto agregado!");
  } catch (error) {
    console.error("Error al agregar:", error);
  }
};

// Función para obtener los productos desde Firestore
export const obtenerProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
