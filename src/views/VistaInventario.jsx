import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function VistaJefe() {
  const [productos, setProductos] = useState([]);

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
        backgroundColor: "#c8f7c5",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Bienvenida Jefa</h1>
      <h2 style={{ fontSize: "2rem" }}>Inventario</h2>

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
  );
}

export default VistaJefe;
