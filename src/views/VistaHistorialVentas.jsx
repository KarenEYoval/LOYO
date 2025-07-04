import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function VistaHistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      const ventasRef = collection(db, "ventas");
      const q = query(ventasRef, orderBy("fecha", "desc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVentas(docs);
    };

    fetchVentas();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => navigate("/ventas")}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#68b684",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Regresar
      </button>

      <h2 style={{ textAlign: "center" }}>Historial de Ventas</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.nombre}</td>
              <td>{venta.cantidadVendida}</td>
              <td>${venta.precioUnitario}</td>
              <td>${venta.totalVenta}</td>
              <td>{venta.fecha?.toDate().toLocaleString() || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VistaHistorialVentas;
