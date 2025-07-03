import React from "react";
import { useNavigate } from "react-router-dom";

function VistaJefe() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {/* CUADRO BLANCO */}
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem 4rem",
          borderRadius: "20px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          minWidth: "300px",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Bienvenida Jefa</h1>

        <div style={{ display: "flex", gap: "2rem" }}>
          <button
            onClick={() => navigate("/inventario")}
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            Inventario
          </button>
          <button
            onClick={() => navigate("/ventas")}
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            Ventas
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaJefe;
