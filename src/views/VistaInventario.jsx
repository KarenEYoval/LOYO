import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function VistaJefe() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    };

    fetchProductos();
  }, []);

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
      {/* Recuadro blanco */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "3rem",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Botones */}
        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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

          <button
            onClick={() => navigate("/agregar-producto")}
            style={{
              width: "160px",
              padding: "0.5rem 1rem",
              backgroundColor: "#4a90e2",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Agregar Producto
          </button>
        </div>

        <h1 style={{ fontSize: "2rem", margin: 0, textAlign: "center" }}>
          Bienvenida Jefa
        </h1>
        <h2 style={{ fontSize: "2rem", margin: 0, textAlign: "center" }}>
          Inventario
        </h2>

        {/* Tabla de productos */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              minWidth: "700px",
            }}
          >
            <thead style={{ backgroundColor: "#68b684", color: "#fff" }}>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Hora de venta</th>
                <th>Vendido a</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo || "—"}</td>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio}</td>
                  <td>
                    {p.horaVenta ? new Date(p.horaVenta).toLocaleString() : "—"}
                  </td>
                  <td>{p.vendidoA || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VistaJefe;
