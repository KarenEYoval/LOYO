import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function VistaVentas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    console.log("Producto agregado:", producto);
    // Aquí podrías agregar lógica para añadirlo a un estado de carrito
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "3rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/jefe")}
          style={{
            width: "120px",
            padding: "0.5rem 1rem",
            backgroundColor: "#68b684",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Regresar
        </button>

        <h1 style={{ fontSize: "2rem", textAlign: "center" }}>Vista de Ventas</h1>
        <p style={{ textAlign: "center" }}>Aquí puedes registrar las ventas.</p>

        {/* Lista de productos */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {productos.map((producto) => (
            <li
              key={producto.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 1rem",
                borderBottom: "1px solid #ccc",
              }}
            >
              <span>
                {producto.nombre} - ${producto.precio}
              </span>
              <button
                onClick={() => agregarAlCarrito(producto)}
                style={{
                  backgroundColor: "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VistaVentas;
