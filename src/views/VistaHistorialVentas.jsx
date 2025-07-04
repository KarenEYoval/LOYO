import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

// Función para obtener el inicio de la semana (lunes)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para lunes
  return new Date(d.setDate(diff));
}

// Formatea fecha a string tipo "Semana del dd/mm/yyyy"
function formatWeekLabel(date) {
  return `Semana del ${date.toLocaleDateString()}`;
}

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

  // Agrupa ventas por semana
  const ventasPorSemana = ventas.reduce((acc, venta) => {
    // Convierte la fecha Firestore a Date normal (o null si no hay)
    const fechaVenta = venta.fecha ? venta.fecha.toDate() : null;
    if (!fechaVenta) return acc;

    const inicioSemana = getStartOfWeek(fechaVenta).toDateString();

    if (!acc[inicioSemana]) acc[inicioSemana] = [];
    acc[inicioSemana].push(venta);

    return acc;
  }, {});

  // Ordenar semanas descendentemente (de más reciente a más antiguo)
  const semanasOrdenadas = Object.keys(ventasPorSemana).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
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
          padding: "2rem 3rem",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          width: "100%",
          maxWidth: "900px",
          marginTop: "2rem",
          marginBottom: "2rem",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h1
          style={{
            marginBottom: "2rem",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "#333",
          }}
        >
          Historial de Ventas
        </h1>

        <button
          onClick={() => navigate("/ventas")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#68b684",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "2rem",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#52915c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#68b684")}
        >
          Regresar
        </button>

        {semanasOrdenadas.length === 0 && (
          <p style={{ textAlign: "center", color: "#777", fontSize: "1.1rem" }}>
            No hay ventas registradas.
          </p>
        )}

        {semanasOrdenadas.map((semana) => (
          <section key={semana} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                borderBottom: "2px solid #68b684",
                paddingBottom: "0.3rem",
                marginBottom: "1rem",
                color: "#68b684",
                fontWeight: "600",
                fontSize: "1.4rem",
              }}
            >
              {formatWeekLabel(new Date(semana))}
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 0.75rem",
                  minWidth: "700px",
                }}
              >
                <thead>
                  <tr style={{ color: "#555", fontWeight: "600", fontSize: "1rem" }}>
                    <th
                      style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                      }}
                    >
                      Producto
                    </th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Cantidad</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                      Precio Unitario
                    </th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Total</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPorSemana[semana].map((venta) => (
                    <tr
                      key={venta.id}
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgb(0 0 0 / 0.05)",
                      }}
                    >
                      <td style={{ padding: "1rem", borderRadius: "10px 0 0 10px" }}>
                        {venta.nombre}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        {venta.cantidadVendida}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        ${venta.precioUnitario.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        ${venta.totalVenta.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center", borderRadius: "0 10px 10px 0" }}>
                        {venta.fecha?.toDate().toLocaleString() || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default VistaHistorialVentas;