import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function VistaVentas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({}); // ← cantidades por producto

  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(docs);
    };

    fetchProductos();
  }, []);

  const handleCantidadChange = (id, value) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const registrarVenta = async (producto) => {
    const cantidad = parseInt(cantidades[producto.id], 10);

    if (!cantidad || cantidad <= 0) {
      alert("Ingresa una cantidad válida");
      return;
    }

    const precioUnitario = producto.precioOriginal || producto.precio || 0;
    const total = precioUnitario * cantidad;

    try {
      await addDoc(collection(db, "ventas"), {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidadVendida: cantidad,
        precioUnitario: precioUnitario,
        totalVenta: total,
        fecha: serverTimestamp(),
      });
      alert("Venta registrada con éxito");
      setCantidades((prev) => ({ ...prev, [producto.id]: "" })); // limpiar input
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("Error al registrar la venta");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "3rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "auto",
          maxHeight: "90vh",
          overflowY: "auto",
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
            alignSelf: "flex-start",
          }}
        >
          Regresar
        </button>

        <h1 style={{ fontSize: "2rem", textAlign: "center" }}>
          Vista de Ventas
        </h1>
        <p style={{ textAlign: "center" }}>
          Aquí puedes registrar cuántos productos se han vendido.
        </p>

        {/* Lista de productos */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                {producto.nombre} - $
                {producto.precioOriginal || producto.precio}
              </span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="number"
                  min="1"
                  value={cantidades[producto.id] || ""}
                  onChange={(e) =>
                    handleCantidadChange(producto.id, e.target.value)
                  }
                  placeholder="Cantidad"
                  style={{ width: "80px", padding: "0.3rem" }}
                />
                <button
                  onClick={() => registrarVenta(producto)}
                  style={{
                    backgroundColor: "#4a90e2",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  Vender
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* BOTÓN DE HISTORIAL DE VENTAS */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            onClick={() => navigate("/historial-ventas")}
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Ver Historial de Ventas
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaVentas;
