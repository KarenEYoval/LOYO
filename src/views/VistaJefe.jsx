import React from "react";
import { useNavigate } from "react-router-dom";

function VistaJefe() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#c8f7c5",
        minHeight: "100vh",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Bienvenida Jefa</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        <button
          onClick={() => navigate("/inventario")}
          style={{
            backgroundColor: "#68b684",
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
  );
}

export default VistaJefe;
